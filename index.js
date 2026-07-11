#!/usr/bin/env bun
// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC2 = "\x1B";
  var CSI2 = `${ESC2}[`;
  var beep = "\x07";
  var cursor = {
    to(x, y) {
      if (!y)
        return `${CSI2}${x + 1}G`;
      return `${CSI2}${y + 1};${x + 1}H`;
    },
    move(x, y) {
      let ret = "";
      if (x < 0)
        ret += `${CSI2}${-x}D`;
      else if (x > 0)
        ret += `${CSI2}${x}C`;
      if (y < 0)
        ret += `${CSI2}${-y}A`;
      else if (y > 0)
        ret += `${CSI2}${y}B`;
      return ret;
    },
    up: (count = 1) => `${CSI2}${count}A`,
    down: (count = 1) => `${CSI2}${count}B`,
    forward: (count = 1) => `${CSI2}${count}C`,
    backward: (count = 1) => `${CSI2}${count}D`,
    nextLine: (count = 1) => `${CSI2}E`.repeat(count),
    prevLine: (count = 1) => `${CSI2}F`.repeat(count),
    left: `${CSI2}G`,
    hide: `${CSI2}?25l`,
    show: `${CSI2}?25h`,
    save: `${ESC2}7`,
    restore: `${ESC2}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI2}S`.repeat(count),
    down: (count = 1) => `${CSI2}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI2}2J`,
    up: (count = 1) => `${CSI2}1J`.repeat(count),
    down: (count = 1) => `${CSI2}J`.repeat(count),
    line: `${CSI2}2K`,
    lineEnd: `${CSI2}K`,
    lineStart: `${CSI2}1K`,
    lines(count) {
      let clear = "";
      for (let i = 0;i < count; i++)
        clear += this.line + (i < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/@clack/core/dist/index.mjs
import { styleText } from "util";
import { stdout, stdin } from "process";
import * as l from "readline";
import l__default from "readline";

// node_modules/fast-string-truncated-width/dist/utils.js
var getCodePointsLength = (() => {
  const SURROGATE_PAIR_RE = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return (input) => {
    let surrogatePairsNr = 0;
    SURROGATE_PAIR_RE.lastIndex = 0;
    while (SURROGATE_PAIR_RE.test(input)) {
      surrogatePairsNr += 1;
    }
    return input.length - surrogatePairsNr;
  };
})();
var isFullWidth = (x) => {
  return x === 12288 || x >= 65281 && x <= 65376 || x >= 65504 && x <= 65510;
};
var isWideNotCJKTNotEmoji = (x) => {
  return x === 8987 || x === 9001 || x >= 12272 && x <= 12287 || x >= 12289 && x <= 12350 || x >= 12441 && x <= 12543 || x >= 12549 && x <= 12591 || x >= 12593 && x <= 12686 || x >= 12688 && x <= 12771 || x >= 12783 && x <= 12830 || x >= 12832 && x <= 12871 || x >= 12880 && x <= 19903 || x >= 65040 && x <= 65049 || x >= 65072 && x <= 65106 || x >= 65108 && x <= 65126 || x >= 65128 && x <= 65131 || x >= 127488 && x <= 127490 || x >= 127504 && x <= 127547 || x >= 127552 && x <= 127560 || x >= 131072 && x <= 196605 || x >= 196608 && x <= 262141;
};

// node_modules/fast-string-truncated-width/dist/index.js
var ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y;
var CONTROL_RE = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var CJKT_WIDE_RE = /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/yu;
var TAB_RE = /\t{1,1000}/y;
var EMOJI_RE = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/yu;
var LATIN_RE = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var MODIFIER_RE = /\p{M}+/gu;
var NO_TRUNCATION = { limit: Infinity, ellipsis: "" };
var getStringTruncatedWidth = (input, truncationOptions = {}, widthOptions = {}) => {
  const LIMIT = truncationOptions.limit ?? Infinity;
  const ELLIPSIS = truncationOptions.ellipsis ?? "";
  const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? (ELLIPSIS ? getStringTruncatedWidth(ELLIPSIS, NO_TRUNCATION, widthOptions).width : 0);
  const ANSI_WIDTH = 0;
  const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;
  const TAB_WIDTH = widthOptions.tabWidth ?? 8;
  const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
  const FULL_WIDTH_WIDTH = 2;
  const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
  const WIDE_WIDTH = widthOptions.wideWidth ?? FULL_WIDTH_WIDTH;
  const PARSE_BLOCKS = [
    [LATIN_RE, REGULAR_WIDTH],
    [ANSI_RE, ANSI_WIDTH],
    [CONTROL_RE, CONTROL_WIDTH],
    [TAB_RE, TAB_WIDTH],
    [EMOJI_RE, EMOJI_WIDTH],
    [CJKT_WIDE_RE, WIDE_WIDTH]
  ];
  let indexPrev = 0;
  let index = 0;
  let length = input.length;
  let lengthExtra = 0;
  let truncationEnabled = false;
  let truncationIndex = length;
  let truncationLimit = Math.max(0, LIMIT - ELLIPSIS_WIDTH);
  let unmatchedStart = 0;
  let unmatchedEnd = 0;
  let width = 0;
  let widthExtra = 0;
  outer:
    while (true) {
      if (unmatchedEnd > unmatchedStart || index >= length && index > indexPrev) {
        const unmatched = input.slice(unmatchedStart, unmatchedEnd) || input.slice(indexPrev, index);
        lengthExtra = 0;
        for (const char of unmatched.replaceAll(MODIFIER_RE, "")) {
          const codePoint = char.codePointAt(0) || 0;
          if (isFullWidth(codePoint)) {
            widthExtra = FULL_WIDTH_WIDTH;
          } else if (isWideNotCJKTNotEmoji(codePoint)) {
            widthExtra = WIDE_WIDTH;
          } else {
            widthExtra = REGULAR_WIDTH;
          }
          if (width + widthExtra > truncationLimit) {
            truncationIndex = Math.min(truncationIndex, Math.max(unmatchedStart, indexPrev) + lengthExtra);
          }
          if (width + widthExtra > LIMIT) {
            truncationEnabled = true;
            break outer;
          }
          lengthExtra += char.length;
          width += widthExtra;
        }
        unmatchedStart = unmatchedEnd = 0;
      }
      if (index >= length) {
        break outer;
      }
      for (let i = 0, l = PARSE_BLOCKS.length;i < l; i++) {
        const [BLOCK_RE, BLOCK_WIDTH] = PARSE_BLOCKS[i];
        BLOCK_RE.lastIndex = index;
        if (BLOCK_RE.test(input)) {
          lengthExtra = BLOCK_RE === CJKT_WIDE_RE ? getCodePointsLength(input.slice(index, BLOCK_RE.lastIndex)) : BLOCK_RE === EMOJI_RE ? 1 : BLOCK_RE.lastIndex - index;
          widthExtra = lengthExtra * BLOCK_WIDTH;
          if (width + widthExtra > truncationLimit) {
            truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / BLOCK_WIDTH));
          }
          if (width + widthExtra > LIMIT) {
            truncationEnabled = true;
            break outer;
          }
          width += widthExtra;
          unmatchedStart = indexPrev;
          unmatchedEnd = index;
          index = indexPrev = BLOCK_RE.lastIndex;
          continue outer;
        }
      }
      index += 1;
    }
  return {
    width: truncationEnabled ? truncationLimit : width,
    index: truncationEnabled ? truncationIndex : length,
    truncated: truncationEnabled,
    ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
  };
};
var dist_default = getStringTruncatedWidth;

// node_modules/fast-string-width/dist/index.js
var NO_TRUNCATION2 = {
  limit: Infinity,
  ellipsis: "",
  ellipsisWidth: 0
};
var fastStringWidth = (input, options = {}) => {
  return dist_default(input, NO_TRUNCATION2, options).width;
};
var dist_default2 = fastStringWidth;

// node_modules/fast-wrap-ansi/lib/main.js
var ESC = "\x1B";
var CSI = "\x9B";
var END_CODE = 39;
var ANSI_ESCAPE_BELL = "\x07";
var ANSI_CSI = "[";
var ANSI_OSC = "]";
var ANSI_SGR_TERMINATOR = "m";
var ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
var GROUP_REGEX = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`, "y");
var getClosingCode = (openingCode) => {
  if (openingCode >= 30 && openingCode <= 37)
    return 39;
  if (openingCode >= 90 && openingCode <= 97)
    return 39;
  if (openingCode >= 40 && openingCode <= 47)
    return 49;
  if (openingCode >= 100 && openingCode <= 107)
    return 49;
  if (openingCode === 1 || openingCode === 2)
    return 22;
  if (openingCode === 3)
    return 23;
  if (openingCode === 4)
    return 24;
  if (openingCode === 7)
    return 27;
  if (openingCode === 8)
    return 28;
  if (openingCode === 9)
    return 29;
  if (openingCode === 0)
    return 0;
  return;
};
var wrapAnsiCode = (code) => `${ESC}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
var wrapAnsiHyperlink = (url) => `${ESC}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
var wrapWord = (rows, word, columns) => {
  const characters = word[Symbol.iterator]();
  let isInsideEscape = false;
  let isInsideLinkEscape = false;
  let lastRow = rows.at(-1);
  let visible = lastRow === undefined ? 0 : dist_default2(lastRow);
  let currentCharacter = characters.next();
  let nextCharacter = characters.next();
  let rawCharacterIndex = 0;
  while (!currentCharacter.done) {
    const character = currentCharacter.value;
    const characterLength = dist_default2(character);
    if (visible + characterLength <= columns) {
      rows[rows.length - 1] += character;
    } else {
      rows.push(character);
      visible = 0;
    }
    if (character === ESC || character === CSI) {
      isInsideEscape = true;
      isInsideLinkEscape = word.startsWith(ANSI_ESCAPE_LINK, rawCharacterIndex + 1);
    }
    if (isInsideEscape) {
      if (isInsideLinkEscape) {
        if (character === ANSI_ESCAPE_BELL) {
          isInsideEscape = false;
          isInsideLinkEscape = false;
        }
      } else if (character === ANSI_SGR_TERMINATOR) {
        isInsideEscape = false;
      }
    } else {
      visible += characterLength;
      if (visible === columns && !nextCharacter.done) {
        rows.push("");
        visible = 0;
      }
    }
    currentCharacter = nextCharacter;
    nextCharacter = characters.next();
    rawCharacterIndex += character.length;
  }
  lastRow = rows.at(-1);
  if (!visible && lastRow !== undefined && lastRow.length && rows.length > 1) {
    rows[rows.length - 2] += rows.pop();
  }
};
var stringVisibleTrimSpacesRight = (string) => {
  const words = string.split(" ");
  let last = words.length;
  while (last) {
    if (dist_default2(words[last - 1])) {
      break;
    }
    last--;
  }
  if (last === words.length) {
    return string;
  }
  return words.slice(0, last).join(" ") + words.slice(last).join("");
};
var exec = (string, columns, options = {}) => {
  if (options.trim !== false && string.trim() === "") {
    return "";
  }
  let returnValue = "";
  let escapeCode;
  let escapeUrl;
  const words = string.split(" ");
  let rows = [""];
  let rowLength = 0;
  for (let index = 0;index < words.length; index++) {
    const word = words[index];
    if (options.trim !== false) {
      const row = rows.at(-1) ?? "";
      const trimmed = row.trimStart();
      if (row.length !== trimmed.length) {
        rows[rows.length - 1] = trimmed;
        rowLength = dist_default2(trimmed);
      }
    }
    if (index !== 0) {
      if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
        rows.push("");
        rowLength = 0;
      }
      if (rowLength || options.trim === false) {
        rows[rows.length - 1] += " ";
        rowLength++;
      }
    }
    const wordLength = dist_default2(word);
    if (options.hard && wordLength > columns) {
      const remainingColumns = columns - rowLength;
      const breaksStartingThisLine = 1 + Math.floor((wordLength - remainingColumns - 1) / columns);
      const breaksStartingNextLine = Math.floor((wordLength - 1) / columns);
      if (breaksStartingNextLine < breaksStartingThisLine) {
        rows.push("");
      }
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    if (rowLength + wordLength > columns && rowLength && wordLength) {
      if (options.wordWrap === false && rowLength < columns) {
        wrapWord(rows, word, columns);
        rowLength = dist_default2(rows.at(-1) ?? "");
        continue;
      }
      rows.push("");
      rowLength = 0;
    }
    if (rowLength + wordLength > columns && options.wordWrap === false) {
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    rows[rows.length - 1] += word;
    rowLength += wordLength;
  }
  if (options.trim !== false) {
    rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
  }
  const preString = rows.join(`
`);
  let inSurrogate = false;
  for (let i = 0;i < preString.length; i++) {
    const character = preString[i];
    returnValue += character;
    if (!inSurrogate) {
      inSurrogate = character >= "\uD800" && character <= "\uDBFF";
      if (inSurrogate) {
        continue;
      }
    } else {
      inSurrogate = false;
    }
    if (character === ESC || character === CSI) {
      GROUP_REGEX.lastIndex = i + 1;
      const groupsResult = GROUP_REGEX.exec(preString);
      const groups = groupsResult?.groups;
      if (groups?.code !== undefined) {
        const code = Number.parseFloat(groups.code);
        escapeCode = code === END_CODE ? undefined : code;
      } else if (groups?.uri !== undefined) {
        escapeUrl = groups.uri.length === 0 ? undefined : groups.uri;
      }
    }
    if (preString[i + 1] === `
`) {
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink("");
      }
      const closingCode = escapeCode ? getClosingCode(escapeCode) : undefined;
      if (escapeCode && closingCode) {
        returnValue += wrapAnsiCode(closingCode);
      }
    } else if (character === `
`) {
      if (escapeCode && getClosingCode(escapeCode)) {
        returnValue += wrapAnsiCode(escapeCode);
      }
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink(escapeUrl);
      }
    }
  }
  return returnValue;
};
var CRLF_OR_LF = /\r?\n/;
function wrapAnsi(string, columns, options) {
  return String(string).normalize().split(CRLF_OR_LF).map((line) => exec(line, columns, options)).join(`
`);
}

// node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
import { ReadStream } from "tty";
function findCursor(s, o, l2) {
  if (!l2.some((r) => !r.disabled))
    return s;
  const t = s + o, n = Math.max(l2.length - 1, 0), e = t < 0 ? n : t > n ? 0 : t;
  return l2[e].disabled ? findCursor(e, o < 0 ? -1 : 1, l2) : e;
}
function findTextCursor(s, o, l2, i) {
  const t = i.split(`
`);
  let n = 0, e = s;
  for (const r of t) {
    if (e <= r.length)
      break;
    e -= r.length + 1, n++;
  }
  for (n = Math.max(0, Math.min(t.length - 1, n + l2)), e = Math.min(e, t[n].length) + o;e < 0 && n > 0; )
    n--, e += t[n].length + 1;
  for (;e > t[n].length && n < t.length - 1; )
    e -= t[n].length + 1, n++;
  e = Math.max(0, Math.min(t[n].length, e));
  let h = 0;
  for (let r = 0;r < n; r++)
    h += t[r].length + 1;
  return h + e;
}
var a$2 = ["up", "down", "left", "right", "space", "enter", "cancel"];
var t = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var settings = {
  actions: new Set(a$2),
  aliases: /* @__PURE__ */ new Map([
    ["k", "up"],
    ["j", "down"],
    ["h", "left"],
    ["l", "right"],
    ["\x03", "cancel"],
    ["escape", "cancel"]
  ]),
  messages: {
    cancel: "Canceled",
    error: "Something went wrong"
  },
  withGuide: true,
  date: {
    monthNames: [...t],
    messages: {
      required: "Please enter a valid date",
      invalidMonth: "There are only 12 months in a year",
      invalidDay: (n, e) => `There are only ${n} days in ${e}`,
      afterMin: (n) => `Date must be on or after ${n.toISOString().slice(0, 10)}`,
      beforeMax: (n) => `Date must be on or before ${n.toISOString().slice(0, 10)}`
    }
  }
};
function isActionKey(n, e) {
  if (typeof n == "string")
    return settings.aliases.get(n) === e;
  for (const s of n)
    if (s !== undefined && isActionKey(s, e))
      return true;
  return false;
}
function diffLines(i, s) {
  if (i === s)
    return;
  const e = i.split(`
`), t2 = s.split(`
`), r = Math.max(e.length, t2.length), f = [];
  for (let n = 0;n < r; n++)
    e[n] !== t2[n] && f.push(n);
  return {
    lines: f,
    numLinesBefore: e.length,
    numLinesAfter: t2.length,
    numLines: r
  };
}
var R = globalThis.process.platform.startsWith("win");
var CANCEL_SYMBOL = Symbol("clack:cancel");
function isCancel(e) {
  return e === CANCEL_SYMBOL;
}
function setRawMode(e, r) {
  const o = e;
  o.isTTY && o.setRawMode(r);
}
function block({
  input: e = stdin,
  output: r = stdout,
  overwrite: o = true,
  hideCursor: t2 = true
} = {}) {
  const s = l.createInterface({
    input: e,
    output: r,
    prompt: "",
    tabSize: 1
  });
  l.emitKeypressEvents(e, s), e instanceof ReadStream && e.isTTY && e.setRawMode(true);
  const n = (f, { name: a, sequence: p }) => {
    const c = String(f);
    if (isActionKey([c, a, p], "cancel")) {
      t2 && r.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!o)
      return;
    const i = a === "return" ? 0 : -1, m = a === "return" ? -1 : 0;
    l.moveCursor(r, i, m, () => {
      l.clearLine(r, 1, () => {
        e.once("keypress", n);
      });
    });
  };
  return t2 && r.write(import_sisteransi.cursor.hide), e.once("keypress", n), () => {
    e.off("keypress", n), t2 && r.write(import_sisteransi.cursor.show), e instanceof ReadStream && e.isTTY && !R && e.setRawMode(false), s.terminal = false, s.close();
  };
}
var getColumns = (e) => ("columns" in e) && typeof e.columns == "number" ? e.columns : 80;
var getRows = (e) => ("rows" in e) && typeof e.rows == "number" ? e.rows : 20;
function wrapTextWithPrefix(e, r, o, t2 = o, s = o, n) {
  const f = getColumns(e ?? stdout);
  return wrapAnsi(r, f - o.length, {
    hard: true,
    trim: false
  }).split(`
`).map((c, i, m) => {
    const d = n ? n(c, i) : c;
    return i === 0 ? `${t2}${d}` : i === m.length - 1 ? `${s}${d}` : `${o}${d}`;
  }).join(`
`);
}
function runValidation(e, n) {
  if ("~standard" in e) {
    const a = e["~standard"].validate(n);
    if (a instanceof Promise)
      throw new TypeError("Schema validation must be synchronous. Update `validate()` and remove any asynchronous logic.");
    return a.issues?.at(0)?.message;
  }
  return e(n);
}

class V {
  input;
  output;
  _abortSignal;
  rl;
  opts;
  _render;
  _track = false;
  _prevFrame = "";
  _subscribers = /* @__PURE__ */ new Map;
  _cursor = 0;
  state = "initial";
  error = "";
  value;
  userInput = "";
  constructor(t2, e = true) {
    const { input: i = stdin, output: n = stdout, render: s, signal: r, ...o } = t2;
    this.opts = o, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = s.bind(this), this._track = e, this._abortSignal = r, this.input = i, this.output = n;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(t2, e) {
    const i = this._subscribers.get(t2) ?? [];
    i.push(e), this._subscribers.set(t2, i);
  }
  on(t2, e) {
    this.setSubscriber(t2, { cb: e });
  }
  once(t2, e) {
    this.setSubscriber(t2, { cb: e, once: true });
  }
  emit(t2, ...e) {
    const i = this._subscribers.get(t2) ?? [], n = [];
    for (const s of i)
      s.cb(...e), s.once && n.push(() => i.splice(i.indexOf(s), 1));
    for (const s of n)
      s();
  }
  prompt() {
    return new Promise((t2) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted)
          return this.state = "cancel", this.close(), t2(CANCEL_SYMBOL);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      this.rl = l__default.createInterface({
        input: this.input,
        tabSize: 2,
        prompt: "",
        escapeCodeTimeout: 50,
        terminal: true
      }), this.rl.prompt(), this.opts.initialUserInput !== undefined && this._setUserInput(this.opts.initialUserInput, true), this.input.on("keypress", this.onKeypress), setRawMode(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(CANCEL_SYMBOL);
      });
    });
  }
  _isActionKey(t2, e) {
    return t2 === "\t";
  }
  _shouldSubmit(t2, e) {
    return true;
  }
  _setValue(t2) {
    this.value = t2, this.emit("value", this.value);
  }
  _setUserInput(t2, e) {
    this.userInput = t2 ?? "", this.emit("userInput", this.userInput), e && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
  }
  _clearUserInput() {
    this.rl?.write(null, { ctrl: true, name: "u" }), this._setUserInput("");
  }
  onKeypress(t2, e) {
    if (this._track && e.name !== "return" && (e.name && this._isActionKey(t2, e) && this.rl?.write(null, { ctrl: true, name: "h" }), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), e?.name && (!this._track && settings.aliases.has(e.name) && this.emit("cursor", settings.aliases.get(e.name)), settings.actions.has(e.name) && this.emit("cursor", e.name)), t2 && (t2.toLowerCase() === "y" || t2.toLowerCase() === "n") && this.emit("confirm", t2.toLowerCase() === "y"), this.emit("key", t2, e), e?.name === "return" && this._shouldSubmit(t2, e)) {
      if (this.opts.validate) {
        const i = runValidation(this.opts.validate, this.value);
        i && (this.error = i instanceof Error ? i.message : i, this.state = "error", this.rl?.write(this.userInput));
      }
      this.state !== "error" && (this.state = "submit");
    }
    isActionKey([t2, e?.name, e?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), setRawMode(this.input, false), this.rl?.close(), this.rl = undefined, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const t2 = wrapAnsi(this._prevFrame, process.stdout.columns, { hard: true, trim: false }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, t2 * -1));
  }
  render() {
    const t2 = wrapAnsi(this._render(this) ?? "", process.stdout.columns, {
      hard: true,
      trim: false
    });
    if (t2 !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const e = diffLines(this._prevFrame, t2), i = getRows(this.output);
        if (this.restoreCursor(), e) {
          const n = Math.max(0, e.numLinesAfter - i), s = Math.max(0, e.numLinesBefore - i);
          let r = e.lines.find((o) => o >= n);
          if (r === undefined) {
            this._prevFrame = t2;
            return;
          }
          if (e.lines.length === 1) {
            this.output.write(import_sisteransi.cursor.move(0, r - s)), this.output.write(import_sisteransi.erase.lines(1));
            const o = t2.split(`
`);
            this.output.write(o[r]), this._prevFrame = t2, this.output.write(import_sisteransi.cursor.move(0, o.length - r - 1));
            return;
          } else if (e.lines.length > 1) {
            if (n < s)
              r = n;
            else {
              const h = r - s;
              h > 0 && this.output.write(import_sisteransi.cursor.move(0, h));
            }
            this.output.write(import_sisteransi.erase.down());
            const f = t2.split(`
`).slice(r);
            this.output.write(f.join(`
`)), this._prevFrame = t2;
            return;
          }
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(t2), this.state === "initial" && (this.state = "active"), this._prevFrame = t2;
    }
  }
}
function p$1(l2, e) {
  if (l2 === undefined || e.length === 0)
    return 0;
  const i = e.findIndex((s) => s.value === l2);
  return i !== -1 ? i : 0;
}
function g(l2, e) {
  return (e.label ?? String(e.value)).toLowerCase().includes(l2.toLowerCase());
}
function m(l2, e) {
  if (e)
    return l2 ? e : e[0];
}
var T$1 = class T extends V {
  filteredOptions;
  multiple;
  isNavigating = false;
  selectedValues = [];
  focusedValue;
  #e = 0;
  #s = "";
  #t;
  #i;
  #n;
  get cursor() {
    return this.#e;
  }
  get userInputWithCursor() {
    if (!this.userInput)
      return styleText(["inverse", "hidden"], "_");
    if (this._cursor >= this.userInput.length)
      return `${this.userInput}\u2588`;
    const e = this.userInput.slice(0, this._cursor), [t2, ...i] = this.userInput.slice(this._cursor);
    return `${e}${styleText("inverse", t2)}${i.join("")}`;
  }
  get options() {
    return typeof this.#i == "function" ? this.#i() : this.#i;
  }
  constructor(e) {
    super(e), this.#i = e.options, this.#n = e.placeholder;
    const t2 = this.options;
    this.filteredOptions = [...t2], this.multiple = e.multiple === true, this.#t = typeof e.options == "function" ? e.filter : e.filter ?? g;
    let i;
    if (e.initialValue && Array.isArray(e.initialValue) ? this.multiple ? i = e.initialValue : i = e.initialValue.slice(0, 1) : !this.multiple && this.options.length > 0 && (i = [this.options[0].value]), i)
      for (const s of i) {
        const n = t2.findIndex((o) => o.value === s);
        n !== -1 && (this.toggleSelected(s), this.#e = n);
      }
    this.focusedValue = this.options[this.#e]?.value, this.on("key", (s, n) => this.#l(s, n)), this.on("userInput", (s) => this.#u(s));
  }
  _isActionKey(e, t2) {
    return e === "\t" || this.multiple && this.isNavigating && t2.name === "space" && e !== undefined && e !== "";
  }
  #l(e, t2) {
    const i = t2.name === "up", s = t2.name === "down", n = t2.name === "return", o = this.userInput === "" || this.userInput === "\t", u = this.#n, h = this.options, f = u !== undefined && u !== "" && h.some((r) => !r.disabled && (this.#t ? this.#t(u, r) : true));
    if (t2.name === "tab" && o && f) {
      this.userInput === "\t" && this._clearUserInput(), this._setUserInput(u, true), this.isNavigating = false;
      return;
    }
    i || s ? (this.#e = findCursor(this.#e, i ? -1 : 1, this.filteredOptions), this.focusedValue = this.filteredOptions[this.#e]?.value, this.multiple || (this.selectedValues = [this.focusedValue]), this.isNavigating = true) : n ? this.value = m(this.multiple, this.selectedValues) : this.multiple ? this.focusedValue !== undefined && (t2.name === "tab" || this.isNavigating && t2.name === "space") ? this.toggleSelected(this.focusedValue) : this.isNavigating = false : (this.focusedValue && (this.selectedValues = [this.focusedValue]), this.isNavigating = false);
  }
  deselectAll() {
    this.selectedValues = [];
  }
  toggleSelected(e) {
    this.filteredOptions.length !== 0 && (this.multiple ? this.selectedValues.includes(e) ? this.selectedValues = this.selectedValues.filter((t2) => t2 !== e) : this.selectedValues = [...this.selectedValues, e] : this.selectedValues = [e]);
  }
  #u(e) {
    if (e !== this.#s) {
      this.#s = e;
      const t2 = this.options;
      e && this.#t ? this.filteredOptions = t2.filter((n) => this.#t?.(e, n)) : this.filteredOptions = [...t2];
      const i = p$1(this.focusedValue, this.filteredOptions);
      this.#e = findCursor(i, 0, this.filteredOptions);
      const s = this.filteredOptions[this.#e];
      s && !s.disabled ? this.focusedValue = s.value : this.focusedValue = undefined, this.multiple || (this.focusedValue !== undefined ? this.toggleSelected(this.focusedValue) : this.deselectAll());
    }
  }
};
var _ = {
  Y: { type: "year", len: 4 },
  M: { type: "month", len: 2 },
  D: { type: "day", len: 2 }
};
function M(r) {
  return [...r].map((t2) => _[t2]);
}
function P(r) {
  const i = new Intl.DateTimeFormat(r, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(2000, 0, 15)), s = [];
  let n = "/";
  for (const e of i)
    e.type === "literal" ? n = e.value.trim() || e.value : (e.type === "year" || e.type === "month" || e.type === "day") && s.push({ type: e.type, len: e.type === "year" ? 4 : 2 });
  return { segments: s, separator: n };
}
function p(r) {
  return Number.parseInt((r || "0").replace(/_/g, "0"), 10) || 0;
}
function f(r) {
  return {
    year: p(r.year),
    month: p(r.month),
    day: p(r.day)
  };
}
function c(r, t2) {
  return new Date(r || 2001, t2 || 1, 0).getDate();
}
function b(r) {
  const { year: t2, month: i, day: s } = f(r);
  if (!t2 || t2 < 0 || t2 > 9999 || !i || i < 1 || i > 12 || !s || s < 1)
    return;
  const n = new Date(Date.UTC(t2, i - 1, s));
  if (!(n.getUTCFullYear() !== t2 || n.getUTCMonth() !== i - 1 || n.getUTCDate() !== s))
    return { year: t2, month: i, day: s };
}
function C(r) {
  const t2 = b(r);
  return t2 ? new Date(Date.UTC(t2.year, t2.month - 1, t2.day)) : undefined;
}
function T2(r, t2, i, s) {
  const n = i ? {
    year: i.getUTCFullYear(),
    month: i.getUTCMonth() + 1,
    day: i.getUTCDate()
  } : null, e = s ? {
    year: s.getUTCFullYear(),
    month: s.getUTCMonth() + 1,
    day: s.getUTCDate()
  } : null;
  return r === "year" ? { min: n?.year ?? 1, max: e?.year ?? 9999 } : r === "month" ? {
    min: n && t2.year === n.year ? n.month : 1,
    max: e && t2.year === e.year ? e.month : 12
  } : {
    min: n && t2.year === n.year && t2.month === n.month ? n.day : 1,
    max: e && t2.year === e.year && t2.month === e.month ? e.day : c(t2.year, t2.month)
  };
}

class U extends V {
  #i;
  #o;
  #t;
  #h;
  #u;
  #e = { segmentIndex: 0, positionInSegment: 0 };
  #n = true;
  #s = null;
  inlineError = "";
  get segmentCursor() {
    return { ...this.#e };
  }
  get segmentValues() {
    return { ...this.#t };
  }
  get segments() {
    return this.#i;
  }
  get separator() {
    return this.#o;
  }
  get formattedValue() {
    return this.#l(this.#t);
  }
  #l(t2) {
    return this.#i.map((i) => t2[i.type]).join(this.#o);
  }
  #r() {
    this._setUserInput(this.#l(this.#t)), this._setValue(C(this.#t) ?? undefined);
  }
  constructor(t2) {
    const i = t2.format ? { segments: M(t2.format), separator: t2.separator ?? "/" } : P(t2.locale), s = t2.separator ?? i.separator, n = t2.format ? M(t2.format) : i.segments, e = t2.initialValue ?? t2.defaultValue, m2 = e ? {
      year: String(e.getUTCFullYear()).padStart(4, "0"),
      month: String(e.getUTCMonth() + 1).padStart(2, "0"),
      day: String(e.getUTCDate()).padStart(2, "0")
    } : { year: "____", month: "__", day: "__" }, o = n.map((a) => m2[a.type]).join(s);
    super({ ...t2, initialUserInput: o }, false), this.#i = n, this.#o = s, this.#t = m2, this.#h = t2.minDate, this.#u = t2.maxDate, this.#r(), this.on("cursor", (a) => this.#f(a)), this.on("key", (a, u) => this.#y(a, u)), this.on("finalize", () => this.#p(t2));
  }
  #a() {
    const t2 = Math.max(0, Math.min(this.#e.segmentIndex, this.#i.length - 1)), i = this.#i[t2];
    if (i)
      return this.#e.positionInSegment = Math.max(0, Math.min(this.#e.positionInSegment, i.len - 1)), { segment: i, index: t2 };
  }
  #m(t2) {
    this.inlineError = "", this.#s = null;
    const i = this.#a();
    i && (this.#e.segmentIndex = Math.max(0, Math.min(this.#i.length - 1, i.index + t2)), this.#e.positionInSegment = 0, this.#n = true);
  }
  #d(t2) {
    const i = this.#a();
    if (!i)
      return;
    const { segment: s } = i, n = this.#t[s.type], e = !n || n.replace(/_/g, "") === "", m2 = Number.parseInt((n || "0").replace(/_/g, "0"), 10) || 0, o = T2(s.type, f(this.#t), this.#h, this.#u);
    let a;
    e ? a = t2 === 1 ? o.min : o.max : a = Math.max(Math.min(o.max, m2 + t2), o.min), this.#t = {
      ...this.#t,
      [s.type]: a.toString().padStart(s.len, "0")
    }, this.#n = true, this.#s = null, this.#r();
  }
  #f(t2) {
    if (t2)
      switch (t2) {
        case "right":
          return this.#m(1);
        case "left":
          return this.#m(-1);
        case "up":
          return this.#d(1);
        case "down":
          return this.#d(-1);
      }
  }
  #y(t2, i) {
    if (i?.name === "backspace" || i?.sequence === "\x7F" || i?.sequence === "\b" || t2 === "\x7F" || t2 === "\b") {
      this.inlineError = "";
      const n = this.#a();
      if (!n)
        return;
      if (!this.#t[n.segment.type].replace(/_/g, "")) {
        this.#m(-1);
        return;
      }
      this.#t[n.segment.type] = "_".repeat(n.segment.len), this.#n = true, this.#e.positionInSegment = 0, this.#r();
      return;
    }
    if (i?.name === "tab") {
      this.inlineError = "";
      const n = this.#a();
      if (!n)
        return;
      const e = i.shift ? -1 : 1, m2 = n.index + e;
      m2 >= 0 && m2 < this.#i.length && (this.#e.segmentIndex = m2, this.#e.positionInSegment = 0, this.#n = true);
      return;
    }
    if (t2 && /^[0-9]$/.test(t2)) {
      const n = this.#a();
      if (!n)
        return;
      const { segment: e } = n, m2 = !this.#t[e.type].replace(/_/g, "");
      if (this.#n && this.#s !== null && !m2) {
        const h = this.#s + t2, d = { ...this.#t, [e.type]: h }, g2 = this.#g(d, e);
        if (g2) {
          this.inlineError = g2, this.#s = null, this.#n = false;
          return;
        }
        this.inlineError = "", this.#t[e.type] = h, this.#s = null, this.#n = false, this.#r(), n.index < this.#i.length - 1 && (this.#e.segmentIndex = n.index + 1, this.#e.positionInSegment = 0, this.#n = true);
        return;
      }
      this.#n && !m2 && (this.#t[e.type] = "_".repeat(e.len), this.#e.positionInSegment = 0), this.#n = false, this.#s = null;
      const o = this.#t[e.type], a = o.indexOf("_"), u = a >= 0 ? a : Math.min(this.#e.positionInSegment, e.len - 1);
      if (u < 0 || u >= e.len)
        return;
      let l2 = o.slice(0, u) + t2 + o.slice(u + 1), D = false;
      if (u === 0 && o === "__" && (e.type === "month" || e.type === "day")) {
        const h = Number.parseInt(t2, 10);
        l2 = `0${t2}`, D = h <= (e.type === "month" ? 1 : 2);
      }
      if (e.type === "year" && (l2 = (o.replace(/_/g, "") + t2).padStart(e.len, "_")), !l2.includes("_")) {
        const h = { ...this.#t, [e.type]: l2 }, d = this.#g(h, e);
        if (d) {
          this.inlineError = d;
          return;
        }
      }
      this.inlineError = "", this.#t[e.type] = l2;
      const y = l2.includes("_") ? undefined : b(this.#t);
      if (y) {
        const { year: h, month: d } = y, g2 = c(h, d);
        this.#t = {
          year: String(Math.max(0, Math.min(9999, h))).padStart(4, "0"),
          month: String(Math.max(1, Math.min(12, d))).padStart(2, "0"),
          day: String(Math.max(1, Math.min(g2, y.day))).padStart(2, "0")
        };
      }
      this.#r();
      const S = l2.indexOf("_");
      D ? (this.#n = true, this.#s = t2) : S >= 0 ? this.#e.positionInSegment = S : a >= 0 && n.index < this.#i.length - 1 ? (this.#e.segmentIndex = n.index + 1, this.#e.positionInSegment = 0, this.#n = true) : this.#e.positionInSegment = Math.min(u + 1, e.len - 1);
    }
  }
  #g(t2, i) {
    const { month: s, day: n } = f(t2);
    if (i.type === "month" && (s < 0 || s > 12))
      return settings.date.messages.invalidMonth;
    if (i.type === "day" && (n < 0 || n > 31))
      return settings.date.messages.invalidDay(31, "any month");
  }
  #p(t2) {
    const { year: i, month: s, day: n } = f(this.#t);
    if (i && s && n) {
      const e = c(i, s);
      this.#t = {
        ...this.#t,
        day: String(Math.min(n, e)).padStart(2, "0")
      };
    }
    this.value = C(this.#t) ?? t2.defaultValue ?? undefined;
  }
}
var u$1 = class u extends V {
  options;
  cursor = 0;
  #t;
  getGroupItems(t2) {
    return this.options.filter((r) => r.group === t2);
  }
  isGroupSelected(t2) {
    const r = this.getGroupItems(t2), e = this.value;
    return e === undefined ? false : r.every((s) => e.includes(s.value));
  }
  toggleValue() {
    const t2 = this.options[this.cursor];
    if (this.value === undefined && (this.value = []), t2.group === true) {
      const r = t2.value, e = this.getGroupItems(r);
      this.isGroupSelected(r) ? this.value = this.value.filter((s) => e.findIndex((i) => i.value === s) === -1) : this.value = [...this.value, ...e.map((s) => s.value)], this.value = Array.from(new Set(this.value));
    } else {
      const r = this.value.includes(t2.value);
      this.value = r ? this.value.filter((e) => e !== t2.value) : [...this.value, t2.value];
    }
  }
  constructor(t2) {
    super(t2, false);
    const { options: r } = t2;
    this.#t = t2.selectableGroups !== false, this.options = Object.entries(r).flatMap(([e, s]) => [
      { value: e, group: true, label: e },
      ...s.map((i) => ({ ...i, group: e }))
    ]), this.value = [...t2.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: e }) => e === t2.cursorAt), this.#t ? 0 : 1), this.on("cursor", (e) => {
      switch (e) {
        case "left":
        case "up": {
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          const s = this.options[this.cursor]?.group === true;
          !this.#t && s && (this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1);
          break;
        }
        case "down":
        case "right": {
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          const s = this.options[this.cursor]?.group === true;
          !this.#t && s && (this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1);
          break;
        }
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
};
var o$1 = /* @__PURE__ */ new Set(["up", "down", "left", "right"]);

class h extends V {
  #s = false;
  #t;
  focused = "editor";
  get userInputWithCursor() {
    if (this.state === "submit")
      return this.userInput;
    const t2 = this.userInput;
    if (this.cursor >= t2.length)
      return `${t2}\u2588`;
    const s = t2.slice(0, this.cursor), r = t2[this.cursor], e = t2.slice(this.cursor + 1);
    return r === `
` ? `${s}\u2588
${e}` : `${s}${styleText("inverse", r)}${e}`;
  }
  get cursor() {
    return this._cursor;
  }
  #r(t2) {
    if (this.userInput.length === 0) {
      this._setUserInput(t2);
      return;
    }
    this._setUserInput(this.userInput.slice(0, this.cursor) + t2 + this.userInput.slice(this.cursor));
  }
  #i(t2) {
    const s = this.value ?? "";
    switch (t2) {
      case "up":
        this._cursor = findTextCursor(this._cursor, 0, -1, s);
        return;
      case "down":
        this._cursor = findTextCursor(this._cursor, 0, 1, s);
        return;
      case "left":
        this._cursor = findTextCursor(this._cursor, -1, 0, s);
        return;
      case "right":
        this._cursor = findTextCursor(this._cursor, 1, 0, s);
        return;
    }
  }
  _shouldSubmit(t2, s) {
    if (this.#t)
      return this.focused === "submit" ? true : (this.#r(`
`), this._cursor++, false);
    const r = this.#s;
    return this.#s = true, r ? (this.userInput[this.cursor - 1] === `
` && (this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--), true) : (this.#r(`
`), this._cursor++, false);
  }
  constructor(t2) {
    super(t2, false), this.#t = t2.showSubmit ?? false, this.on("key", (s, r) => {
      if (r?.name && o$1.has(r.name)) {
        this.#i(r.name);
        return;
      }
      if (s === "\t" && this.#t) {
        this.focused = this.focused === "editor" ? "submit" : "editor";
        return;
      }
      if (r?.name !== "return") {
        if (this.#s = false, r?.name === "backspace" && this.cursor > 0) {
          this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--;
          return;
        }
        if (r?.name === "delete" && this.cursor < this.userInput.length) {
          this._setUserInput(this.userInput.slice(0, this.cursor) + this.userInput.slice(this.cursor + 1));
          return;
        }
        s && (this.#t && this.focused === "submit" && (this.focused = "editor"), this.#r(s ?? ""), this._cursor++);
      }
    }), this.on("userInput", (s) => {
      this._setValue(s);
    }), this.on("finalize", () => {
      this.value || (this.value = t2.defaultValue), this.value === undefined && (this.value = "");
    });
  }
}
var a$1 = class a extends V {
  options;
  cursor = 0;
  get _value() {
    return this.options[this.cursor].value;
  }
  get _enabledOptions() {
    return this.options.filter((e) => e.disabled !== true);
  }
  toggleAll() {
    const e = this._enabledOptions, i = this.value !== undefined && this.value.length === e.length;
    this.value = i ? [] : e.map((t2) => t2.value);
  }
  toggleInvert() {
    const e = this.value;
    if (!e)
      return;
    const i = this._enabledOptions.filter((t2) => !e.includes(t2.value));
    this.value = i.map((t2) => t2.value);
  }
  toggleValue() {
    this.value === undefined && (this.value = []);
    const e = this.value.includes(this._value);
    this.value = e ? this.value.filter((i) => i !== this._value) : [...this.value, this._value];
  }
  constructor(e) {
    super(e, false), this.options = e.options, this.value = [...e.initialValues ?? []];
    const i = Math.max(this.options.findIndex(({ value: t2 }) => t2 === e.cursorAt), 0);
    this.cursor = this.options[i].disabled ? findCursor(i, 1, this.options) : i, this.on("key", (t2, l2) => {
      l2.name === "a" && this.toggleAll(), l2.name === "i" && this.toggleInvert();
    }), this.on("cursor", (t2) => {
      switch (t2) {
        case "left":
        case "up":
          this.cursor = findCursor(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = findCursor(this.cursor, 1, this.options);
          break;
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
};
class a2 extends V {
  options;
  cursor = 0;
  get _selectedValue() {
    return this.options[this.cursor];
  }
  changeValue() {
    this.value = this._selectedValue.value;
  }
  constructor(t2) {
    super(t2, false), this.options = t2.options;
    const i = this.options.findIndex(({ value: s }) => s === t2.initialValue), e = i === -1 ? 0 : i;
    this.cursor = this.options[e].disabled ? findCursor(e, 1, this.options) : e, this.changeValue(), this.on("cursor", (s) => {
      switch (s) {
        case "left":
        case "up":
          this.cursor = findCursor(this.cursor, -1, this.options);
          break;
        case "down":
        case "right":
          this.cursor = findCursor(this.cursor, 1, this.options);
          break;
      }
      this.changeValue();
    });
  }
}
class n extends V {
  get userInputWithCursor() {
    if (this.state === "submit")
      return this.userInput;
    const t2 = this.userInput;
    if (this.cursor >= t2.length)
      return `${this.userInput}\u2588`;
    const e = t2.slice(0, this.cursor), [s, ...r] = t2.slice(this.cursor);
    return `${e}${styleText("inverse", s)}${r.join("")}`;
  }
  get cursor() {
    return this._cursor;
  }
  constructor(t2) {
    super({
      ...t2,
      initialUserInput: t2.initialUserInput ?? t2.initialValue
    }), this.on("userInput", (e) => {
      this._setValue(e);
    }), this.on("finalize", () => {
      this.value || (this.value = t2.defaultValue), this.value === undefined && (this.value = "");
    });
  }
}

// node_modules/@clack/prompts/dist/index.mjs
import { styleText as styleText2, stripVTControlCharacters } from "util";
import process$1 from "process";
var import_sisteransi2 = __toESM(require_src(), 1);
function isUnicodeSupported() {
  if (process$1.platform !== "win32") {
    return process$1.env.TERM !== "linux";
  }
  return Boolean(process$1.env.CI) || Boolean(process$1.env.WT_SESSION) || Boolean(process$1.env.TERMINUS_SUBLIME) || process$1.env.ConEmuTask === "{cmd::Cmder}" || process$1.env.TERM_PROGRAM === "Terminus-Sublime" || process$1.env.TERM_PROGRAM === "vscode" || process$1.env.TERM === "xterm-256color" || process$1.env.TERM === "alacritty" || process$1.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var unicode = isUnicodeSupported();
var isCI = () => process.env.CI === "true";
var unicodeOr = (e, o2) => unicode ? e : o2;
var S_STEP_ACTIVE = unicodeOr("\u25C6", "*");
var S_STEP_CANCEL = unicodeOr("\u25A0", "x");
var S_STEP_ERROR = unicodeOr("\u25B2", "x");
var S_STEP_SUBMIT = unicodeOr("\u25C7", "o");
var S_BAR_START = unicodeOr("\u250C", "T");
var S_BAR = unicodeOr("\u2502", "|");
var S_BAR_END = unicodeOr("\u2514", "\u2014");
var S_BAR_START_RIGHT = unicodeOr("\u2510", "T");
var S_BAR_END_RIGHT = unicodeOr("\u2518", "\u2014");
var S_RADIO_ACTIVE = unicodeOr("\u25CF", ">");
var S_RADIO_INACTIVE = unicodeOr("\u25CB", " ");
var S_CHECKBOX_ACTIVE = unicodeOr("\u25FB", "[\u2022]");
var S_CHECKBOX_SELECTED = unicodeOr("\u25FC", "[+]");
var S_CHECKBOX_INACTIVE = unicodeOr("\u25FB", "[ ]");
var S_PASSWORD_MASK = unicodeOr("\u25AA", "\u2022");
var S_BAR_H = unicodeOr("\u2500", "-");
var S_CORNER_TOP_RIGHT = unicodeOr("\u256E", "+");
var S_CONNECT_LEFT = unicodeOr("\u251C", "+");
var S_CORNER_BOTTOM_RIGHT = unicodeOr("\u256F", "+");
var S_CORNER_BOTTOM_LEFT = unicodeOr("\u2570", "+");
var S_CORNER_TOP_LEFT = unicodeOr("\u256D", "+");
var S_INFO = unicodeOr("\u25CF", "\u2022");
var S_SUCCESS = unicodeOr("\u25C6", "*");
var S_WARN = unicodeOr("\u25B2", "!");
var S_ERROR = unicodeOr("\u25A0", "x");
var symbol = (e) => {
  switch (e) {
    case "initial":
    case "active":
      return styleText2("cyan", S_STEP_ACTIVE);
    case "cancel":
      return styleText2("red", S_STEP_CANCEL);
    case "error":
      return styleText2("yellow", S_STEP_ERROR);
    case "submit":
      return styleText2("green", S_STEP_SUBMIT);
  }
};
var symbolBar = (e) => {
  switch (e) {
    case "initial":
    case "active":
      return styleText2("cyan", S_BAR);
    case "cancel":
      return styleText2("red", S_BAR);
    case "error":
      return styleText2("yellow", S_BAR);
    case "submit":
      return styleText2("green", S_BAR);
  }
};
var E$1 = (l2, o2, g2, c2, h2, O = false) => {
  let r2 = o2, w = 0;
  if (O)
    for (let i = c2 - 1;i >= g2 && (r2 -= l2[i].length, w++, !(r2 <= h2)); i--)
      ;
  else
    for (let i = g2;i < c2 && (r2 -= l2[i].length, w++, !(r2 <= h2)); i++)
      ;
  return { lineCount: r2, removals: w };
};
var limitOptions = ({
  cursor: l2,
  options: o2,
  style: g2,
  output: c2 = process.stdout,
  maxItems: h2 = Number.POSITIVE_INFINITY,
  columnPadding: O = 0,
  rowPadding: r2 = 4
}) => {
  const i = getColumns(c2) - O, I = getRows(c2), C2 = styleText2("dim", "..."), x = Math.max(I - r2, 0), m2 = Math.max(Math.min(h2, x), 5);
  let p2 = 0;
  l2 >= m2 - 3 && (p2 = Math.max(Math.min(l2 - m2 + 3, o2.length - m2), 0));
  let f2 = m2 < o2.length && p2 > 0, u3 = m2 < o2.length && p2 + m2 < o2.length;
  const W = Math.min(p2 + m2, o2.length), e = [];
  let d = 0;
  f2 && d++, u3 && d++;
  const v = p2 + (f2 ? 1 : 0), P2 = W - (u3 ? 1 : 0);
  for (let t2 = v;t2 < P2; t2++) {
    const n2 = wrapAnsi(g2(o2[t2], t2 === l2), i, {
      hard: true,
      trim: false
    }).split(`
`);
    e.push(n2), d += n2.length;
  }
  if (d > x) {
    let t2 = 0, n2 = 0, s = d;
    const M2 = l2 - v;
    let a3 = x;
    const T3 = () => E$1(e, s, 0, M2, a3), L = () => E$1(e, s, M2 + 1, e.length, a3, true);
    f2 ? ({ lineCount: s, removals: t2 } = T3(), s > a3 && (u3 || (a3 -= 1), { lineCount: s, removals: n2 } = L())) : (u3 || (a3 -= 1), { lineCount: s, removals: n2 } = L(), s > a3 && (a3 -= 1, { lineCount: s, removals: t2 } = T3())), t2 > 0 && (f2 = true, e.splice(0, t2)), n2 > 0 && (u3 = true, e.splice(e.length - n2, n2));
  }
  const b2 = [];
  f2 && b2.push(C2);
  for (const t2 of e)
    for (const n2 of t2)
      b2.push(n2);
  return u3 && b2.push(C2), b2;
};
var log = {
  message: (s = [], {
    symbol: e = styleText2("gray", S_BAR),
    secondarySymbol: r2 = styleText2("gray", S_BAR),
    output: m2 = process.stdout,
    spacing: l2 = 1,
    withGuide: c2
  } = {}) => {
    const t2 = [], o2 = c2 ?? settings.withGuide, f2 = o2 ? r2 : "", O = o2 ? `${e}  ` : "", u3 = o2 ? `${r2}  ` : "";
    for (let i = 0;i < l2; i++)
      t2.push(f2);
    const g2 = Array.isArray(s) ? s : s.split(`
`);
    if (g2.length > 0) {
      const [i, ...y] = g2;
      i.length > 0 ? t2.push(`${O}${i}`) : t2.push(o2 ? e : "");
      for (const p2 of y)
        p2.length > 0 ? t2.push(`${u3}${p2}`) : t2.push(o2 ? r2 : "");
    }
    m2.write(`${t2.join(`
`)}
`);
  },
  info: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("blue", S_INFO) });
  },
  success: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_SUCCESS) });
  },
  step: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_STEP_SUBMIT) });
  },
  warn: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("yellow", S_WARN) });
  },
  warning: (s, e) => {
    log.warn(s, e);
  },
  error: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("red", S_ERROR) });
  }
};
var cancel = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR_END)}  ` : "";
  i.write(`${e}${styleText2("red", o2)}

`);
};
var intro = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR_START)}  ` : "";
  i.write(`${e}${o2}
