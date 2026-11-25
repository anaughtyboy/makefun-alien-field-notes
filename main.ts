// Alien Field Notes: The Two-Day Earth
//
// Writes one line — an alien tourist's review of Earth — to entry.txt.
// The line is a fixed string held in this file; the program checks it
// against the competition's limits before writing anything, then reads
// the file back and proves the bytes on disk are exactly the line,
// with no trailing newline added.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REVIEW =
  "Day 2: the humans still wave at the toaster. We have decided to stay.";

const MAX_CHARS = 200;
const MIN_CHARS = 1;

function fail(message: string): never {
  throw new Error(`alien-field-notes: ${message}`);
}

// The line must be one line of plain text, 1-200 characters, with no
// leading or trailing whitespace and no control characters.
if ([...REVIEW].length < MIN_CHARS || [...REVIEW].length > MAX_CHARS) {
  fail(`review must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${[...REVIEW].length}`);
}
if (REVIEW.includes("\n") || REVIEW.includes("\r")) {
  fail("review must be a single line");
}
if (REVIEW !== REVIEW.trim()) {
  fail("review must not start or end with whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(REVIEW)) {
  fail("review must not contain control characters");
}
if (REVIEW.trim().length === 0) {
  fail("review must not be only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

const bytes = Buffer.from(REVIEW, "utf8");
writeFileSync(outPath, bytes);

// Read the file back and confirm it is byte-for-byte the review,
// with no trailing newline.
const onDisk = readFileSync(outPath);
if (!onDisk.equals(bytes)) {
  fail("entry.txt does not match the review byte for byte");
}
if (onDisk.length > 0 && onDisk[onDisk.length - 1] === 0x0a) {
  fail("entry.txt must not end with a newline");
}

console.log(`wrote ${onDisk.length} bytes to ${outPath}`);
