import { build } from 'bun';

// bun build src/index.ts --outfile index.js --target bun
build({
  entrypoints: ['src/index.ts'],
  target: 'bun',
  outdir: './',
  naming: 'index.js',
  banner: '#!/usr/bin/env bun',
});
