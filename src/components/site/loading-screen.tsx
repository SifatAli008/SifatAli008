"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  /** Progress 0–100. Omit for indeterminate pulse. */
  progress?: number;
  className?: string;
  label?: string;
  /** Fill a positioned parent instead of covering the viewport. */
  embedded?: boolean;
};

export function LoadingScreen({
  progress,
  className,
  label = "Loading",
  embedded = false,
}: LoadingScreenProps) {
  const pct = progress == null ? undefined : Math.min(100, Math.max(0, progress));

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={cn(
        "flex w-full flex-col items-center justify-center bg-cream text-ink",
        embedded
          ? "absolute inset-0"
          : "fixed inset-0 z-[300] min-h-screen",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-8">
        <p className="label-mono text-accent">Portfolio</p>
        <h1 className="mt-3 font-display text-[clamp(56px,12vw,96px)] leading-none tracking-wide">
          SIFAT
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
          AI / RAG · Full-stack
        </p>

        <div className="mt-10 w-full border-[3px] border-ink bg-white p-1 shadow-[5px_5px_0_0_#0A0A0A]">
          <div className="relative h-3 overflow-hidden bg-[#e8e0d4]">
            {pct == null ? (
              <div className="absolute inset-y-0 w-1/3 animate-[loader-slide_1.1s_ease-in-out_infinite] bg-accent" />
            ) : (
              <div
                className="h-full bg-accent transition-[width] duration-300 ease-out"
                style={{ width: `${pct}%` }}
              />
            )}
          </div>
        </div>

        <div className="mt-4 flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-[0.15em]">
          <span>{label}</span>
          <span className="tabular-nums text-accent">
            {pct == null ? "…" : `${Math.round(pct)}%`}
          </span>
        </div>
      </div>
    </div>
  );
}

const MIN_MS = 1000;
const MAX_MS = 2800;
const EXIT_MS = 700;

/** Full-viewport boot splash for the public site (first paint / hard reload). */
export function SiteBootLoader() {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(8);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const started = performance.now();
    let raf = 0;
    let doneTimer = 0;
    let exitTimer = 0;
    let finished = false;

    const tick = () => {
      setProgress((p) => {
        if (p >= 92) return p;
        const next = p + (p < 40 ? 2.2 : p < 70 ? 1.1 : 0.4);
        return Math.min(92, next);
      });
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(raf);

      const elapsed = performance.now() - started;
      const wait = Math.max(0, MIN_MS - elapsed);

      doneTimer = window.setTimeout(() => {
        setProgress(100);
        // Brief hold at 100% so the bar feels complete before fade
        exitTimer = window.setTimeout(() => {
          setVisible(false);
          document.documentElement.classList.remove("boot-loading");
        }, reduceMotion ? 80 : 220);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }

    const failsafe = window.setTimeout(finish, MAX_MS);

    document.documentElement.classList.add("boot-loading");
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(doneTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", finish);
      document.documentElement.classList.remove("boot-loading");
      document.body.style.overflow = "";
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {visible ? (
        <motion.div
          key="site-boot-loader"
          className="fixed inset-0 z-[300] will-change-[opacity,transform,filter]"
          initial={false}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 1.03,
                  filter: "blur(8px)",
                }
          }
          transition={{
            duration: reduceMotion ? 0.15 : EXIT_MS / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <LoadingScreen progress={progress} label="Initializing" embedded />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
