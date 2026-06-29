import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";

const INPUT_DIR = "public/images";
const EXTS = [".jpg", ".jpeg", ".png"];
const SKIP_EXISTING_WEBP = true;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (EXTS.includes(extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

const files = await walk(INPUT_DIR);
let saved = 0;

for (const file of files) {
  const outFile = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  if (SKIP_EXISTING_WEBP) {
    try { await stat(outFile); continue; } catch {}
  }

  const before = (await stat(file)).size;
  try {
    await sharp(file).webp({ quality: 82, effort: 6 }).toFile(outFile);
    const after = (await stat(outFile)).size;
    const gain = Math.round((1 - after / before) * 100);
    saved += before - after;
    console.log(`✓ ${file.replace("public/images/", "")} → ${gain}% smaller`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log(`\nTotal saved: ${Math.round(saved / 1024)}KB`);
