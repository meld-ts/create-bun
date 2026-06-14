# template-bun

A modern Bun project template with TypeScript, Biome, and first-class support for **library**, **app**, and **react-app** project modes.

## Usage

```bash
bun create meld-ts/template-bun my-project
```

During setup, you'll be prompted to choose a project mode:

| Mode | Description |
|------|-------------|
| `lib` | TypeScript library — ESM + CJS output via bunup, `isolatedDeclarations` enabled |
| `app` | Node.js app — hot reload dev, bunup build |
| `react-app` | React SPA — Bun native bundler, HMR dev server |

## What's included

- **[Bun](https://bun.com/)** — runtime, package manager, test runner
- **TypeScript** via [`@typescript/native-preview`](https://github.com/microsoft/typescript-go) (tsgo)
- **[Biome](https://biomejs.dev/)** — formatter + linter, pre-configured
- **[bunup](https://bunup.dev/)** — build tool for lib/app modes
- **Bun native bundler** — for react-app mode (HTML entrypoint, HMR)

## Scripts

```bash
bun run fmt           # format with Biome
bun run lint          # lint (warnings as errors)
bun run ts-check      # type check with tsgo
bun run test          # run tests + coverage
bun run dev           # dev server / hot reload
bun run build         # production build
bun run biome-migrate # update Biome config after upgrade
```

## Template files

| File | Purpose |
|------|---------|
| `gitignore` | Becomes `.gitignore` in the new project |
| `setup.ts` | Postinstall script — runs once, then self-deletes |
| `bunup.config.ts` | Build config (lib/app only) |
| `src/index.ts` | Default entry (lib/app only) |
| `src/index.test.ts` | Default test (lib/app only) |
