# @meld-ts/create-bun

<a href="https://github.com/meld-ts/core" target="_blank"><img src="https://github.com/meld-ts/core/raw/main/assets/meld-ts.png" width="320" style="max-width: 100%;"></a>

[![version](https://img.shields.io/npm/v/@meld-ts/create-bun?style=for-the-badge)](https://www.npmjs.com/package/@meld-ts/create-bun)

A modern Bun project scaffold with TypeScript support and three project types: **lib**, **app**, and **react-app**.

## Usage

```bash
bun create @meld-ts/bun
```

Interactive prompts will guide you through:

1. **Project name** — `my-app` or `@org/my-lib`
2. **Project type** — `lib` | `app` | `react-app`
3. **Lint & format** — `Biome` | `oxc` (or `None` for lib/app)
4. **Add-ons** — varies by project type

Then:

```bash
cd my-project
bun run dev
```

## Project types

| Type | Entry | Build | HMR | Description |
|------|-------|-------|-----|-------------|
| `lib` | `src/index.ts` | bunup (optional) | — | TypeScript library — ESM + CJS + `.d.ts` |
| `app` | `src/index.ts` | bunup (optional) | `--hot` | Node.js / Bun application |
| `react-app` | `src/index.html` | `bun build` (fixed) | `--hot` serve | React SPA — file-based routing optional |

## Add-ons

### All project types

| Add-on | Description |
|--------|-------------|
| **Biome** | All-in-one linter + formatter |
| **oxc** | oxlint + oxfmt (faster, 660+ rules) |
| **tsgo** | Native TypeScript compiler (`typescript 7+ includes tsgo`) |

### lib / app only

| Add-on | Description |
|--------|-------------|
| **bunup** | Build tool for Bun libraries |

### react-app only

| Add-on | Description |
|--------|-------------|
| **tailwindcss** | Tailwind CSS v4 + `tailwindcss-bun-plugin` |
| **tanstack-router** | File-based type-safe router with devtools |

> **bunup is not available for react-app** — it only supports `.ts`/`.tsx` entry points, not `index.html`. React apps use Bun's native bundler.

## Add-on layers

Add-ons are applied in order:

```
lint (order=1)  →  styling (order=2)  →  structural (order=3)  →  extra (order=4)
```

- **Same-layer add-ons are mutually exclusive** (Biome or oxc, not both)
- **Higher layers override lower layers** for source files
- **JSON configs are deep-merged** — each add-on contributes only its own section

This means you can freely combine: `biome + tailwindcss + tanstack-router` or `oxc + tailwindcss + tanstack-router`.

## Available scripts

```bash
bun run fmt           # format with Biome / oxfmt (if selected)
bun run lint          # lint (warnings as errors)
bun run ts-check      # type check with tsgo / tsc
bun run test          # run tests + coverage
bun run dev           # dev server / hot reload
bun run build         # production build
bun run generate-routes  # regenerate route tree  (tanstack-router only)
```

## Template structure

```
template-bun/               # lib / app base
├── src/
│   ├── index.ts
│   └── index.test.ts
├── tsconfig.json
└── package.json

template-react-app/         # react-app base
├── src/
│   ├── index.html
│   ├── main.tsx
│   ├── global.css
│   ├── global.d.ts
│   ├── assets/react.svg
│   └── app/App.tsx
├── scripts/
│   ├── dev-serve.ts
│   └── build.ts
├── bunfig.toml
├── tsconfig.json
└── package.json

addons/
├── biome/               # lint layer (order=1)
│   ├── template/biome.json
│   └── package.json
├── oxc/                 # lint layer (order=1)
│   ├── template/.oxlintrc.json, .oxfmtrc.json
│   └── package.json
├── tailwindcss/         # styling layer (order=2)
│   ├── merge/biome.json
│   └── template/ (bunfig.toml, build.ts, global.css)
├── tanstack-router/     # structural layer (order=3)
│   ├── merge/biome.json
│   └── template/ (dev-serve.ts, gen-routes.ts, App.tsx, router.tsx, routes/*)
├── tsgo/                # extra layer (order=4)
└── bunup/               # extra layer (order=4)
```
