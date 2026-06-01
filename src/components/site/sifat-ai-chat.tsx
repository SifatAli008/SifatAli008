"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bot,
  Loader2,
  Maximize2,
  MessageCircle,
  Minimize2,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SifatChatCharacter } from "@/components/site/sifat-chat-character";
import {
  attachMessageCharacter,
  getMoodCaption,
  resolveCharacterReaction,
  type MessageCharacter,
} from "@/lib/chat/character-state";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  character?: MessageCharacter;
};

const starterPrompts = [
  "What does Sifat build?",
  "Sifat's best project?",
  "How do I hire Sifat?",
];

const WELCOME =
  "Hey - I'm Sifat, Sifat Ali's portfolio assistant. Ask about his work, skills, projects, or how to reach him. Sifat-related questions only.";

interface ChatPanelProps {
  fullscreen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
}

function AssistantMessage({
  content,
  character,
}: {
  content: string;
  character?: MessageCharacter;
}) {
  return (
    <div className="mr-auto w-full max-w-[min(100%,calc(100%-0.5rem))] overflow-visible sm:max-w-[92%]">
      <div
        className={cn(
          "border-2 border-ink bg-white text-ink",
          "shadow-[4px_4px_0_0_#0a0a0a]",
          character ? "overflow-visible" : "overflow-hidden"
        )}
      >
        <div className="flex items-center gap-2 border-b border-ink/10 bg-cream/80 px-3 py-1.5">
          <Bot className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/55">
            Sifat
          </span>
        </div>
        <p className="px-4 py-3 font-mono text-sm leading-relaxed">{content}</p>
        {character ? (
          <div className="border-t border-dashed border-ink/15 bg-cream/40 px-3 pb-4 pt-2">
            <SifatChatCharacter
              sheetId={character.sheetId}
              poseKey={character.poseKey}
              moodLabel={character.moodLabel}
              size="inline"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="ml-auto w-full max-w-[min(100%,calc(100%-0.5rem))] sm:max-w-[55%]">
      <div
        className="border-2 border-ink bg-ink px-4 py-2.5 font-mono text-sm leading-relaxed text-cream shadow-[4px_4px_0_0_#ff3b00]"
      >
        {content}
      </div>
    </div>
  );
}

function ChatPanel({ fullscreen, onClose, onToggleFullscreen }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canSend = input.trim().length > 0 && !loading;
  const visibleMessages = useMemo(() => messages.slice(-20), [messages]);

  const reaction = useMemo(
    () => resolveCharacterReaction(messages, loading),
    [messages, loading]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  function pushAssistantReply(userContent: string, assistantContent: string) {
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: assistantContent,
        character: attachMessageCharacter(userContent, assistantContent),
      },
    ]);
  }

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
      pushAssistantReply(
        content,
        data.reply ||
          "Not sure on that one. Email Sifat at sifatali008@gmail.com."
      );
    } catch {
      pushAssistantReply(content, "Couldn't connect. Try again in a sec.");
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
    <section
      aria-label="Sifat chat"
      className={cn(
        "flex flex-col border-[3px] border-ink bg-cream text-ink",
        fullscreen
          ? "h-full w-full shadow-none"
          : "max-h-[calc(100dvh-7.5rem)] w-[min(430px,calc(100vw-2.5rem))] shadow-[8px_8px_0_0_#0a0a0a]"
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b-[3px] border-ink bg-accent px-4 py-3 text-cream">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-cream bg-ink">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-2xl leading-none">Sifat</h2>
            <p className="truncate font-mono text-[11px] uppercase leading-tight tracking-[0.12em] text-cream/90">
              {getMoodCaption(reaction)}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={fullscreen ? "Exit full-screen chat" : "Open full-screen chat"}
            className="flex h-9 w-9 items-center justify-center border-2 border-cream bg-ink text-cream transition-transform hover:-translate-y-0.5"
            onClick={onToggleFullscreen}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label="Close Sifat chat"
            className="flex h-9 w-9 items-center justify-center border-2 border-cream bg-ink text-cream transition-transform hover:-translate-y-0.5"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            fullscreen ? "max-h-none" : "max-h-[min(360px,calc(100dvh-21rem))]"
          )}
        >
          <div
            className={cn(
              "flex w-full flex-col gap-4 px-4 py-4",
              fullscreen && "px-6 py-6 sm:px-8"
            )}
          >
            {visibleMessages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {message.role === "user" ? (
                  <UserMessage content={message.content} />
                ) : (
                  <AssistantMessage
                    content={message.content}
                    character={message.character}
                  />
                )}
              </motion.div>
            ))}

            {loading ? (
              <div className="mr-auto w-full max-w-[min(100%,calc(100%-0.5rem))] sm:max-w-[92%]">
                <div className="flex items-center gap-2 border-2 border-ink bg-white px-4 py-3 font-mono text-sm shadow-[4px_4px_0_0_#0a0a0a]">
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
                  <span className="text-ink/70">One sec...</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 border-t-[3px] border-ink bg-cream px-4 py-3">
          <p className="label-mono mb-2 text-[10px] uppercase tracking-wider text-ink/45">
            Try asking
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="border-2 border-ink bg-white px-3 py-1.5 font-mono text-[10px] uppercase leading-tight transition-colors hover:bg-accent hover:text-cream disabled:opacity-50 sm:text-[11px]"
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
              placeholder="Ask about Sifat only..."
              className="min-w-0 flex-1 border-2 border-ink bg-white px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink/45 focus:outline-none focus:ring-2 focus:ring-accent/30"
              maxLength={500}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!canSend}
              className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-ink bg-accent text-cream transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-ink/15 disabled:text-ink/40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function SifatAiChat() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!open || !fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, fullscreen]);

  useEffect(() => {
    if (!open) setFullscreen(false);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setFullscreen(false);
  }

  return (
    <>
      <AnimatePresence>
        {open && fullscreen && (
          <motion.div
            key="chat-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-cream"
          >
            <ChatPanel
              fullscreen
              onClose={handleClose}
              onToggleFullscreen={() => setFullscreen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed bottom-5 right-5 z-40 flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3",
          open && fullscreen && "pointer-events-none opacity-0"
        )}
      >
        {open && !fullscreen && (
          <ChatPanel
            fullscreen={false}
            onClose={handleClose}
            onToggleFullscreen={() => setFullscreen(true)}
          />
        )}

        {!fullscreen && (
          <button
            type="button"
            aria-label={open ? "Close Sifat chat" : "Open Sifat chat"}
            className="btn-3d pointer-events-auto flex items-center gap-2 border-[3px] border-ink bg-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-cream"
            onClick={() => setOpen((current) => !current)}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Ask Sifat
          </button>
        )}
      </div>
    </>
  );
}
