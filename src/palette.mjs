// Oxocarbon Grey palette.
//
// Every colour in the generated theme comes from this file. Change a hex here
// (or point a role at a different colour) and run `npm run build`.

// Graphene greys: the backgrounds and neutral text.
export const grey = {
  bg: '#1b1c1f', // editor
  bgDark: '#161719', // sidebar, activity bar, panel, title bar, status bar
  bgFloat: '#232428', // widgets, menus, hovers, inputs
  bgLine: '#222327', // current line
  bgSelection: '#33353b',
  border: '#2b2d31',
  lineNr: '#4d5159',
  lineNrActive: '#dde1e6',
  fg: '#dde1e6',
  fgMuted: '#8d9199', // punctuation, secondary UI text
  fgSubtle: '#6e747d', // comments, placeholders
  white: '#ffffff',
};

// Oxocarbon accents (nyoom-engineering/oxocarbon.nvim), plus peach from its
// light variant and a lighter blue for operators.
export const accent = {
  teal: '#08bdba', // base07
  cyan: '#3ddbd9', // base08
  blue: '#78a9ff', // base09
  blueLight: '#a6c8ff',
  pink: '#ee5396', // base10
  sky: '#33b1ff', // base11
  rose: '#ff7eb6', // base12
  green: '#42be65', // base13
  purple: '#be95ff', // base14
  ice: '#82cfff', // base15
  peach: '#ffab91',
};

// Syntax roles. Token rules and semantic token colours refer to these names.
export const syntax = {
  keyword: accent.blue, // if, for, return, import
  storage: accent.cyan, // const, let, fn, def, class
  operator: accent.blueLight,
  function: accent.rose,
  method: accent.teal,
  type: accent.sky,
  string: accent.purple,
  escape: accent.ice,
  regex: accent.teal,
  number: accent.peach,
  constant: accent.peach, // user constants, enum members
  builtin: accent.teal, // true, false, null, built-in constants
  property: accent.ice,
  variable: grey.fg,
  parameter: grey.fg,
  self: accent.pink, // this, self, super
  decorator: accent.green,
  namespace: accent.teal,
  macro: accent.cyan,
  label: accent.ice,
  punctuation: grey.fgMuted,
  comment: grey.fgSubtle,
  todo: accent.green,
  tag: accent.blue,
  attribute: accent.ice,
  heading: accent.pink,
  link: accent.blue,
  inserted: accent.green,
  deleted: accent.pink,
  changed: accent.blue,
  invalid: accent.pink,
};

// ANSI terminal colours.
export const ansi = {
  black: grey.bgSelection,
  red: accent.pink,
  green: accent.green,
  yellow: accent.peach,
  blue: accent.blue,
  magenta: accent.purple,
  cyan: accent.teal,
  white: grey.fg,
  brightBlack: grey.fgSubtle,
  brightRed: accent.rose,
  brightGreen: accent.green,
  brightYellow: accent.peach,
  brightBlue: accent.blueLight,
  brightMagenta: accent.purple,
  brightCyan: accent.cyan,
  brightWhite: grey.white,
};
