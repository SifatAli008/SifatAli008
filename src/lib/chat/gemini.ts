const REQUEST_TIMEOUT_MS = 28_000;
const MAX_ATTEMPTS_PER_MODEL = 2;

const DEFAULT_FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

type GeminiContent = {
  role: "user" | "model";
  parts: { text: string }[];
};

type GeminiResult =
  | { ok: true; text: string; model: string }
  | { ok: false; reason: string; status?: number };

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
          maxOutputTokens: 380,
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
  contents: GeminiContent[]
): Promise<GeminiResult> {
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

      lastFailure = result;

      const retryable =
        result.status === undefined || isRetryableStatus(result.status);
      if (!retryable) break;

      if (attempt < MAX_ATTEMPTS_PER_MODEL - 1) {
        await sleep(500 * (attempt + 1));
      }
    }
  }

  return lastFailure;
}

export function userFacingGeminiError(reason: string, status?: number): string {
  if (status === 429 || reason.includes("RESOURCE_EXHAUSTED")) {
    return "Too many requests at once - wait a few seconds and try again.";
  }
  if (status === 504 || reason === "timeout") {
    return "That took too long - try again with a shorter question.";
  }
  if (status === 503 || status === 502 || status === 500) {
    return "The AI service is busy right now - try again in a moment.";
  }
  return "I could not reach the AI model right now - try again in a moment.";
}
