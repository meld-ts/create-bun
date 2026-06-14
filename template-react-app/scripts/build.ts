import { build } from 'bun';

build({
  entrypoints: ['src/index.html'],
  outdir: './dist',
  sourcemap: 'linked',
  target: 'browser',
  env: 'BUN_PUBLIC_*',
  define: {
    'process.env.NODE_ENV': 'production',
  },
});
