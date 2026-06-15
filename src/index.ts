import { spawn } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { cp, rename } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ansi, printRows } from './ansi';

const MODES = ['lib', 'app', 'react'] as const;
type Mode = (typeof MODES)[number];

const modeColor = (mode: Mode) => {
  switch (mode) {
    case 'react':
      return ansi.react(mode);
    case 'app':
      return ansi.bun(mode);
  }
  return ansi.bun2(mode);
};

const printModes = () => {
  const buf = [];
  for (const mode of MODES) {
    buf.push(modeColor(mode));
  }
  return buf.join('/');
};

const printUsage = () => {
  printRows(
    ansi.help('Usage:'),
    `  bun create @meld-ts/bun ${ansi.required('<project-name>', 'bold')} ${ansi.optional('[--mode|-m app|lib|react]')}`,
  );
};

// 'react' mode maps to the template-react-app directory on disk
const templateDirName = (mode: Mode) =>
  mode === 'react' ? 'template-react-app' : `template-${mode}`;

class CliError extends Error {
  constructor(
    message: string,
    public showUsage = false,
  ) {
    super(message);
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      mode: { type: 'string', short: 'm' },
      cwd: { type: 'string' },
      'template-root': { type: 'string' },
      rm: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });

  const cwd = values.cwd ? values.cwd : process.cwd();

  const projectName = positionals[0];
  if (!projectName) {
    throw new CliError('project-name is required', true);
  }

  const targetDir = resolve(cwd, projectName);
  if (existsSync(targetDir)) {
    if (values.rm) {
      rmSync(targetDir, { recursive: true });
    } else {
      throw new CliError(`Error: directory "${projectName}" already exists.`);
    }
  }

  let mode: Mode;
  const modeArg = values.mode?.trim();
  if (modeArg != null) {
    if (!MODES.includes(modeArg as Mode)) {
      throw new CliError(
        `Error: invalid mode "${modeArg}". Must be one of: ${MODES.join(', ')}`,
      );
    }
    mode = modeArg as Mode;
  } else {
    const input =
      prompt(`Project mode (${printModes()}):`, 'lib')?.trim() ??
      'lib';
    mode = (MODES.includes(input as Mode) ? input : 'lib') as Mode;
  }

  printRows('', `Setting up ${ansi.required(projectName, 'bold')} project...`);

  const packageRoot = values['template-root']
    ? resolve(values['template-root'])
    : resolve(fileURLToPath(import.meta.url), '..');
  const templateDir = join(packageRoot, templateDirName(mode));

  await cp(templateDir, targetDir, { recursive: true });

  // create-vite convention: _gitignore → .gitignore
  await rename(
    join(targetDir, '_gitignore'),
    join(targetDir, '.gitignore'),
  ).catch(() => {});

  // set project name
  // biome-ignore lint/suspicious/noExplicitAny: json manipulation
  const pkg = (await Bun.file(
    join(targetDir, 'package.json'),
  ).json()) as Record<string, any>;
  pkg.name = projectName;
  await Bun.write(
    join(targetDir, 'package.json'),
    `${JSON.stringify(pkg, null, 2)}\n`,
  );

  const run = (cmd: string, args: string[]) =>
    new Promise<number>((resolve, reject) => {
      const proc = spawn(cmd, args, { cwd: targetDir, stdio: 'inherit', shell: true });
      proc.on('close', resolve);
      proc.on('error', reject);
    });

  printRows('', 'Installing dependencies...', '');
  const installCode = await run('bun', ['install']);
  if (installCode !== 0) throw new CliError(`bun install failed (exit code ${installCode})`);

  printRows('', 'Migrating biome config...', '');
  const migrateCode = await run('bunx', ['biome', 'migrate', '--write']);
  if (migrateCode !== 0) throw new CliError(`biome migrate failed (exit code ${migrateCode})`);

  const nextCmd = mode === 'react' ? 'bun run dev' : 'bun run ts-check && bun run test';
  printRows(
    '',
    `${ansi.help('✓')} ${ansi.required(projectName, 'bold')} is ready!`,
    '',
    `  cd ${projectName}`,
    `  ${nextCmd}`,
    '',
  );
}

if (import.meta.main) {
  main().catch((err) => {
    const msg = err.message ?? `${err}`;
    printRows(ansi.error(`Error: ${msg}`));
    if (err.showUsage) {
      printRows('');
      printUsage();
    }
  });
}
