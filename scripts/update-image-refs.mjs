import { readdir, readFile, writeFile } from "fs/promises";
import { join, extname } from "path";

const EXTS = [".astro", ".ts", ".json", ".md"];
const DIRS = ["src"];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (EXTS.includes(extname(e.name))) files.push(full);
  }
  return files;
}

const files = await walk("src");
let changed = 0;

for (const file of files) {
  const content = await readFile(file, "utf8");
  // Replace .jpg, .jpeg, .png inside /images/ paths with .webp
  // But keep badge images as-is since they're already small PNGs with alpha — actually convert those too
  const updated = content.replace(
    /(\/images\/[^"'\s)]+)\.(jpg|jpeg|png)/g,
    "$1.webp"
  );
  if (updated !== content) {
    await writeFile(file, updated, "utf8");
    console.log("Updated:", file);
    changed++;
  }
}

console.log(`\nDone. ${changed} files updated.`);
