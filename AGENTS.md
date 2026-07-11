# AGENTS.md — @meld-ts/create-bun

## Version Bump

**Every PR must bump the version in `package.json`.**

| Change | Bump |
|--------|------|
| fix | patch (`1.0.11` → `1.0.12`) |
| feat | minor (`1.0.11` → `1.1.0`) |
| breaking | major (`1.0.11` → `2.0.0`) |

The commit message for the bump should follow the pattern:

```
chore: bump x.y.z
```

Bump as the **final commit** before pushing. Version number appears in `package.json`, npm publish, and `bun create` output.

## Project Overview

`@meld-ts/create-bun` is a Bun project scaffold CLI. It interactively (or via `--type --lint --addons`) generates:

- `lib` — TypeScript library (ESM + CJS + .d.ts)
- `app` — Node.js / Bun application
- `react-app` — React SPA with Bun bundler

## Addon System

Addons live in `addons/<name>/`:

```
addons/<name>/
  addon.json     # { layer, order, postInstall[] }
  package.json   # merged into target package.json
  merge/         # deep-merge JSON files into existing targets
  template/      # copied into target directory
```

Layers (lower runs first): `lint(1)` → `styling(2)` → `structural(3)` → `extra(4)`.

Same-layer addons are mutually exclusive (e.g. Biome vs oxc).

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | CLI entry, prompts, scaffold logic |
| `src/build.ts` | Bun build → `index.js` (binary) |
| `template-bun/` | Base template for lib & app |
| `template-react-app/` | Base template for react-app |
| `addons/` | All addon definitions |
| `.github/workflows/ci.yml` | CI: lint + type-check |

## CLI Params (non-interactive)

```bash
bun src/index.ts my-project \
  --type react-app \
  --lint biome \
  --addons tailwindcss,tsgo \
  --dir my-custom-dir \
  --no-install
```

## Dev

```bash
bun run dev    # scaffold to ./temp/ (uses --no-install)
```

## CI

PRs require `lint` (biome) and `type-check` (tsc) to pass before merge.
