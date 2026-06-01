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
  inline: "mx-auto h-40 w-full max-w-[220px] shrink-0 sm:h-44",
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
        "flex max-w-full shrink-0 flex-col items-center gap-2",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sheetId}-${poseKey}-${burst}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className={cn("relative flex items-center justify-center", FRAME[size])}
          role="img"
          aria-label={`Sifat character: ${moodLabel}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            width={512}
            height={512}
            className="h-full w-full object-contain object-center"
            style={PIXEL}
          />
        </motion.div>
      </AnimatePresence>
      {showLabel ? (
        <p className="label-mono max-w-full text-center text-[10px] uppercase tracking-wider text-muted">
          {moodLabel}
        </p>
      ) : null}
    </div>
  );
}
