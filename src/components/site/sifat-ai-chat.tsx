"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "What is Sifat best at?",
  "Tell me about his AI projects",
  "How can I contact Sifat?",
];

export function SifatAiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey, I am Sifat AI. Ask me what Sifat builds, where he shines, or whether he is the right fit for your next project.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const canSend = input.trim().length > 0 && !loading;

  const visibleMessages = useMemo(() => messages.slice(-10), [messages]);

  async function sendMessage(nextInput?: string) {
    const content = (nextInput ?? input).trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.reply ||
            "I do not have a confident answer for that yet. You can contact Sifat directly.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not connect to the AI service right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3">
      {open && (
        <section
          aria-label="Sifat AI chat"
          className="max-h-[calc(100dvh-7.5rem)] w-[min(430px,calc(100vw-2.5rem))] border-[3px] border-ink bg-cream text-ink shadow-[8px_8px_0_0_#0a0a0a]"
        >
          <div className="flex items-center justify-between border-b-[3px] border-ink bg-accent px-4 py-3 text-cream">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-cream bg-ink">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-2xl leading-none">Sifat AI</h2>
                <p className="font-mono text-[11px] uppercase leading-tight tracking-[0.12em]">
                  Portfolio guide
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close Sifat AI chat"
              className="flex h-9 w-9 items-center justify-center border-2 border-cream bg-ink text-cream transition-transform hover:-translate-y-0.5"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-[min(360px,calc(100dvh-21rem))] space-y-3 overflow-y-auto px-4 py-4">
            {visibleMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                className={cn(
                  "border-2 border-ink px-3 py-2 font-mono text-sm leading-relaxed",
                  message.role === "user"
                    ? "ml-8 bg-ink text-cream"
                    : "mr-8 bg-white text-ink"
                )}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="mr-8 flex items-center gap-2 border-2 border-ink bg-white px-3 py-2 font-mono text-sm">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Thinking with personality...
              </div>
            )}
          </div>

          <div className="border-t-[3px] border-ink px-4 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="shrink-0 border-2 border-ink bg-white px-2.5 py-1 font-mono text-[10px] uppercase leading-tight transition-colors hover:bg-accent hover:text-cream sm:text-[11px]"
                  onClick={() => void sendMessage(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Sifat..."
                className="min-w-0 flex-1 border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink placeholder:text-ink/50 focus:outline-none"
                maxLength={500}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!canSend}
                className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-accent text-cream disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-label={open ? "Close Sifat AI chat" : "Open Sifat AI chat"}
        className="btn-3d flex items-center gap-2 border-[3px] border-ink bg-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-cream"
        onClick={() => {
          setOpen((current) => !current);
          window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Sifat AI
      </button>
    </div>
  );
}
