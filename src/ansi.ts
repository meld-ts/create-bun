import { color as _color } from 'bun';

const ansiReset = '\x1b[0m';

const colors = {
  blue: '#0043F0',
  green: '#00F02C',
  bun: '#F490B6',
  bun2: '#fbf0df',
  react: '#58C4E5',
  error: '#f92672',
  warning: '#ffc107',
  required: '#66d9ef',
  optional: '#c4be89',
  help: '#a6e22e',
  white: '#ffffff',
  black: '#1F1F1F',
  bgPaper: '#DEDCD3',
  bgError: '#cc054e',
  bgWarning: '#d19d00',
  bgInfo: '#02b6d9',
  bgHelp: '#83b819',
  bgOptional: '#8b8446',
} as const;

type AnsiColor = string | null;
type AnsiFlag = 'close' | 'reset' | 'bold';
type AnsiStyle = keyof typeof colors | 'bold';
type AnsiStyleMixed = AnsiStyle | AnsiFlag | AnsiColor;
type AnsiStyleCallback = (
  msg: string,
  flags?: AnsiStyleMixed | AnsiStyleMixed[],
) => string;

const color = (hexValue: string): AnsiColor => _color(hexValue, 'ansi-16m');

const bgColor = (hexValue: string): AnsiColor => {
  const fgColor = color(hexValue);
  return fgColor?.replace('38;', '48;') ?? null;
};

const isAnsiColor = (value?: string | null): boolean => {
  if (!value) return false;
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ansi color check
  return /^\[[34]8;2;\d{1,3};\d{1,3};\d{1,3}m$/.test(value);
};

// ansiMix is declared before bold because bold calls ansiMix.
// ansiStyles and isAnsiStyle are referenced lazily (only at call time).
export const ansiMix = (
  msg: string,
  flags?: AnsiStyleMixed | AnsiStyleMixed[],
  isClose = true,
): string => {
  if (flags != null) {
    const _flags = Array.isArray(flags) ? flags : [flags];
    const willReset = _flags.includes('reset');
    const willClose = _flags.includes('close') || isClose;
    const heads: unknown[] = [];
    const tails: string[] = [msg];
    if (willReset) heads.push(ansiReset);
    if (willClose) tails.push(ansiReset);
    const loop = (items: AnsiStyleMixed[]) => {
      for (const flag of items) {
        if (isAnsiColor(flag)) {
          heads.push(flag);
          continue;
        }
        if (!isAnsiStyle(flag)) continue;
        const it = ansiStyles[flag];
        if (it == null) continue;
        if (typeof it === 'function') {
          tails[0] = it(msg);
        } else if (Array.isArray(it)) {
          loop(it);
        } else {
          heads.push(it);
        }
      }
    };
    loop(_flags);
    return heads.concat(tails).join('');
  }
  return msg;
};

const bold = (msg: string, flags?: AnsiStyleMixed | AnsiStyleMixed[]) =>
  ansiMix(
    `\x1b[1m${msg}\x1b[22m`,
    Array.isArray(flags) ? flags : flags != null ? [flags] : undefined,
  );

const ansiStyles: Record<string, any> = {
  ...Object.entries(colors).reduce(
    (acc, [key, value]) => {
      acc[key] = key.startsWith('bg') ? bgColor(value) : color(value);
      return acc;
    },
    {} as Record<string, AnsiColor>,
  ),
  bold,
  // error needs red + bold, override the plain color from the reduce above
  error: [color(colors.error), 'bold'],
};

const isAnsiStyle = (value?: string | null): value is AnsiStyle =>
  value != null && value in ansiStyles;

export const ansi = (Object.keys(ansiStyles) as AnsiStyle[]).reduce(
  (acc, key) => {
    if (typeof ansiStyles[key] === 'function') {
      acc[key] = ansiStyles[key];
    } else {
      acc[key] = (
        msg: string,
        flags: AnsiStyleMixed | AnsiStyleMixed[] = 'close',
      ) => ansiMix(msg, [key, ...(Array.isArray(flags) ? flags : [flags])]);
    }
    return acc;
  },
  {} as Record<AnsiStyle, AnsiStyleCallback>,
);

export type LabelType = 'error' | 'warn' | 'info' | 'help';

export const label = (msg: string, type: LabelType) => {
  let bg: string = colors.bgOptional;
  switch (type) {
    case 'error':
      bg = colors.bgError;
      break;
    case 'warn':
      bg = colors.bgWarning;
      break;
    case 'info':
      bg = colors.bgInfo;
      break;
    case 'help':
      bg = colors.bgHelp;
      break;
  }
  return `${ansiMix(` ${type.toUpperCase()} `, [bgColor(bg), 'bold', 'white'])}${ansiMix(` ${msg} `, [bgColor(colors.bgPaper), 'bold', 'black'])}`;
};

export const printRows = (...rows: string[]) =>
  process.stdout.write(`${rows.join('\n')}\n`);
