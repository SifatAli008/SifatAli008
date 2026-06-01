import type { ChatResult, ChatTurn } from "@/lib/chat/types";

const REQUEST_TIMEOUT_MS = 28_000;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const DEFAULT_MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemini-2.0-flash-exp:free",
];

function modelList(): string[] {
  const primary = process.env.OPENROUTER_MODEL?.trim();
  const list = primary ? [primary, ...DEFAULT_MODELS] : DEFAULT_MODELS;
  return Array.from(new Set(list));
}

function toOpenRouterMessages(
  systemInstruction: string,
  turns: ChatTurn[]
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  return [
    { role: "system", content: systemInstruction },
    ...turns.map((turn) => ({
      role: turn.role,
      content: turn.content,
    })),
  ];
}

function extractReplyText(data: {
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
}): string | null {
  const choice = data.choices?.[0];
  if (!choice?.message?.content) return null;
  if (choice.finish_reason === "content_filter") return null;
  const text = choice.message.content.trim();
  return text || null;
}

async function callOpenRouterModel(
  apiKey: string,
  model: string,
  systemInstruction: string,
  turns: ChatTurn[]
): Promise<ChatResult> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sifatali.dev";

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": "Sifat Ali Portfolio Chat",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model,
        messages: toOpenRouterMessages(systemInstruction, turns),
        temperature: 0.82,
        max_tokens: 512,
      }),
    });

    const raw = await response.text();
    let data: Parameters<typeof extractReplyText>[0] & {
      error?: { message?: string };
    } = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return {
        ok: false,
        provider: "openrouter",
        reason: "invalid_json",
        status: response.status,
      };
    }

    if (!response.ok) {
      const apiMessage =
        typeof data.error?.message === "string"
          ? data.error.message
          : raw.slice(0, 120);

      console.error("[ai-chat] OpenRouter HTTP error", {
        model,
        status: response.status,
        apiMessage,
      });

      return {
        ok: false,
        provider: "openrouter",
        reason: apiMessage || `http_${response.status}`,
        status: response.status,
      };
    }

    const text = extractReplyText(data);
    if (!text) {
      console.error("[ai-chat] Empty OpenRouter choice", { model, data });
      return {
        ok: false,
        provider: "openrouter",
        reason: "empty_candidate",
      };
    }

    return { ok: true, text, provider: "openrouter", model };
  } catch (error) {
    const message = error instanceof Error ? error.message : "network_error";
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || message.includes("aborted"));

    console.error("[ai-chat] OpenRouter request failed", { model, message });

    return {
      ok: false,
      provider: "openrouter",
      reason: isTimeout ? "timeout" : message,
      status: isTimeout ? 504 : undefined,
    };
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

export async function generateOpenRouterReply(
  apiKey: string,
  systemInstruction: string,
  turns: ChatTurn[]
): Promise<ChatResult> {
  const models = modelList();

  for (const model of models) {
    const result = await callOpenRouterModel(
      apiKey,
      model,
      systemInstruction,
      turns
    );
    if (result.ok) return result;

    const status = !result.ok ? result.status : undefined;
    if (status === 404) continue;
    if (status !== undefined && !isRetryableStatus(status)) continue;
  }

  return {
    ok: false,
    provider: "openrouter",
    reason: "all_models_failed",
    status: 503,
  };
}
