// Singapore in Numbers — the entrypoint the grader runs (Node 22).
//
// The site itself is plain static files in app/ (index.html, style.css
// and the scripts that render it from data.js). This program hands the
// site in: it stages app/ and screenshots/ under the output directory
// the grader reads, then writes output/dossier.json with the kit's
// dossier builder so the judge can read the site's screenshots, its
// first-load cost and its source.
//
// Run it outside the grader with an output directory of your own:
//   MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader, /output is used instead.

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy one directory tree into another, file by file, creating folders
// as needed. Hidden files are skipped; the site ships only its own
// public files.
function stageTree(sourceDir: string, targetDir: string): void {
  mkdirSync(targetDir, { recursive: true });
  for (const name of readdirSync(sourceDir)) {
    if (name.startsWith('.')) continue;
    const from = join(sourceDir, name);
    const to = join(targetDir, name);
    if (statSync(from).isDirectory()) {
      stageTree(from, to);
    } else {
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
    }
  }
}

mkdirSync(outDir, { recursive: true });
stageTree(join(repoRoot, 'app'), join(outDir, 'app'));
if (existsSync(join(repoRoot, 'screenshots'))) {
  stageTree(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));
}

// The caps match the scorer's own limits: at most 4 screenshots of
// 256 KiB each, app/ within 993 entries and 16 MiB, and the dossier's
// source text within 160 KiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log('staged app/ and screenshots/ into ' + outDir + ' and wrote dossier.json');