`);
};
var outro = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR)}
${styleText2("gray", S_BAR_END)}  ` : "";
  i.write(`${e}${o2}

`);
};
var d = (n2, a3) => n2.split(`
`).map((m2) => a3(m2)).join(`
`);
var multiselect = (n2) => {
  const a3 = (t2, o2) => {
    const r2 = t2.label ?? String(t2.value);
    return o2 === "disabled" ? `${styleText2("gray", S_CHECKBOX_INACTIVE)} ${d(r2, (l2) => styleText2(["strikethrough", "gray"], l2))}${t2.hint ? ` ${styleText2("dim", `(${t2.hint ?? "disabled"})`)}` : ""}` : o2 === "active" ? `${styleText2("cyan", S_CHECKBOX_ACTIVE)} ${r2}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : o2 === "selected" ? `${styleText2("green", S_CHECKBOX_SELECTED)} ${d(r2, (l2) => styleText2("dim", l2))}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : o2 === "cancelled" ? `${d(r2, (l2) => styleText2(["strikethrough", "dim"], l2))}` : o2 === "active-selected" ? `${styleText2("green", S_CHECKBOX_SELECTED)} ${r2}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}` : o2 === "submitted" ? `${d(r2, (l2) => styleText2("dim", l2))}` : `${styleText2("dim", S_CHECKBOX_INACTIVE)} ${d(r2, (l2) => styleText2("dim", l2))}`;
  }, m2 = n2.required ?? true;
  return new a$1({
    options: n2.options,
    signal: n2.signal,
    input: n2.input,
    output: n2.output,
    initialValues: n2.initialValues,
    required: m2,
    cursorAt: n2.cursorAt,
    validate(t2) {
      if (m2 && (t2 === undefined || t2.length === 0))
        return `Please select at least one option.
${styleText2("reset", styleText2("dim", `Press ${styleText2(["gray", "bgWhite", "inverse"], " space ")} to select, ${styleText2("gray", styleText2("bgWhite", styleText2("inverse", " enter ")))} to submit`))}`;
    },
    render() {
      const t2 = n2.withGuide ?? settings.withGuide, o2 = wrapTextWithPrefix(n2.output, n2.message, t2 ? `${symbolBar(this.state)}  ` : "", `${symbol(this.state)}  `), r2 = `${t2 ? `${styleText2("gray", S_BAR)}
` : ""}${o2}
`, l2 = this.value ?? [], g2 = (i, u3) => {
        if (i.disabled)
          return a3(i, "disabled");
        const s = l2.includes(i.value);
        return u3 && s ? a3(i, "active-selected") : s ? a3(i, "selected") : a3(i, u3 ? "active" : "inactive");
      };
      switch (this.state) {
        case "submit": {
          const i = this.options.filter(({ value: s }) => l2.includes(s)).map((s) => a3(s, "submitted")).join(styleText2("dim", ", ")) || styleText2("dim", "none"), u3 = wrapTextWithPrefix(n2.output, i, t2 ? `${styleText2("gray", S_BAR)}  ` : "");
          return `${r2}${u3}`;
        }
        case "cancel": {
          const i = this.options.filter(({ value: s }) => l2.includes(s)).map((s) => a3(s, "cancelled")).join(styleText2("dim", ", "));
          if (i.trim() === "")
            return `${r2}${styleText2("gray", S_BAR)}`;
          const u3 = wrapTextWithPrefix(n2.output, i, t2 ? `${styleText2("gray", S_BAR)}  ` : "");
          return `${r2}${u3}${t2 ? `
${styleText2("gray", S_BAR)}` : ""}`;
        }
        case "error": {
          const i = t2 ? `${styleText2("yellow", S_BAR)}  ` : "", u3 = this.error.split(`
`).map((h2, x) => x === 0 ? `${t2 ? `${styleText2("yellow", S_BAR_END)}  ` : ""}${styleText2("yellow", h2)}` : `   ${h2}`).join(`
`), s = r2.split(`
`).length, v = u3.split(`
`).length + 1;
          return `${r2}${i}${limitOptions({
            output: n2.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: n2.maxItems,
            columnPadding: i.length,
            rowPadding: s + v,
            style: g2
          }).join(`
${i}`)}
${u3}
`;
        }
        default: {
          const i = t2 ? `${styleText2("cyan", S_BAR)}  ` : "", u3 = r2.split(`
`).length, s = t2 ? 2 : 1;
          return `${r2}${i}${limitOptions({
            output: n2.output,
            options: this.options,
            cursor: this.cursor,
            maxItems: n2.maxItems,
            columnPadding: i.length,
            rowPadding: u3 + s,
            style: g2
          }).join(`
${i}`)}
${t2 ? styleText2("cyan", S_BAR_END) : ""}
`;
        }
      }
    }
  }).prompt();
};
var W = (l2) => styleText2("magenta", l2);
var spinner = ({
  indicator: l2 = "dots",
  onCancel: h2,
  output: n2 = process.stdout,
  cancelMessage: G,
  errorMessage: O,
  frames: E = unicode ? ["\u25D2", "\u25D0", "\u25D3", "\u25D1"] : ["\u2022", "o", "O", "0"],
  delay: F = unicode ? 80 : 120,
  signal: m2,
  ...I
} = {}) => {
  const u3 = isCI();
  let M2, T3, d2 = false, S = false, s = "", p2, w = performance.now();
  const x = getColumns(n2), k = I?.styleFrame ?? W, g2 = (e) => {
    const r2 = e > 1 ? O ?? settings.messages.error : G ?? settings.messages.cancel;
    S = e === 1, d2 && (a3(r2, e), S && typeof h2 == "function" && h2());
  }, f2 = () => g2(2), i = () => g2(1), A = () => {
    process.on("uncaughtExceptionMonitor", f2), process.on("unhandledRejection", f2), process.on("SIGINT", i), process.on("SIGTERM", i), process.on("exit", g2), m2 && m2.addEventListener("abort", i);
  }, H = () => {
    process.removeListener("uncaughtExceptionMonitor", f2), process.removeListener("unhandledRejection", f2), process.removeListener("SIGINT", i), process.removeListener("SIGTERM", i), process.removeListener("exit", g2), m2 && m2.removeEventListener("abort", i);
  }, y = () => {
    if (p2 === undefined)
      return;
    u3 && n2.write(`
`);
    const r2 = wrapAnsi(p2, x, {
      hard: true,
      trim: false
    }).split(`
`);
    r2.length > 1 && n2.write(import_sisteransi2.cursor.up(r2.length - 1)), n2.write(import_sisteransi2.cursor.to(0)), n2.write(import_sisteransi2.erase.down());
  }, C2 = (e) => e.replace(/\.+$/, ""), _2 = (e) => {
    const r2 = (performance.now() - e) / 1000, t2 = Math.floor(r2 / 60), o2 = Math.floor(r2 % 60);
    return t2 > 0 ? `[${t2}m ${o2}s]` : `[${o2}s]`;
  }, N = I.withGuide ?? settings.withGuide, P2 = (e = "") => {
    d2 = true, M2 = block({ output: n2 }), s = C2(e), w = performance.now(), N && n2.write(`${styleText2("gray", S_BAR)}
`);
    let r2 = 0, t2 = 0;
    A(), T3 = setInterval(() => {
      if (u3 && s === p2)
        return;
      y(), p2 = s;
      const o2 = k(E[r2]);
      let v;
      if (u3)
        v = `${o2}  ${s}...`;
      else if (l2 === "timer")
        v = `${o2}  ${s} ${_2(w)}`;
      else {
        const B = ".".repeat(Math.floor(t2)).slice(0, 3);
        v = `${o2}  ${s}${B}`;
      }
      const j = wrapAnsi(v, x, {
        hard: true,
        trim: false
      });
      n2.write(j), r2 = r2 + 1 < E.length ? r2 + 1 : 0, t2 = t2 < 4 ? t2 + 0.125 : 0;
    }, F);
  }, a3 = (e = "", r2 = 0, t2 = false) => {
    if (!d2)
      return;
    d2 = false, clearInterval(T3), y();
    const o2 = r2 === 0 ? styleText2("green", S_STEP_SUBMIT) : r2 === 1 ? styleText2("red", S_STEP_CANCEL) : styleText2("red", S_STEP_ERROR);
    s = e ?? s, t2 || (l2 === "timer" ? n2.write(`${o2}  ${s} ${_2(w)}
`) : n2.write(`${o2}  ${s}
`)), H(), M2();
  };
  return {
    start: P2,
    stop: (e = "") => a3(e, 0),
    message: (e = "") => {
      s = C2(e ?? s);
    },
    cancel: (e = "") => a3(e, 1),
    error: (e = "") => a3(e, 2),
    clear: () => a3("", 0, true),
    get isCancelled() {
      return S;
    }
  };
};
var u3 = {
  light: unicodeOr("\u2500", "-"),
  heavy: unicodeOr("\u2501", "="),
  block: unicodeOr("\u2588", "#")
};
var c2 = (e, a3) => e.includes(`
`) ? e.split(`
`).map((t2) => a3(t2)).join(`
`) : a3(e);
var select = (e) => {
  const a3 = (t2, d2) => {
    const s = t2.label ?? String(t2.value);
    switch (d2) {
      case "disabled":
        return `${styleText2("gray", S_RADIO_INACTIVE)} ${c2(s, (n2) => styleText2("gray", n2))}${t2.hint ? ` ${styleText2("dim", `(${t2.hint ?? "disabled"})`)}` : ""}`;
      case "selected":
        return `${c2(s, (n2) => styleText2("dim", n2))}`;
      case "active":
        return `${styleText2("green", S_RADIO_ACTIVE)} ${s}${t2.hint ? ` ${styleText2("dim", `(${t2.hint})`)}` : ""}`;
      case "cancelled":
        return `${c2(s, (n2) => styleText2(["strikethrough", "dim"], n2))}`;
      default:
        return `${styleText2("dim", S_RADIO_INACTIVE)} ${c2(s, (n2) => styleText2("dim", n2))}`;
    }
  };
  return new a2({
    options: e.options,
    signal: e.signal,
    input: e.input,
    output: e.output,
    initialValue: e.initialValue,
    render() {
      const t2 = e.withGuide ?? settings.withGuide, d2 = `${symbol(this.state)}  `, s = `${symbolBar(this.state)}  `, n2 = wrapTextWithPrefix(e.output, e.message, s, d2), u4 = `${t2 ? `${styleText2("gray", S_BAR)}
` : ""}${n2}
`;
      switch (this.state) {
        case "submit": {
          const r2 = t2 ? `${styleText2("gray", S_BAR)}  ` : "", l2 = wrapTextWithPrefix(e.output, a3(this.options[this.cursor], "selected"), r2);
          return `${u4}${l2}`;
        }
        case "cancel": {
          const r2 = t2 ? `${styleText2("gray", S_BAR)}  ` : "", l2 = wrapTextWithPrefix(e.output, a3(this.options[this.cursor], "cancelled"), r2);
          return `${u4}${l2}${t2 ? `
${styleText2("gray", S_BAR)}` : ""}`;
        }
        default: {
          const r2 = t2 ? `${styleText2("cyan", S_BAR)}  ` : "", l2 = t2 ? styleText2("cyan", S_BAR_END) : "", g2 = u4.split(`
`).length, h2 = t2 ? 2 : 1;
          return `${u4}${r2}${limitOptions({
            output: e.output,
            cursor: this.cursor,
            options: this.options,
            maxItems: e.maxItems,
            columnPadding: r2.length,
            rowPadding: g2 + h2,
            style: (p2, b2) => a3(p2, p2.disabled ? "disabled" : b2 ? "active" : "inactive")
          }).join(`
${r2}`)}
${l2}
`;
        }
      }
    }
  }).prompt();
};
var i = `${styleText2("gray", S_BAR)}  `;
var text = (t2) => new n({
  validate: t2.validate,
  placeholder: t2.placeholder,
  defaultValue: t2.defaultValue,
  initialValue: t2.initialValue,
  output: t2.output,
  signal: t2.signal,
  input: t2.input,
  render() {
    const i2 = t2?.withGuide ?? settings.withGuide, s = `${`${i2 ? `${styleText2("gray", S_BAR)}
` : ""}${symbol(this.state)}  `}${t2.message}
`, c3 = t2.placeholder ? styleText2("inverse", t2.placeholder[0]) + styleText2("dim", t2.placeholder.slice(1)) : styleText2(["inverse", "hidden"], "_"), o2 = this.userInput ? this.userInputWithCursor : c3, a3 = this.value ?? "";
    switch (this.state) {
      case "error": {
        const n2 = this.error ? `  ${styleText2("yellow", this.error)}` : "", r2 = i2 ? `${styleText2("yellow", S_BAR)}  ` : "", d2 = i2 ? styleText2("yellow", S_BAR_END) : "";
        return `${s.trim()}
${r2}${o2}
${d2}${n2}
`;
      }
      case "submit": {
        const n2 = a3 ? `  ${styleText2("dim", a3)}` : "", r2 = i2 ? styleText2("gray", S_BAR) : "";
        return `${s}${r2}${n2}`;
      }
      case "cancel": {
        const n2 = a3 ? `  ${styleText2(["strikethrough", "dim"], a3)}` : "", r2 = i2 ? styleText2("gray", S_BAR) : "";
        return `${s}${r2}${n2}${a3.trim() ? `
${r2}` : ""}`;
      }
      default: {
        const n2 = i2 ? `${styleText2("cyan", S_BAR)}  ` : "", r2 = i2 ? styleText2("cyan", S_BAR_END) : "";
        return `${s}${n2}${o2}
${r2}
`;
      }
    }
  }
}).prompt();

