import { build } from 'bun';
import tailwind from 'tailwindcss-bun-plugin';

build({
  entrypoints: ['src/index.html'],
  outdir: './dist',
  sourcemap: 'linked',
  target: 'browser',
  env: 'BUN_PUBLIC_*',
  define: {
    'process.env.NODE_ENV': 'production',
  },
  plugins: [tailwind],
});
