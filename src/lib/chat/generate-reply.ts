import { generateGeminiReply } from "@/lib/chat/gemini";
import { generateGroqReply } from "@/lib/chat/groq";
import { generateOpenRouterReply } from "@/lib/chat/openrouter";
import type { ChatResult, ChatTurn } from "@/lib/chat/types";

function failurePriority(result: Extract<ChatResult, { ok: false }>): number {
  if (result.status === 429) return 100;
  if (result.status === 403 || result.status === 401) return 90;
  if (result.reason === "empty_candidate") return 80;
  if (result.status === 503) return 70;
  if (result.status === 504 || result.reason === "timeout") return 60;
  if (result.status === 404) return 10;
  return 40;
}

function pickFailure(
  current: Extract<ChatResult, { ok: false }>,
  candidate: Extract<ChatResult, { ok: false }>
): Extract<ChatResult, { ok: false }> {
  return failurePriority(candidate) > failurePriority(current)
    ? candidate
    : current;
}

/**
 * Try Gemini, then Groq, then OpenRouter when earlier providers fail.
 */
export async function generateChatReply(
  systemInstruction: string,
  turns: ChatTurn[]
): Promise<ChatResult> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

  let lastFailure: Extract<ChatResult, { ok: false }> = {
    ok: false,
    reason: "no_provider_configured",
    status: 503,
  };

  if (geminiKey) {
    const gemini = await generateGeminiReply(
      geminiKey,
      systemInstruction,
      turns
    );
    if (gemini.ok) {
      return {
        ok: true,
        text: gemini.text,
        provider: "gemini",
        model: gemini.model,
      };
    }
    lastFailure = pickFailure(lastFailure, {
      ...gemini,
      provider: "gemini",
    });
    console.warn("[ai-chat] Gemini failed, trying OpenRouter if configured", {
      reason: gemini.reason,
      status: gemini.status,
    });
  }

  if (openRouterKey) {
    const openRouter = await generateOpenRouterReply(
      openRouterKey,
      systemInstruction,
      turns
    );
    if (openRouter.ok) return openRouter;
    lastFailure = pickFailure(lastFailure, openRouter);
  }

  return lastFailure;
}

export function hasChatProvider(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY?.trim() ||
      process.env.GROQ_API_KEY?.trim() ||
      process.env.OPENROUTER_API_KEY?.trim()
  );
}
