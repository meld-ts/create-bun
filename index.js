#!/usr/bin/env bun
// @bun

// src/index.ts
import { spawn } from "child_process";
import { existsSync, rmSync } from "fs";
import { cp, rename } from "fs/promises";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";

// src/ansi.ts
var {color: _color } = globalThis.Bun;
var ansiReset = "\x1B[0m";
var colors = {
  blue: "#0043F0",
  green: "#00F02C",
  bun: "#F490B6",
  bun2: "#fbf0df",
  react: "#58C4E5",
  error: "#f92672",
  warning: "#ffc107",
  required: "#66d9ef",
  optional: "#c4be89",
  help: "#a6e22e",
  white: "#ffffff",
  black: "#1F1F1F",
  bgPaper: "#DEDCD3",
  bgError: "#cc054e",
  bgWarning: "#d19d00",
  bgInfo: "#02b6d9",
  bgHelp: "#83b819",
  bgOptional: "#8b8446"
};
var color = (hexValue) => _color(hexValue, "ansi-16m");
var bgColor = (hexValue) => {
  const fgColor = color(hexValue);
  return fgColor?.replace("38;", "48;") ?? null;
};
var isAnsiColor = (value) => {
  if (!value)
    return false;
  return /^\u001B\[[34]8;2;\d{1,3};\d{1,3};\d{1,3}m$/.test(value);
};
var ansiMix = (msg, flags, isClose = true) => {
  if (flags != null) {
    const _flags = Array.isArray(flags) ? flags : [flags];
    const willReset = _flags.includes("reset");
    const willClose = _flags.includes("close") || isClose;
    const heads = [];
    const tails = [msg];
    if (willReset)
      heads.push(ansiReset);
    if (willClose)
      tails.push(ansiReset);
    const loop = (items) => {
      for (const flag of items) {
        if (isAnsiColor(flag)) {
          heads.push(flag);
          continue;
        }
        if (!isAnsiStyle(flag))
          continue;
        const it = ansiStyles[flag];
        if (it == null)
          continue;
        if (typeof it === "function") {
          tails[0] = it(msg);
        } else if (Array.isArray(it)) {
          loop(it);
        } else {
          heads.push(it);
        }
      }
    };
    loop(_flags);
    return heads.concat(tails).join("");
  }
  return msg;
};
var bold = (msg, flags) => ansiMix(`\x1B[1m${msg}\x1B[22m`, Array.isArray(flags) ? flags : flags != null ? [flags] : undefined);
var ansiStyles = {
  ...Object.entries(colors).reduce((acc, [key, value]) => {
    acc[key] = key.startsWith("bg") ? bgColor(value) : color(value);
    return acc;
  }, {}),
  bold,
  error: [color(colors.error), "bold"]
};
var isAnsiStyle = (value) => value != null && (value in ansiStyles);
var ansi = Object.keys(ansiStyles).reduce((acc, key) => {
  if (typeof ansiStyles[key] === "function") {
    acc[key] = ansiStyles[key];
  } else {
    acc[key] = (msg, flags = "close") => ansiMix(msg, [key, ...Array.isArray(flags) ? flags : [flags]]);
  }
  return acc;
}, {});
var printRows = (...rows) => process.stdout.write(`${rows.join(`
`)}
`);

// src/index.ts
var MODES = ["lib", "app", "react"];
var modeColor = (mode) => {
  switch (mode) {
    case "react":
      return ansi.react(mode);
    case "app":
      return ansi.bun(mode);
  }
  return ansi.bun2(mode);
};
var printModes = () => {
  const buf = [];
  for (const mode of MODES) {
    buf.push(modeColor(mode));
  }
  return buf.join("/");
};
var printUsage = () => {
  printRows(ansi.help("Usage:"), `  bun create @meld-ts/bun ${ansi.required("<project-name>", "bold")} ${ansi.optional("[--mode|-m app|lib|react]")}`);
};
var templateDirName = (mode) => mode === "react" ? "template-react-app" : `template-${mode}`;

class CliError extends Error {
  showUsage;
  constructor(message, showUsage = false) {
    super(message);
    this.showUsage = showUsage;
  }
}
async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      mode: { type: "string", short: "m" },
      cwd: { type: "string" },
      "template-root": { type: "string" },
      rm: { type: "boolean", default: false }
    },
    allowPositionals: true
  });
  const cwd = values.cwd ? values.cwd : process.cwd();
  const projectName = positionals[0];
  if (!projectName) {
    throw new CliError("project-name is required", true);
  }
  const targetDir = resolve(cwd, projectName);
  if (existsSync(targetDir)) {
    if (values.rm) {
      rmSync(targetDir, { recursive: true });
    } else {
      throw new CliError(`Error: directory "${projectName}" already exists.`);
    }
  }
  let mode;
  const modeArg = values.mode?.trim();
  if (modeArg != null) {
    if (!MODES.includes(modeArg)) {
      throw new CliError(`Error: invalid mode "${modeArg}". Must be one of: ${MODES.join(", ")}`);
    }
    mode = modeArg;
  } else {
    const input = prompt(`Project mode (${printModes()}):`, "lib")?.trim() ?? "lib";
    mode = MODES.includes(input) ? input : "lib";
  }
  printRows("", `Setting up ${ansi.required(projectName, "bold")} project...`);
  const packageRoot = values["template-root"] ? resolve(values["template-root"]) : resolve(fileURLToPath(import.meta.url), "..");
  const templateDir = join(packageRoot, templateDirName(mode));
  await cp(templateDir, targetDir, { recursive: true });
  await rename(join(targetDir, "_gitignore"), join(targetDir, ".gitignore")).catch(() => {});
  const pkg = await Bun.file(join(targetDir, "package.json")).json();
  pkg.name = projectName;
  await Bun.write(join(targetDir, "package.json"), `${JSON.stringify(pkg, null, 2)}
`);
  const run = (cmd, args) => new Promise((resolve2, reject) => {
    const proc = spawn(cmd, args, { cwd: targetDir, stdio: "inherit", shell: true });
    proc.on("close", resolve2);
    proc.on("error", reject);
  });
  printRows("", "Installing dependencies...", "");
  const installCode = await run("bun", ["install"]);
  if (installCode !== 0)
    throw new CliError(`bun install failed (exit code ${installCode})`);
  printRows("", "Migrating biome config...", "");
  const migrateCode = await run("bunx", ["biome", "migrate", "--write"]);
  if (migrateCode !== 0)
    throw new CliError(`biome migrate failed (exit code ${migrateCode})`);
  const nextCmd = mode === "react" ? "bun run dev" : "bun run ts-check && bun run test";
  printRows("", `${ansi.help("\u2713")} ${ansi.required(projectName, "bold")} is ready!`, "", `  cd ${projectName}`, `  ${nextCmd}`, "");
}
if (import.meta.main) {
  main().catch((err) => {
    const msg = err.message ?? `${err}`;
    printRows(ansi.error(`Error: ${msg}`));
    if (err.showUsage) {
      printRows("");
      printUsage();
    }
  });
}
