import * as p from '@clack/prompts';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { cp, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

// ─── types ────────────────────────────────────────────────────────────────────

type ProjectType = 'lib' | 'app' | 'react-app';
type LintTool = 'none' | 'biome' | 'oxc';
type Extra = 'tsgo' | 'bunup' | 'tailwindcss' | 'tanstack-router';
// biome-ignore lint/suspicious/noExplicitAny: json merge
type PkgJson = Record<string, any>;

interface AddonMeta {
  layer?: string;
  order?: number;
  postInstall?: string[];
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const hl = (s: string) => `\x1b[33m${s}\x1b[2m`;

function cancelIfCancelled<T>(v: T | symbol): T {
  if (p.isCancel(v)) {
    p.cancel('Cancelled.');
    process.exit(0);
  }
  return v as T;
}

function run(args: string[], cwd: string): Promise<number> {
  return new Promise((resolve, reject) => {
    // biome-ignore lint/style/noNonNullAssertion: args[0] always present after parseArgs
    const proc = spawn(args[0]!, args.slice(1), {
      cwd,
      stdio: 'inherit',
      shell: true,
    });
    proc.on('close', (code) => resolve(code ?? 0));
    proc.on('error', reject);
  });
}

async function readJson<T = PkgJson>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf-8')) as T;
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

function listFiles(dir: string, base = dir): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) return result;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      result.push(...listFiles(full, base));
    } else {
      result.push(full.slice(base.length + 1));
    }
  }
  return result;
}

function mergePackageJson(base: PkgJson, ...addons: PkgJson[]): PkgJson {
  const result: PkgJson = { ...base };
  for (const addon of addons) {
    for (const key of [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'scripts',
    ] as const) {
      if (addon[key]) result[key] = { ...(result[key] ?? {}), ...addon[key] };
    }
  }
  return result;
}

function deepMergeJson(target: PkgJson, source: PkgJson): PkgJson {
  const result = { ...target };
  for (const [key, srcVal] of Object.entries(source)) {
    const tgtVal = result[key];
    if (Array.isArray(srcVal) && Array.isArray(tgtVal)) {
      result[key] = [...tgtVal, ...srcVal];
    } else if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
      result[key] = deepMergeJson(tgtVal, srcVal);
    } else if (isPlainObject(srcVal)) {
      result[key] = { ...srcVal };
    } else {
      result[key] = srcVal;
    }
  }
  return result;
}

// biome-ignore lint/suspicious/noExplicitAny: json value
function isPlainObject(v: any): v is Record<string, any> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function validatePackageName(v: string | undefined): string | undefined {
  if (!v?.trim()) return 'Package name is required';
  if (
    !/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(v.trim())
  ) {
    return 'Use lowercase + hyphens. Scoped: @org/name';
  }
}

