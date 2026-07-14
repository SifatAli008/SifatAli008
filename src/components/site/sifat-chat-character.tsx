"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCharacterImageSrc,
  type CharacterSheetId,
} from "@/lib/data/character-sprites";
import { cn } from "@/lib/utils";

interface SifatChatCharacterProps {
  sheetId: CharacterSheetId;
  poseKey: string;
  moodLabel: string;
  size?: "inline" | "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const FRAME = {
  inline: "mx-auto h-44 w-full max-w-[min(100%,280px)] sm:h-52 sm:max-w-[320px]",
  sm: "size-28 shrink-0",
  md: "size-44 shrink-0 sm:size-52",
  lg: "size-56 shrink-0 sm:size-64 md:size-72",
};

const PIXEL: CSSProperties = { imageRendering: "pixelated" };

export function SifatChatCharacter({
  sheetId,
  poseKey,
  moodLabel,
  size = "md",
  className,
  showLabel = true,
}: SifatChatCharacterProps) {
  const [src, setSrc] = useState(() => getCharacterImageSrc(sheetId, poseKey));
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setSrc(getCharacterImageSrc(sheetId, poseKey));
    setBurst((n) => n + 1);
  }, [sheetId, poseKey, moodLabel]);

  return (
    <div
      className={cn(
        "flex w-full shrink-0 flex-col items-center gap-0.5",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sheetId}-${poseKey}-${burst}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative flex items-end justify-center overflow-visible",
            FRAME[size]
          )}
          role="img"
          aria-label={`Sifat character: ${moodLabel}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Sifat character pose: ${moodLabel}`}
            width={512}
            height={512}
            className="h-full w-full object-contain object-bottom"
            style={PIXEL}
          />
        </motion.div>
      </AnimatePresence>
      {showLabel ? (
        <p className="label-mono text-center text-[11px] font-bold uppercase tracking-wider text-ink/70">
          {moodLabel}
        </p>
      ) : null}
    </div>
  );
}
