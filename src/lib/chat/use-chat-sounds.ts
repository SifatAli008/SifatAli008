"use client";

import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";

const STORAGE_KEY = "sifat-chat-sound";

const SOUNDS = {
  send: "/sounds/chat/send.wav",
  receive: "/sounds/chat/receive.wav",
  open: "/sounds/chat/open.wav",
  error: "/sounds/chat/error.wav",
} as const;

function readSoundPreference(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "off") return false;
    if (stored === "on") return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function useChatSounds() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(readSoundPreference());
  }, []);

  const soundOpts = { soundEnabled: enabled, volume: 0.45 };

  const [playSend] = useSound(SOUNDS.send, { ...soundOpts, volume: 0.35 });
  const [playReceive] = useSound(SOUNDS.receive, { ...soundOpts, volume: 0.42 });
  const [playOpen] = useSound(SOUNDS.open, { ...soundOpts, volume: 0.32 });
  const [playError] = useSound(SOUNDS.error, { ...soundOpts, volume: 0.38 });

  const toggleSound = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const playSendSafe = useCallback(() => {
    if (enabled) playSend();
  }, [enabled, playSend]);

  const playReceiveSafe = useCallback(() => {
    if (enabled) playReceive();
  }, [enabled, playReceive]);

  const playOpenSafe = useCallback(() => {
    if (enabled) playOpen();
  }, [enabled, playOpen]);

  const playErrorSafe = useCallback(() => {
    if (enabled) playError();
  }, [enabled, playError]);

  return {
    soundEnabled: enabled,
    toggleSound,
    playSend: playSendSafe,
    playReceive: playReceiveSafe,
    playOpen: playOpenSafe,
    playError: playErrorSafe,
  };
}