async function readAddonMeta(addonDir: string): Promise<AddonMeta> {
  const metaPath = join(addonDir, 'addon.json');
  if (!existsSync(metaPath)) return {};
  return readJson<AddonMeta>(metaPath);
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      cwd: { type: 'string' },
      'template-root': { type: 'string' },
      rm: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });

  const cwd = values.cwd ? resolve(values.cwd) : process.cwd();
  const packageRoot = values['template-root']
    ? resolve(values['template-root'])
    : resolve(fileURLToPath(import.meta.url), '..');

  p.intro('  create @meld-ts/bun  ');

  // ── Step 1: project name ───────────────────────────────────────────────────

  let packageName = positionals[0]?.trim() ?? '';
  if (!packageName) {
    packageName = cancelIfCancelled(
      await p.text({
        message: 'Project name:',
        placeholder: 'my-app  or  @org/my-lib',
        validate: validatePackageName,
      }),
    );
  }

  let dirName: string;
  if (packageName.startsWith('@')) {
    const slash = packageName.indexOf('/');
    const ns = packageName.slice(1, slash);
    const name = packageName.slice(slash + 1);
    dirName = cancelIfCancelled(
      await p.select({
        message: 'Directory name:',
        options: [
          {
            value: `${ns}-${name}`,
            label: `${ns}-${name}`,
            hint: 'flat (recommended)',
          },
          {
            value: `${ns}/${name}`,
            label: `${ns}/${name}`,
            hint: 'nested subfolder',
          },
        ],
      }),
    );
  } else {
    dirName = packageName;
  }

  const targetDir = resolve(cwd, dirName);

  if (existsSync(targetDir)) {
    if (values.rm) {
      rmSync(targetDir, { recursive: true });
    } else {
      p.cancel(`"${dirName}" already exists. Pass --rm to overwrite.`);
      process.exit(1);
    }
  }

  // ── Step 2: project type ───────────────────────────────────────────────────

  const projectType = cancelIfCancelled(
    await p.select<ProjectType>({
      message: 'Project type:',
      options: [
        {
          value: 'lib',
          label: 'lib',
          hint: `${hl('declaration')} · .d.ts output · npm package`,
        },
        {
          value: 'app',
          label: 'app',
          hint: `${hl('private: true')} · ${hl('noEmit')} · runs directly`,
        },
        {
          value: 'react-app',
          label: 'react-app',
          hint: `${hl('index.html')} entry · ${hl('bun build')} · web SPA`,
        },
      ],
    }),
  );

  const isReactApp = projectType === 'react-app';

  // ── Step 3: lint / format ──────────────────────────────────────────────────

  const lintTool = cancelIfCancelled(
    await p.select<LintTool>({
      message: 'Lint & format:',
      options: isReactApp
        ? [
            {
              value: 'biome',
              label: 'Biome',
              hint: 'all-in-one linter + formatter',
            },
            {
              value: 'oxc',
              label: 'oxc',
              hint: 'oxlint + oxfmt  (faster, 660+ rules)',
            },
          ]
        : [
            { value: 'none', label: 'None' },
            {
              value: 'biome',
              label: 'Biome',
              hint: 'all-in-one linter + formatter',
            },
            {
              value: 'oxc',
              label: 'oxc',
              hint: 'oxlint + oxfmt  (faster, 660+ rules)',
            },
          ],
    }),
  );

  // ── Step 4: extras / addons ────────────────────────────────────────────────

  let extras: Extra[] = [];

  if (isReactApp) {
    extras = cancelIfCancelled(
      await p.multiselect<Extra>({
        message: 'Add-ons:  (space to toggle)',
        options: [
          {
            value: 'tsgo',
            label: 'tsgo',
            hint: 'native TS compiler — faster ts-check',
          },
          {
            value: 'tailwindcss',
            label: 'tailwindcss',
            hint: 'utility-first CSS (v4 + bun-plugin-tailwind)',
          },
          {
            value: 'tanstack-router',
            label: 'tanstack-router',
            hint: 'file-based type-safe router',
          },
        ],
        required: false,
      }),
    );
  } else {
    extras = cancelIfCancelled(
      await p.multiselect<Extra>({
        message: 'Add-ons:  (space to toggle)',
        options: [
          {
            value: 'tsgo',
            label: 'tsgo',
            hint: 'native TS compiler — faster ts-check',
          },
          {
            value: 'bunup',
            label: 'bunup',
            hint: 'build tool for Bun libraries',
          },
        ],
        required: false,
      }),
    );
  }

  const addonNames: string[] = [
    ...(lintTool !== 'none' ? [lintTool] : []),
    ...extras,
  ];

  // sort addons by layer.order
  const sortedAddons: { name: string; meta: AddonMeta }[] = [];
  for (const name of addonNames) {
    const meta = await readAddonMeta(join(packageRoot, 'addons', name));
    sortedAddons.push({ name, meta });
  }
  sortedAddons.sort((a, b) => (a.meta.order ?? 99) - (b.meta.order ?? 99));

  // ── scaffold ───────────────────────────────────────────────────────────────

  const s = p.spinner();
  s.start('Scaffolding...');

  const parentDir = dirname(targetDir);
  if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true });

  // select template
  const templateDir = isReactApp ? 'template-react-app' : 'template-bun';
  await cp(join(packageRoot, templateDir), targetDir, { recursive: true });
  await rename(
    join(targetDir, '_gitignore'),
    join(targetDir, '.gitignore'),
  ).catch(() => {});

  // build merged package.json
  let pkg = await readJson(join(targetDir, 'package.json'));
  pkg.name = packageName;

  if (projectType === 'lib') {
    pkg.module = './src/index.ts';
    pkg.types = './src/index.ts';
    pkg.files = ['./dist'];

    const tsconfigPath = join(targetDir, 'tsconfig.json');
    const tsconfig = await readJson(tsconfigPath);
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      declaration: true,
      isolatedDeclarations: true,
    };
    await writeJson(tsconfigPath, tsconfig);
  } else {
    pkg.private = true;
  }

  // merge package.json from addons
  for (const { name } of sortedAddons) {
    const addonPkgPath = join(packageRoot, 'addons', name, 'package.json');
    if (existsSync(addonPkgPath)) {
      pkg = mergePackageJson(pkg, await readJson(addonPkgPath));
    }
  }

  await writeJson(join(targetDir, 'package.json'), pkg);

  // apply addons in sorted order: merge/ + template/
  for (const { name } of sortedAddons) {
    const addonDir = join(packageRoot, 'addons', name);
    if (!existsSync(addonDir)) continue;

    const mergeDir = join(addonDir, 'merge');
    const templateDir = join(addonDir, 'template');

    // new-style addon: merge/ for deep-merge, template/ for copy
    if (existsSync(mergeDir) || existsSync(templateDir)) {
      // deep-merge merge/*.json files
      if (existsSync(mergeDir)) {
        for (const file of listFiles(mergeDir)) {
          const targetPath = join(targetDir, file);
          if (!existsSync(targetPath)) continue; // skip if target doesn't exist
          const mergeContent = await readJson(join(mergeDir, file));
          const targetContent = await readJson(targetPath);
          await writeJson(
            targetPath,
            deepMergeJson(targetContent, mergeContent),
          );
        }
      }

      // copy template/ files
      if (existsSync(templateDir)) {
        for (const file of listFiles(templateDir)) {
          const dest = join(targetDir, file);
          const destDir = dirname(dest);
          if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
          await cp(join(templateDir, file), dest);
        }
      }
    } else {
      // old-style addon: copy all files (skip package.json and addon.json)
      for (const file of listFiles(addonDir)) {
        if (file === 'package.json' || file === 'addon.json') continue;
        const dest = join(targetDir, file);
        const destDir = dirname(dest);
        if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
        await cp(join(addonDir, file), dest);
      }
    }
  }

  s.stop('Project structure ready.');

  // ── bun install ────────────────────────────────────────────────────────────

  p.log.step('Running bun install...');
  const installCode = await run(['bun', 'install'], targetDir);
  if (installCode !== 0) {
    p.cancel(`bun install failed (exit ${installCode})`);
    process.exit(installCode);
  }

  // ── post-install ───────────────────────────────────────────────────────────

  for (const { meta } of sortedAddons) {
    for (const cmd of meta.postInstall ?? []) {
      p.log.step(cmd);
      await run(cmd.split(' '), targetDir);
    }
  }

  // ── outro ──────────────────────────────────────────────────────────────────

  const cd = dirName.replace(/\\/g, '/');
  let next: string;
  if (projectType === 'lib') {
    next = 'bun run ts-check && bun test';
  } else if (isReactApp) {
    next = 'bun run dev';
  } else {
    next = 'bun run dev';
  }

  p.outro(`✓ ${packageName} ready!\n\n  cd ${cd}\n  ${next}`);
}

if (import.meta.main) {
  main().catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    p.cancel(`Error: ${msg}`);
    process.exit(1);
  });
}
