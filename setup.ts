#!/usr/bin/env bun
import { mkdir, unlink } from 'node:fs/promises';
import { $ } from 'bun';

const MODES = ['lib', 'app', 'react-app'] as const;
type Mode = (typeof MODES)[number];

const input = prompt(`Project mode (${MODES.join(' / ')}):`, 'lib')?.trim() ?? 'lib';
const mode = (MODES.includes(input as Mode) ? input : 'lib') as Mode;

console.log(`\nSetting up [${mode}] project...`);

// biome-ignore lint/suspicious/noExplicitAny: json manipulation
const tsconfig = (await Bun.file('tsconfig.json').json()) as Record<string, any>;
// biome-ignore lint/suspicious/noExplicitAny: json manipulation
const opts = tsconfig.compilerOptions as Record<string, any>;
// biome-ignore lint/suspicious/noExplicitAny: json manipulation
const biome = (await Bun.file('biome.json').json()) as Record<string, any>;
// biome-ignore lint/suspicious/noExplicitAny: json manipulation
const pkg = (await Bun.file('package.json').json()) as Record<string, any>;

// --- tsconfig ---
if (mode !== 'lib') {
  delete opts.isolatedDeclarations;
  delete opts.declaration;
}

if (mode === 'react-app') {
  opts.module = 'Preserve';
  opts.jsx = 'react-jsx';
  opts.jsxImportSource = 'react';
  opts.allowJs = true;
  opts.noImplicitOverride = true;
  // react-app: use include instead of exclude for clarity
  tsconfig.include = ['src'];
  tsconfig.exclude = ['node_modules', 'dist'];
}

await Bun.write('tsconfig.json', `${JSON.stringify(tsconfig, null, 2)}\n`);

// --- biome.json includes ---
biome.files.includes =
  mode === 'react-app'
    ? ['scripts/**/*.{ts,js}', 'src/**/*.{ts,tsx,js,jsx,json,css,html}']
    : ['src/**/*.{ts,js,json}'];
await Bun.write('biome.json', `${JSON.stringify(biome, null, 2)}\n`);

// --- package.json ---
// reset npm-package-specific fields to project defaults
pkg.name = 'my-project';
pkg.description = 'my-project';
delete pkg.keywords;
delete pkg.repository;
delete pkg.license;

if (mode === 'lib') {
  pkg.files = ['./dist'];
} else if (mode === 'app') {
  pkg.private = true;
  delete pkg.module;
  delete pkg.types;
} else if (mode === 'react-app') {
  pkg.private = true;
  pkg.scripts.dev = 'bun --hot scripts/dev-serve.ts';
  pkg.scripts.build = 'bun scripts/build.ts';
  delete pkg.module;
  delete pkg.types;
}
await Bun.write('package.json', `${JSON.stringify(pkg, null, 2)}\n`);

// --- @typescript/native-preview ---
console.log('\nInstalling @typescript/native-preview...');
await $`bun add -D @typescript/native-preview`;

// --- react-app specific ---
if (mode === 'react-app') {
  console.log('\nInstalling React...');
  await $`bun add react react-dom`;
  await $`bun add -D @types/react @types/react-dom`;

  // remove lib/app defaults
  await unlink('src/index.ts').catch(() => {});
  await unlink('src/index.test.ts').catch(() => {});
  await unlink('bunup.config.ts').catch(() => {});

  // bunfig.toml
  await Bun.write('bunfig.toml', '[serve.static]\nenv = "BUN_PUBLIC_*"\n');

  // scripts/
  await mkdir('scripts', { recursive: true });

  await Bun.write(
    'scripts/dev-serve.ts',
    `import { type MaybePromise, serve } from 'bun';
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

console.log(\`Server running \${server.url}\`);
`,
  );

  await Bun.write(
    'scripts/build.ts',
    `import { build } from 'bun';

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
`,
  );

  // src/
  await Bun.write(
    'src/index.html',
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App</title>
</head>
<body>
<div id="app_root" class="app-root"></div>
<script type="module" src="main.tsx"></script>
</body>
</html>
`,
  );

  await Bun.write(
    'src/main.tsx',
    `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './global.css';

const elem = document.getElementById('app_root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// reuse root across HMR updates
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
`,
  );

  await mkdir('src/app', { recursive: true });
  await Bun.write(
    'src/app/App.tsx',
    `const App = () => {
  return <div>App</div>;
};

export default App;
`,
  );

  await Bun.write(
    'src/global.css',
    `:root {
}

html {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-root {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
`,
  );

  // placeholder for CSS module declarations etc.
  await Bun.write('src/global.d.ts', '');
}

// --- biome migrate (updates $schema to installed version) ---
console.log('\nRunning biome migrate...');
await $`bunx biome migrate --write`.nothrow();

// --- self-destruct ---
await unlink(new URL('setup.ts', import.meta.url));

console.log(`\n✅ [${mode}] project ready!`);
if (mode === 'react-app') {
  console.log('Run: bun run dev');
} else {
  console.log('Run: bun run ts-check && bun run test');
}
