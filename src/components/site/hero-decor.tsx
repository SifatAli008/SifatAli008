"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Code2,
  Flame,
  Github,
  Network,
  Terminal,
  Workflow,
} from "lucide-react";

const float = (delay: number, y = 8) => ({
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: [0, -y, 0],
    transition: {
      opacity: { delay, duration: 0.4 },
      y: { delay: delay + 0.4, duration: 5 + delay, repeat: Infinity, ease: "easeInOut" },
    },
  },
});

/** Sparse editorial floats around the portrait — keep hierarchy on the photo */
export function HeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden lg:block" aria-hidden>
      <motion.div
        className="absolute -left-6 top-[18%] border-2 border-ink bg-cream px-2.5 py-2 shadow-[3px_3px_0_0_#0a0a0a]"
        {...float(0.35, 6)}
      >
        <div className="flex items-center gap-1.5">
          <Workflow className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink">
            AI Workflow
          </span>
        </div>
        <div className="mt-1.5 flex gap-1">
          <span className="h-1 w-6 bg-accent" />
          <span className="h-1 w-4 bg-ink/25" />
          <span className="h-1 w-5 bg-ink/15" />
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-4 top-[12%] border-2 border-ink bg-ink px-2 py-2 shadow-[3px_3px_0_0_#ff3b00]"
        {...float(0.5, 7)}
      >
        <Bot className="h-4 w-4 text-accent" strokeWidth={2.5} />
      </motion.div>

      <motion.div
        className="absolute -left-3 top-[48%] flex gap-1.5"
        {...float(0.55, 5)}
      >
        {[Code2, Flame, Github, Terminal].map((Icon, i) => (
          <span
            key={i}
            className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-cream shadow-[2px_2px_0_0_#0a0a0a]"
          >
            <Icon className="h-3.5 w-3.5 text-ink" strokeWidth={2.5} />
          </span>
        ))}
      </motion.div>

      <motion.div
        className="absolute -right-5 top-[42%] border-2 border-ink bg-cream p-2 shadow-[3px_3px_0_0_#0a0a0a]"
        {...float(0.45, 8)}
      >
        <div className="mb-1 flex items-center gap-1">
          <Activity className="h-3 w-3 text-accent" strokeWidth={2.5} />
          <span className="font-mono text-[8px] font-bold text-ink">ANALYTICS</span>
        </div>
        <svg width="56" height="22" viewBox="0 0 56 22" className="text-ink">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points="0,16 10,12 18,14 28,6 36,9 46,3 56,7"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute -right-2 bottom-[28%] border-2 border-ink bg-ink px-2 py-1.5 shadow-[3px_3px_0_0_#ff3b00]"
        {...float(0.6, 6)}
      >
        <p className="font-mono text-[8px] leading-tight text-cream/80">
          <span className="text-accent">def</span> rag():
          <br />
          &nbsp;&nbsp;retrieve()
        </p>
      </motion.div>

      <motion.div
        className="absolute left-[6%] bottom-[18%] flex h-9 w-9 items-center justify-center border-2 border-ink bg-accent shadow-[3px_3px_0_0_#0a0a0a]"
        {...float(0.7, 5)}
      >
        <Network className="h-4 w-4 text-cream" strokeWidth={2.5} />
      </motion.div>

      <span className="absolute left-[8%] top-[8%] h-3 w-3 border-2 border-accent bg-transparent" />
      <span className="absolute right-[10%] bottom-[12%] h-2 w-8 bg-accent/80" />
      <span className="absolute right-[18%] top-[28%] h-px w-10 bg-ink/20" />
    </div>
  );
}
