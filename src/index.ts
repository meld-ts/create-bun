export function getCurrentDir(): string {
  return import.meta.dir;
}

const dir = getCurrentDir();
console.log(`[debug] cwd: ${dir}`);
