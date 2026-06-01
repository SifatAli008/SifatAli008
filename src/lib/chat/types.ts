export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResult =
  | { ok: true; text: string; provider: string; model: string }
  | { ok: false; reason: string; status?: number; provider?: string };