// src/index.ts
import { spawn } from "child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "fs";
import { cp, readFile, rename, writeFile } from "fs/promises";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";
var hl = (s) => `\x1B[33m${s}\x1B[2m`;
function cancelIfCancelled(v) {
  if (isCancel(v)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  return v;
}
function run(args, cwd) {
  return new Promise((resolve2, reject) => {
    const proc = spawn(args[0], args.slice(1), {
      cwd,
      stdio: "inherit",
      shell: true
    });
    proc.on("close", (code) => resolve2(code ?? 0));
    proc.on("error", reject);
  });
}
async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf-8"));
}
async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}
`, "utf-8");
}
function listFiles(dir, base = dir) {
  const result = [];
  if (!existsSync(dir))
    return result;
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
function mergePackageJson(base, ...addons) {
  const result = { ...base };
  for (const addon of addons) {
    for (const key of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "scripts"
    ]) {
      if (addon[key])
        result[key] = { ...result[key] ?? {}, ...addon[key] };
    }
  }
  return result;
}
function deepMergeJson(target, source) {
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
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function validatePackageName(v) {
  if (!v?.trim())
    return "Package name is required";
  if (!/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(v.trim())) {
    return "Use lowercase + hyphens. Scoped: @org/name";
  }
}
async function readAddonMeta(addonDir) {
  const metaPath = join(addonDir, "addon.json");
  if (!existsSync(metaPath))
    return {};
  return readJson(metaPath);
}
async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      cwd: { type: "string" },
      "template-root": { type: "string" },
      rm: { type: "boolean", default: false },
      type: { type: "string" },
      lint: { type: "string" },
      addons: { type: "string" },
      dir: { type: "string" },
      "no-install": { type: "boolean", default: false }
    },
    allowPositionals: true
  });
  const noInstall = values["no-install"] === true;
  const cliType = values.type;
  const cliLint = values.lint;
  const cliAddons = values.addons;
  const cliDir = values.dir;
  const nonInteractive = cliType !== undefined || cliLint !== undefined || cliAddons !== undefined || cliDir !== undefined;
  const VALID_TYPES = ["lib", "app", "react-app"];
  if (cliType !== undefined && !VALID_TYPES.includes(cliType)) {
    cancel(`Invalid --type: ${cliType}. Valid: ${VALID_TYPES.join(", ")}`);
    process.exit(1);
  }
  const VALID_LINTS = ["none", "biome", "oxc"];
  if (cliLint !== undefined && !VALID_LINTS.includes(cliLint)) {
    cancel(`Invalid --lint: ${cliLint}. Valid: ${VALID_LINTS.join(", ")}`);
    process.exit(1);
  }
  const VALID_ADDONS = ["tsgo", "bunup", "tailwindcss", "tanstack-router"];
  let cliAddonList;
  if (cliAddons !== undefined) {
    cliAddonList = cliAddons.split(",").map((s2) => s2.trim()).filter(Boolean);
    for (const a3 of cliAddonList) {
      if (!VALID_ADDONS.includes(a3)) {
        cancel(`Invalid --addons value: ${a3}. Valid: ${VALID_ADDONS.join(", ")}`);
        process.exit(1);
      }
    }
  }
  const cwd = values.cwd ? resolve(values.cwd) : process.cwd();
  const packageRoot = values["template-root"] ? resolve(values["template-root"]) : resolve(fileURLToPath(import.meta.url), "..");
  intro("  create @meld-ts/bun  ");
  let packageName = positionals[0]?.trim() ?? "";
  if (!packageName) {
    packageName = cancelIfCancelled(await text({
      message: "Project name:",
      placeholder: "my-app  or  @org/my-lib",
      validate: validatePackageName
    }));
  }
  let dirName;
  if (packageName.startsWith("@")) {
    const slash = packageName.indexOf("/");
    const ns = packageName.slice(1, slash);
    const name = packageName.slice(slash + 1);
    const flatDir = `${ns}-${name}`;
    if (cliDir !== undefined) {
      dirName = cliDir;
    } else if (nonInteractive) {
      dirName = flatDir;
    } else {
      dirName = cancelIfCancelled(await select({
        message: "Directory name:",
        options: [
          {
            value: flatDir,
            label: flatDir,
            hint: "flat (recommended)"
          },
          {
            value: `${ns}/${name}`,
            label: `${ns}/${name}`,
            hint: "nested subfolder"
          }
        ]
      }));
    }
  } else {
    dirName = cliDir ?? packageName;
  }
  const targetDir = resolve(cwd, dirName);
  if (existsSync(targetDir)) {
    if (values.rm) {
      rmSync(targetDir, { recursive: true });
    } else {
      cancel(`"${dirName}" already exists. Pass --rm to overwrite.`);
      process.exit(1);
    }
  }
  const projectType = cliType ?? cancelIfCancelled(await select({
    message: "Project type:",
    options: [
      {
        value: "lib",
        label: "lib",
        hint: `${hl("declaration")} \xB7 .d.ts output \xB7 npm package`
      },
      {
        value: "app",
        label: "app",
        hint: `${hl("private: true")} \xB7 ${hl("noEmit")} \xB7 runs directly`
      },
      {
        value: "react-app",
        label: "react-app",
        hint: `${hl("index.html")} entry \xB7 ${hl("bun build")} \xB7 web SPA`
      }
    ]
  }));
  const isReactApp = projectType === "react-app";
  const lintTool = cliLint ?? cancelIfCancelled(await select({
    message: "Lint & format:",
    options: isReactApp ? [
      {
        value: "biome",
        label: "Biome",
        hint: "all-in-one linter + formatter"
      },
      {
        value: "oxc",
        label: "oxc",
        hint: "oxlint + oxfmt  (faster, 660+ rules)"
      }
    ] : [
      { value: "none", label: "None" },
      {
        value: "biome",
        label: "Biome",
        hint: "all-in-one linter + formatter"
      },
      {
        value: "oxc",
        label: "oxc",
        hint: "oxlint + oxfmt  (faster, 660+ rules)"
      }
    ]
  }));
  let extras = cliAddonList ?? [];
  if (cliAddonList !== undefined) {
    const validForType = isReactApp ? ["tsgo", "tailwindcss", "tanstack-router"] : ["tsgo", "bunup"];
    for (const a3 of cliAddonList) {
      if (!validForType.includes(a3)) {
        cancel(`Addon '${a3}' is not available for ${projectType}. Valid: ${validForType.join(", ")}`);
        process.exit(1);
      }
    }
  } else if (isReactApp) {
    extras = cancelIfCancelled(await multiselect({
      message: "Add-ons:  (space to toggle)",
      options: [
        {
          value: "tsgo",
          label: "tsgo",
          hint: "native TS compiler \u2014 faster ts-check"
        },
        {
          value: "tailwindcss",
          label: "tailwindcss",
          hint: "utility-first CSS (v4 + tailwindcss-bun-plugin)"
        },
        {
          value: "tanstack-router",
          label: "tanstack-router",
          hint: "file-based type-safe router"
        }
      ],
      required: false
    }));
  } else {
    extras = cancelIfCancelled(await multiselect({
      message: "Add-ons:  (space to toggle)",
      options: [
        {
          value: "tsgo",
          label: "tsgo",
          hint: "native TS compiler \u2014 faster ts-check"
        },
        {
          value: "bunup",
          label: "bunup",
          hint: "build tool for Bun libraries"
        }
      ],
      required: false
    }));
  }
  const addonNames = [
    ...lintTool !== "none" ? [lintTool] : [],
    ...extras
  ];
  const sortedAddons = [];
  for (const name of addonNames) {
    const meta = await readAddonMeta(join(packageRoot, "addons", name));
    sortedAddons.push({ name, meta });
  }
  sortedAddons.sort((a3, b2) => (a3.meta.order ?? 99) - (b2.meta.order ?? 99));
  const s = spinner();
  s.start("Scaffolding...");
  const parentDir = dirname(targetDir);
  if (!existsSync(parentDir))
    mkdirSync(parentDir, { recursive: true });
  const templateDir = isReactApp ? "template-react-app" : "template-bun";
  await cp(join(packageRoot, templateDir), targetDir, { recursive: true });
  await rename(join(targetDir, "_gitignore"), join(targetDir, ".gitignore")).catch(() => {});
  let pkg = await readJson(join(targetDir, "package.json"));
  pkg.name = packageName;
  if (projectType === "lib") {
    pkg.module = "./src/index.ts";
    pkg.types = "./src/index.ts";
    pkg.files = ["./dist"];
    const tsconfigPath = join(targetDir, "tsconfig.json");
    const tsconfig = await readJson(tsconfigPath);
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      declaration: true,
      isolatedDeclarations: true
    };
    await writeJson(tsconfigPath, tsconfig);
  } else {
    pkg.private = true;
  }
  for (const { name } of sortedAddons) {
    const addonPkgPath = join(packageRoot, "addons", name, "package.json");
    if (existsSync(addonPkgPath)) {
      pkg = mergePackageJson(pkg, await readJson(addonPkgPath));
    }
  }
  await writeJson(join(targetDir, "package.json"), pkg);
  for (const { name } of sortedAddons) {
    const addonDir = join(packageRoot, "addons", name);
    if (!existsSync(addonDir))
      continue;
    const mergeDir = join(addonDir, "merge");
    const templateDir2 = join(addonDir, "template");
    if (existsSync(mergeDir) || existsSync(templateDir2)) {
      if (existsSync(mergeDir)) {
        for (const file of listFiles(mergeDir)) {
          const targetPath = join(targetDir, file);
          if (!existsSync(targetPath))
            continue;
          const mergeContent = await readJson(join(mergeDir, file));
          const targetContent = await readJson(targetPath);
          await writeJson(targetPath, deepMergeJson(targetContent, mergeContent));
        }
      }
      if (existsSync(templateDir2)) {
        for (const file of listFiles(templateDir2)) {
          const dest = join(targetDir, file);
          const destDir = dirname(dest);
          if (!existsSync(destDir))
            mkdirSync(destDir, { recursive: true });
          await cp(join(templateDir2, file), dest);
        }
      }
    } else {
      for (const file of listFiles(addonDir)) {
        if (file === "package.json" || file === "addon.json")
          continue;
        const dest = join(targetDir, file);
        const destDir = dirname(dest);
        if (!existsSync(destDir))
          mkdirSync(destDir, { recursive: true });
        await cp(join(addonDir, file), dest);
      }
    }
  }
  s.stop("Project structure ready.");
  if (!noInstall) {
    log.step("Running bun install...");
    const installCode = await run(["bun", "install"], targetDir);
    if (installCode !== 0) {
      cancel(`bun install failed (exit ${installCode})`);
      process.exit(installCode);
    }
  } else {
    log.step("Skipped bun install (--no-install)");
  }
  if (!noInstall) {
    for (const { meta } of sortedAddons) {
      for (const cmd of meta.postInstall ?? []) {
        log.step(cmd);
        const code = await run(cmd.split(" "), targetDir);
        if (code !== 0) {
          cancel(`postInstall failed: ${cmd} (exit ${code})`);
          process.exit(code);
        }
      }
    }
  }
  const cd = dirName.replace(/\\/g, "/");
  let next;
  if (projectType === "lib") {
    next = "bun run ts-check && bun test";
  } else if (isReactApp) {
    next = "bun run dev";
  } else {
    next = "bun run dev";
  }
  const installHint = noInstall ? `
  bun install` : "";
  outro(`\u2713 ${packageName} ready!${installHint}

  cd ${cd}
  ${next}`);
}
if (import.meta.main) {
  main().catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    cancel(`Error: ${msg}`);
    process.exit(1);
  });
}
