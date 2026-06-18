import { defineConfig } from 'bunup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'node',
  outDir: './dist',
  sourcemap: 'linked',
  dts: true,
});
