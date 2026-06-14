import { cp, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODES = ['lib', 'app', 'react-app'] as const;
type Mode = (typeof MODES)[number];

const projectName = process.argv[2] ?? 'my-project';
const targetDir = resolve(process.cwd(), projectName);

if (existsSync(targetDir)) {
  console.error(`Directory "${projectName}" already exists.`);
  process.exit(1);
}

const input = prompt(`Project mode (${MODES.join(' / ')}):`, 'lib')?.trim() ?? 'lib';
const mode = (MODES.includes(input as Mode) ? input : 'lib') as Mode;

console.log(`\nSetting up [${mode}] project...`);

const packageRoot = resolve(fileURLToPath(import.meta.url), '..');
const templateDir = join(packageRoot, `template-${mode}`);

await cp(templateDir, targetDir, { recursive: true });

// create-vite convention: _gitignore → .gitignore
await rename(join(targetDir, '_gitignore'), join(targetDir, '.gitignore')).catch(() => {});

// set project name
// biome-ignore lint/suspicious/noExplicitAny: json manipulation
const pkg = (await Bun.file(join(targetDir, 'package.json')).json()) as Record<string, any>;
pkg.name = projectName;
await Bun.write(join(targetDir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

console.log(`\n✅ [${mode}] project ready!`);
console.log(`\n  cd ${projectName}`);
console.log('  bun install');
if (mode === 'react-app') {
  console.log('  bun run dev');
} else {
  console.log('  bun run ts-check && bun run test');
}
