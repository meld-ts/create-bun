#!/usr/bin/env bun
import { mkdir, unlink } from 'node:fs/promises';

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
  // add react deps — bun install below will resolve them
  pkg.dependencies = { react: 'latest', 'react-dom': 'latest' };
  pkg.devDependencies['@types/react'] = 'latest';
  pkg.devDependencies['@types/react-dom'] = 'latest';
}
await Bun.write('package.json', `${JSON.stringify(pkg, null, 2)}\n`);

// --- react-app specific files ---
if (mode === 'react-app') {
  await unlink('src/index.ts').catch(() => {});
  await unlink('src/index.test.ts').catch(() => {});
  await unlink('bunup.config.ts').catch(() => {});

  await Bun.write('bunfig.toml', '[serve.static]\nenv = "BUN_PUBLIC_*"\n');

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

  await Bun.write(
    'src/index.html',
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover">
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

// biome-ignore lint/style/noNonNullAssertion: app_root is declared in index.html and always present at runtime
const elem = document.getElementById('app_root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// biome-ignore lint/suspicious/noAssignInExpressions: ??= assignment is the idiomatic HMR pattern to persist root across hot reloads
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
`,
  );

  await mkdir('src/app', { recursive: true });
  await Bun.write(
    'src/app/App.tsx',
    `import ReactSvg from '../assets/react.svg';

const App = () => {
  return (
    <div
      style={{
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1em',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <img src={ReactSvg} alt={'React Logo'} style={{ width: 128 }} />
        <span>Ｘ</span>
        <img
          src={'https://bun.com/logo.svg'}
          alt={'Bun Logo'}
          style={{ width: 128 }}
        />
      </div>
      <h1>Web App @ React + Bun</h1>
      <p style={{ color: 'rgb(from currentColor r g b / 0.6)' }}>Have fun!</p>
    </div>
  );
};

export default App;
`,
  );

  await Bun.write(
    'src/global.css',
    `:root {
  color-scheme: light dark;
}

html {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  color: rgb(from currentColor r g b / 0.8);
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

  await Bun.write(
    'src/global.d.ts',
    `declare module "*.svg" {
  /**
   * A path to the SVG file
   */
  const path: \`\${string}.svg\`;
  export = path;
}

declare module "*.css" {}

declare module "*.module.css" {
  /**
   * A record of class names to their corresponding CSS module classes
   */
  const classes: { readonly [key: string]: string };
  export = classes;
}
`,
  );

  await mkdir('src/assets', { recursive: true });
  await Bun.write(
    'src/assets/react.svg',
    `<svg width="100%" height="100%" viewBox="-10.5 -9.45 21 18.9" fill="none"
     xmlns="http://www.w3.org/2000/svg"
     class="text-sm me-0 w-10 h-10 text-brand dark:text-brand-dark flex origin-center transition-all ease-in-out">
    <circle cx="0" cy="0" r="2" fill="rgb(88, 196, 220)"></circle>
    <g stroke="rgb(88, 196, 220)" stroke-width="1" fill="none">
        <ellipse rx="10" ry="4.5"></ellipse>
        <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
        <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
    </g>
</svg>`,
  );

  // install react deps that were just added to package.json
  console.log('\nInstalling React...');
  const install = Bun.spawn([process.execPath, 'install'], {
    stdout: 'inherit',
    stderr: 'inherit',
    stdin: null,
  });
  await install.exited;
}

// --- sync biome $schema to installed version ---
const biomeMeta = (await Bun.file(
  'node_modules/@biomejs/biome/package.json',
).json()) as { version: string };
const freshBiome = (await Bun.file('biome.json').json()) as Record<string, unknown>;
freshBiome['$schema'] = `https://biomejs.dev/schemas/${biomeMeta.version}/schema.json`;
await Bun.write('biome.json', `${JSON.stringify(freshBiome, null, 2)}\n`);

// --- self-destruct ---
await unlink(new URL('setup.ts', import.meta.url));

console.log(`\n✅ [${mode}] project ready!`);
if (mode === 'react-app') {
  console.log('Run: bun run dev');
} else {
  console.log('Run: bun run ts-check && bun run test');
}
