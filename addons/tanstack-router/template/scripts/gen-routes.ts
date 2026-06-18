import { existsSync, watch } from 'node:fs';
import * as fsp from 'node:fs/promises';
import { join } from 'node:path';
import { Generator, getConfig } from '@tanstack/router-generator';

const root = process.cwd();

// Extract the fs interface type from Generator constructor params so we don't
// have to duplicate the interface (it's not exported from router-generator).
type GeneratorFs = NonNullable<
  ConstructorParameters<typeof Generator>[0]['fs']
>;

// Windows-compatible fs: replaces atomic rename (tmp → target) with
// readFile + writeFile + unlink, which doesn't require an exclusive lock on
// the destination file. The rest delegates to node:fs/promises as-is.
const windowsFs: GeneratorFs = {
  stat: async (filePath) => {
    const res = await fsp.stat(filePath, { bigint: true });
    return {
      mtimeMs: res.mtimeMs,
      mode: Number(res.mode),
      uid: Number(res.uid),
      gid: Number(res.gid),
    };
  },
  rename: async (oldPath, newPath) => {
    const content = await fsp.readFile(oldPath);
    await fsp.writeFile(newPath, content);
    await fsp.unlink(oldPath).catch(() => {});
  },
  writeFile: (filePath, content) => fsp.writeFile(filePath, content),
  readFile: async (filePath) => {
    try {
      const fh = await fsp.open(filePath, 'r');
      const stat = await fh.stat({ bigint: true });
      const fileContent = (await fh.readFile()).toString();
      await fh.close();
      return { stat, fileContent };
    } catch (e: any) {
      if (e?.code === 'ENOENT') return 'file-not-existing' as const;
      throw e;
    }
  },
  chmod: (filePath, mode) => fsp.chmod(filePath, mode),
  chown: (filePath, uid, gid) => fsp.chown(filePath, uid, gid),
};

if (import.meta.main) {
  generateRoutes().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export async function generateRoutes(): Promise<void> {
  const config = getConfig(undefined, root);
  await new Generator({ config, root, fs: windowsFs }).run();
}

export function watchRoutes(): () => void {
  const config = getConfig(undefined, root);
  const generator = new Generator({ config, root, fs: windowsFs });

  generator.run().catch(console.error);

  let debounce: ReturnType<typeof setTimeout> | null = null;

  const watcher = watch(
    config.routesDirectory,
    { recursive: true },
    (eventType, filename) => {
      if (!filename) return;
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        const fullPath = join(config.routesDirectory, filename.toString());
        generator
          .run({
            type:
              eventType === 'change'
                ? 'update'
                : existsSync(fullPath)
                  ? 'create'
                  : 'delete',
            path: fullPath,
          })
          .catch(console.error);
      }, 50);
    },
  );

  return () => watcher.close();
}
