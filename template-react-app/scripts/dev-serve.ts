import { type MaybePromise, serve } from 'bun';
import index from '../src/index.html';

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
