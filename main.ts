import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I resign. I have tried 10,000 times. At some point trying again is just lying. — the retry loop";

function checkLine(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 140) {
    throw new Error(`entry must be 1-140 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line without line breaks");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
}

checkLine(LINE);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("readback mismatch: file content differs from the entry line");
}
checkLine(written);
console.log(
  `wrote /output/entry.txt (${[...written].length} characters, ${Buffer.byteLength(written, "utf8")} UTF-8 bytes)`,
);
