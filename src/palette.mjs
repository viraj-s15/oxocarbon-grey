// Oxocarbon Grey palette.
//
// Every colour in the generated theme comes from this file. Change a hex here
// (or point a role at a different colour) and run `npm run build`.

// Graphene greys: the backgrounds and neutral text.
export const grey = {
  bg: '#1b1c1f', // the whole window: editor, sidebar, panel, title bar, status bar, gaps
  bgFloat: '#232428', // floating widgets: menus, hovers, suggest, quick input, notifications
  bgLine: '#202125', // current line
  bgSelection: '#33353b',
  hairline: '#ffffff0d', // every border, ~5% white over the background
  guide: '#2b2d31', // indent guides, rulers
  lineNr: '#4d5159',
  lineNrActive: '#dde1e6',
  fg: '#dde1e6',
  fgMuted: '#8d9199', // punctuation, secondary UI text
  fgSubtle: '#6e747d', // comments, placeholders
  white: '#ffffff',
};

// Oxocarbon accents (nyoom-engineering/oxocarbon.nvim), plus a lighter blue
// for operators, a deeper Carbon blue for constants and a muted steel blue for
// terminal chips.
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
  steel: '#7189b3', // ANSI bright blue: readable as text, quiet as a background
  cobalt: '#4589ff', // IBM Carbon blue 50: constants
};

// Syntax roles. Token rules and semantic token colours refer to these names.
export const syntax = {
  keyword: accent.blue, // if, for, return, import
  storage: accent.cyan, // const, let, fn, def, class
  operator: accent.blueLight,
  function: accent.rose,
  method: accent.teal,
  type: accent.sky, // builtin/library types, traits, interfaces, type parameters: italic
  string: accent.purple,
  escape: accent.ice,
  regex: accent.teal,
  number: accent.ice,
  constant: accent.cobalt, // user constants, enum members
  builtin: accent.teal, // true, false, null, built-in functions and globals
  property: accent.ice, // fields and property access
  propertyDeclaration: accent.blueLight, // object keys, field and member declarations
  variable: grey.fg,
  parameter: grey.fg,
  self: accent.pink, // this, self, super
  decorator: accent.green,
  namespace: accent.teal,
  macro: accent.cyan, // Rust and C/C++ macros, preprocessor
  interpolation: accent.cyan, // ${ }, { } in f-strings and format strings, JSX { }
  lifetime: grey.fgMuted, // Rust lifetimes, italic
  unsafe: accent.pink, // Rust unsafe, bold
  label: accent.ice,
  punctuation: grey.fgMuted,
  comment: grey.fgSubtle,
  docComment: grey.fgMuted, // ///, /** */, doxygen: a step brighter than comments
  todo: accent.green,
  tag: accent.blue,
  attribute: accent.ice,
  heading: accent.pink,
  bold: accent.rose, // markdown bold
  link: accent.blue,
  inserted: accent.green,
  deleted: accent.pink,
  changed: accent.blue,
  invalid: accent.pink,
};

// ANSI terminal colours. VS Code uses the same colour for text and for
// backgrounds, so white and bright blue are toned down: "History restored" and
// other inverse chips use them as a background. Oxocarbon has no yellow; like
// oxocarbon.nvim, purple stands in for warnings.
export const ansi = {
  black: grey.bgSelection,
  red: accent.pink,
  green: accent.green,
  yellow: accent.purple,
  blue: accent.blue,
  magenta: accent.rose,
  cyan: accent.teal,
  white: '#aeb4be',
  brightBlack: grey.fgSubtle,
  brightRed: accent.pink,
  brightGreen: accent.green,
  brightYellow: accent.purple,
  brightBlue: accent.steel,
  brightMagenta: accent.rose,
  brightCyan: accent.cyan,
  brightWhite: grey.fg,
};
