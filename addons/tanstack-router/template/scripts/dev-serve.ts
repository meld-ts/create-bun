import { type MaybePromise, serve, spawn } from 'bun';
import index from '../src/index.html';
import { watchRoutes } from './gen-routes';

const isWindows = process.platform === 'win32';

// Route tree watcher: Windows needs the custom workaround (atomic rename fails),
// other platforms can use the official tsr watch CLI.
let cleanup: (() => void) | undefined;

if (isWindows) {
  cleanup = watchRoutes();
} else {
  const proc = spawn(['bun', 'x', 'tsr', 'watch'], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  cleanup = () => proc.kill();
}

const server = serve({
  routes: {
    '/*': index,
  },
  fetch(_req, _server): MaybePromise<Response> {
    return Response.json({ error: 'Invalid request' }, { status: 404 });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`Server running ${server.url}`);

// Clean shutdown: kill route watcher alongside server
process.on('SIGINT', () => {
  cleanup?.();
  process.exit();
});
