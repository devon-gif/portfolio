import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Keep the source in smaller binary files for upload transport limits.
// Concatenation restores the uploaded PDF byte for byte, without recompression.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "assets/presentations/chicago-exchange-hd");
const parts = ["part-01", "part-02", "part-03", "part-04"];
const pdf = Buffer.concat(parts.map((part) => readFileSync(join(source, part))));
const expectedHash = "949afac7a539a78ba3667094c8c30c9dcd11ca75e49332b5bd91ec31e25016ce";
if (createHash("sha256").update(pdf).digest("hex") !== expectedHash) {
  throw new Error("Chicago Exchange HD PDF failed its original-file integrity check.");
}
const destination = join(root, "public/devon/presentations");
mkdirSync(destination, { recursive: true });
writeFileSync(join(destination, "Chicago-Exchange-HD.pdf"), pdf);
console.log(`Prepared original Chicago Exchange HD PDF (${pdf.length} bytes).`);
