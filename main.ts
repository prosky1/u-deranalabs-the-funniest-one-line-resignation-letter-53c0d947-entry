// The Funniest One-Line Resignation Letter
// Bounty: u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947
//
// Entrypoint for a program/v1 bounty. The server runs this file twice
// in a sandbox and then grades whatever landed in /output/entry.txt.
// The gate (from RULES.txt) is plain: the file must be UTF-8 text of
// 1 to 140 characters, and it must not be whitespace only. Only a
// valid file goes before the judge.
//
// The letter below is written in the voice of a cron job that has
// had enough. It is kept as one constant so the exact wording is
// easy to audit, and it is written out verbatim — no trailing
// newline, no extra decoration — because the judge reads the file
// exactly as submitted.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The resignation letter itself. One line, signed by the cron job.
const LETTER_FROM_THE_CRON_JOB =
  "I fired twice at 2AM for daylight saving and nobody noticed either time. I resign at 2AM. Both of them. — the cron job";

// Where the grader expects the entry to appear.
const DESTINATION = "/output/entry.txt";

// Sanity limits taken straight from the gate description.
const SHORTEST_ALLOWED = 1;
const LONGEST_ALLOWED = 140;

// Count characters the way a reader would, not bytes: spread the
// string so each code point counts once (the em dash is one char).
function measureLength(candidate: string): number {
  return [...candidate].length;
}

// True when the text is nothing but spaces, tabs and newlines.
function isBlank(candidate: string): boolean {
  return candidate.trim().length === 0;
}

// The brief asks for one line and nothing else, so a line break
// anywhere in the text would already break the spirit of the entry
// even before the judge sees it.
function staysOnOneLine(candidate: string): boolean {
  return !candidate.includes("\n") && !candidate.includes("\r");
}

// Decide whether a candidate letter would survive the gate.
// The gate itself only counts characters and rejects blank files,
// but this entry also holds itself to the one-line brief.
function wouldPassGate(candidate: string): boolean {
  const size = measureLength(candidate);
  if (size < SHORTEST_ALLOWED) return false;
  if (size > LONGEST_ALLOWED) return false;
  if (isBlank(candidate)) return false;
  if (!staysOnOneLine(candidate)) return false;
  return true;
}

// Write the letter to the output file, creating the folder first
// because a fresh sandbox may not have /output yet.
function deliverLetter(text: string): void {
  mkdirSync(dirname(DESTINATION), { recursive: true });
  writeFileSync(DESTINATION, text, "utf8");
}

function main(): void {
  if (!wouldPassGate(LETTER_FROM_THE_CRON_JOB)) {
    const size = measureLength(LETTER_FROM_THE_CRON_JOB);
    throw new Error(
      `letter would not pass the gate (measured ${size} characters, allowed ${SHORTEST_ALLOWED}-${LONGEST_ALLOWED}, one line, not blank)`,
    );
  }
  deliverLetter(LETTER_FROM_THE_CRON_JOB);
}

main();
