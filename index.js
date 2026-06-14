// @bun
// src/index.ts
import { cp, rename } from "fs/promises";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
var MODES = ["lib", "app", "react-app"];
var projectName = process.argv[2] ?? "my-project";
var targetDir = resolve(process.cwd(), projectName);
if (existsSync(targetDir)) {
  console.error(`Directory "${projectName}" already exists.`);
  process.exit(1);
}
var input = prompt(`Project mode (${MODES.join(" / ")}):`, "lib")?.trim() ?? "lib";
var mode = MODES.includes(input) ? input : "lib";
console.log(`
Setting up [${mode}] project...`);
var packageRoot = resolve(fileURLToPath(import.meta.url), "..");
var templateDir = join(packageRoot, `template-${mode}`);
await cp(templateDir, targetDir, { recursive: true });
await rename(join(targetDir, "_gitignore"), join(targetDir, ".gitignore")).catch(() => {});
var pkg = await Bun.file(join(targetDir, "package.json")).json();
pkg.name = projectName;
await Bun.write(join(targetDir, "package.json"), `${JSON.stringify(pkg, null, 2)}
`);
console.log(`
\u2705 [${mode}] project ready!`);
console.log(`
  cd ${projectName}`);
console.log("  bun install");
if (mode === "react-app") {
  console.log("  bun run dev");
} else {
  console.log("  bun run ts-check && bun run test");
}
