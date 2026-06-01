const REQUEST_TIMEOUT_MS = 28_000;
const MAX_ATTEMPTS_PER_MODEL = 2;

/** Models available on Google AI (generativelanguage.googleapis.com) free tier. */
const DEFAULT_FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
];

import type { ChatTurn } from "@/lib/chat/types";

type GeminiContent = {
  role: "user" | "model";
  parts: { text: string }[];
};

export type GeminiResult =
  | { ok: true; text: string; model: string }
  | { ok: false; reason: string; status?: number };

function toGeminiContents(turns: ChatTurn[]): GeminiContent[] {
  return turns.map((turn) => ({
    role: turn.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: turn.content }],
  }));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function modelList(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim();
  const list = primary ? [primary, ...DEFAULT_FALLBACK_MODELS] : DEFAULT_FALLBACK_MODELS;
  return Array.from(new Set(list));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

/** Prefer quota/auth errors over "model not found" when every model fails. */
function failurePriority(result: Extract<GeminiResult, { ok: false }>): number {
  if (result.status === 429) return 100;
  if (result.status === 403 || result.status === 401) return 90;
  if (result.reason === "empty_candidate") return 80;
  if (result.status === 503) return 70;
  if (result.status === 504 || result.reason === "timeout") return 60;
  if (result.status === 404) return 10;
  return 40;
}

function pickFailure(
  current: Extract<GeminiResult, { ok: false }>,
  candidate: Extract<GeminiResult, { ok: false }>
): Extract<GeminiResult, { ok: false }> {
  return failurePriority(candidate) > failurePriority(current)
    ? candidate
    : current;
}

function extractReplyText(data: {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
}): string | null {
  const candidate = data.candidates?.[0];
  if (!candidate?.content?.parts?.length) return null;

  const reason = candidate.finishReason;
  if (reason === "SAFETY" || reason === "RECITATION") return null;

  const text = candidate.content.parts
    .map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  return text || null;
}

async function callGeminiModel(
  apiKey: string,
  model: string,
  systemInstruction: string,
  contents: GeminiContent[]
): Promise<GeminiResult> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.82,
          topP: 0.92,
          maxOutputTokens: 512,
          // 2.5 Flash uses thinking tokens against maxOutputTokens; without this,
          // replies can be empty (finishReason MAX_TOKENS, no text parts).
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    const raw = await response.text();
    let data: Parameters<typeof extractReplyText>[0] = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return {
        ok: false,
        reason: "invalid_json",
        status: response.status,
      };
    }

    if (!response.ok) {
      const apiMessage =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error?: { message?: string } }).error?.message === "string"
          ? (data as { error: { message: string } }).error.message
          : raw.slice(0, 120);

      console.error("[ai-chat] Gemini HTTP error", {
        model,
        status: response.status,
        apiMessage,
      });

      return {
        ok: false,
        reason: apiMessage || `http_${response.status}`,
        status: response.status,
      };
    }

    const text = extractReplyText(data);
    if (!text) {
      console.error("[ai-chat] Empty Gemini candidate", { model, data });
      return { ok: false, reason: "empty_candidate" };
    }

    return { ok: true, text, model };
  } catch (error) {
    const message = error instanceof Error ? error.message : "network_error";
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || message.includes("aborted"));

    console.error("[ai-chat] Gemini request failed", { model, message });

    return {
      ok: false,
      reason: isTimeout ? "timeout" : message,
      status: isTimeout ? 504 : undefined,
    };
  }
}

export async function generateGeminiReply(
  apiKey: string,
  systemInstruction: string,
  turns: ChatTurn[]
): Promise<GeminiResult> {
  const contents = toGeminiContents(turns);
  const models = modelList();
  let lastFailure: GeminiResult = { ok: false, reason: "unknown" };

  for (const model of models) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt++) {
      const result = await callGeminiModel(
        apiKey,
        model,
        systemInstruction,
        contents
      );

      if (result.ok) return result;

      lastFailure = pickFailure(lastFailure, result);

      const retryable =
        result.status === undefined || isRetryableStatus(result.status);
      // 404 = retired model id — try next model, do not retry same id.
      if (!retryable && result.status !== 404) break;

      if (attempt < MAX_ATTEMPTS_PER_MODEL - 1) {
        await sleep(500 * (attempt + 1));
      }
    }
  }

  return lastFailure;
}
