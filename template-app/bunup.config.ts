import { defineConfig } from 'bunup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node',
  outDir: './dist',
  sourcemap: 'linked',
  dts: false,
}) as ReturnType<typeof defineConfig>;
