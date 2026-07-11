# Copilot Code Review — @meld-ts/create-bun

## Priorities

1. **Type safety** — no `any` without explicit justification. Prefer `unknown` over `any` for business code.
2. **Addon integrity** — changes to `addons/*/package.json` must be mirrored in template files and README.
3. **CLI UX** — hint text, labels, and error messages should be clear and consistent.
4. **Version discipline** — every PR must bump `package.json` version (see AGENTS.md).

## Code Style

- Chinese comments and messages, English identifiers and code.
- `const` over `let`, `interface` over `type` for objects.
- Functions over classes unless state is needed. Pure factory functions preferred.
- `biome-ignore` comments must include a reason.

## Addon Rules

- Same-layer addons are mutually exclusive (e.g. biome vs oxc). Check no conflicting addons are selected together.
- Addon `package.json` merges `dependencies`, `devDependencies`, `peerDependencies`, and `scripts` only.
- `merge/` files deep-merge JSON; `template/` files copy over.

## Anti-patterns

- `@apply` on universal selectors (`*`) — blocks downstream overrides, use native CSS instead.
- Hardcoded paths — use `join(packageRoot, ...)` or `resolve(...)`.
- Silent failures — always `cancel()` with a clear message.

## Dependencies

- `tailwindcss-bun-plugin` version must match `tailwindcss` version.
- TypeScript 7+ is sufficient; `@typescript/native-preview` is obsolete.
