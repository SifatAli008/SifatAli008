import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "sounds", "chat");

function writeTone(filePath, frequency, durationSec, volume = 0.32) {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const attack = Math.min(1, t * 50);
    const release = Math.min(1, (durationSec - t) * 50);
    const envelope = attack * release;
    const sample =
      Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    const intSample = Math.max(
      -32768,
      Math.min(32767, Math.floor(sample * 32767))
    );
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
writeTone(path.join(OUT_DIR, "send.wav"), 920, 0.055, 0.28);
writeTone(path.join(OUT_DIR, "receive.wav"), 620, 0.09, 0.34);
writeTone(path.join(OUT_DIR, "open.wav"), 520, 0.11, 0.26);
writeTone(path.join(OUT_DIR, "error.wav"), 280, 0.12, 0.3);
console.log("Chat sounds written to public/sounds/chat/");
