#!/usr/bin/env bun
import { cp, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectName = process.argv[2] ?? 'my-project';
const targetDir = resolve(process.cwd(), projectName);

if (existsSync(targetDir)) {
  console.error(`Directory "${projectName}" already exists.`);
  process.exit(1);
}

// Two levels up from bin/create.ts → package root
const packageRoot = resolve(fileURLToPath(import.meta.url), '../..');

const EXCLUDE = new Set(['bin', 'node_modules', '.git', 'dist', 'coverage', '.npmignore']);

await cp(packageRoot, targetDir, {
  recursive: true,
  filter: (src) => {
    if (src === packageRoot) return true;
    const top = src.slice(packageRoot.length + 1).split(/[\\/]/)[0] ?? '';
    return !EXCLUDE.has(top);
  },
});

// bun create auto-renames this for GitHub repos; do it manually here
await rename(join(targetDir, 'gitignore'), join(targetDir, '.gitignore')).catch(() => {});

console.log('\nInstalling dependencies...');
const install = Bun.spawn([process.execPath, 'install'], {
  cwd: targetDir,
  stdout: 'inherit',
  stderr: 'inherit',
  stdin: null,
});
await install.exited;

const setup = Bun.spawn([process.execPath, 'run', 'setup.ts'], {
  cwd: targetDir,
  stdout: 'inherit',
  stderr: 'inherit',
  stdin: 'inherit',
});
await setup.exited;
