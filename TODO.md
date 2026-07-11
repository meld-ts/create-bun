# @meld-ts/create-bun — 待办

非紧急优化，有空再处理。

## tailwindcss addon：替换 Bun Tailwind 插件

**状态：** ✅ 已完成（2026-07-11）  
**优先级：** 低  
**记录日期：** 2026-06-30

### 背景

当前 tailwindcss addon 使用官方推荐的 `bun-plugin-tailwind`，但实际开发中该插件缺少若干关键特性，体验较差。  
[`tailwindcss-bun-plugin`](https://github.com/iivankin/tailwindcss-bun-plugin) 在 umbra 等项目已验证可用（README 也写明是对 `bun-plugin-tailwind` 的改进替代）。

### 改动

| 文件 | 改动 |
|------|------|
| `addons/tailwindcss/package.json` | `bun-plugin-tailwind` → `tailwindcss-bun-plugin` |
| `addons/tailwindcss/template/bunfig.toml` | `plugins = ["tailwindcss-bun-plugin"]` |
| `addons/tailwindcss/template/scripts/build.ts` | `import tailwind from 'tailwindcss-bun-plugin'` |
| `src/index.ts` | addon hint 文案更新 |
| `README.md` | addon 表格说明更新 |

### 验收

- [ ] `bun create` 选 tailwindcss addon 后，`bun run dev` / `bun run build` 正常
- [ ] 改 Tailwind class 后 HMR 样式即时更新
- [ ] 与 umbra 的 `bunfig.toml` / `build.ts` 配置保持一致

---

## tsgo addon：切换到 TypeScript 7（已内置 tsgo）

**状态：** ✅ 已完成（2026-07-11）  
**优先级：** 中  
**记录日期：** 2026-07-11

TypeScript 7 起 `tsgo` 原生内置，不再需要单独安装 `@typescript/native-preview`。

### 改动

| 文件 | 改动 |
|------|------|
| `addons/tsgo/package.json` | `@typescript/native-preview` → `typescript: "^7.0.0"` |
| `package.json` (root) | 同上 |
| `README.md` | tsgo 描述更新：`(typescript 7+ includes tsgo)` |
