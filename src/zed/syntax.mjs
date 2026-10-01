// Zed syntax styles, derived from the intentions in src/tokens.mjs and
// src/semantic.mjs. Keys are Zed highlight names, not TextMate scopes.
//
// How Zed resolves them:
// - Tree-sitter captures fall back by dot-separated prefix: a capture
//   `function.method.call` uses `function.method.call`, else `function.method`,
//   else `function`. Keys below only need to exist where a capture should look
//   different from its parent.
// - Semantic token rules (off by default in Zed) look styles up by exact name,
//   trying a list in order, e.g. a class tries `type.class`, `class`, `type`.
//   Keys that only exist for that lookup are marked "semantic".
// - Zed's queries put the same capture on different things per language, so
//   one key cannot always carry the VS Code intention for every language. The
//   trade-offs are noted inline and in the README.
//
// font_style and font_weight are only set where VS Code uses italic or bold.
// Leaving them unset lets a semantic token keep the tree-sitter italic of the
// token underneath (for example `if` stays italic when rust-analyzer reports it
// as a plain keyword), and leaves the user's buffer_font_weight alone.
import { grey, accent, syntax as s } from '../palette.mjs';

const style = (color, ...flags) => {
  const out = { color };
  if (flags.includes('italic')) out.font_style = 'italic';
  if (flags.includes('bold')) out.font_weight = 700;
  return out;
};

export default {
  // Keywords. `keyword` is control flow and imports in Python, declarations in
  // Rust and C++, and modifiers in TypeScript. It keeps the VS Code keyword blue
  // so Python `if`/`return` stay blue; Rust `fn`/`let` and C++ `class` are blue
  // too instead of cyan. Declaration keywords get their own capture in
  // TypeScript (const, let, function, class) and Python (def, class, lambda).
  keyword: style(s.keyword),
  'keyword.control': style(s.keyword, 'italic'),
  'keyword.import': style(s.keyword, 'italic'),
  'keyword.declaration': style(s.storage),
  'keyword.definition': style(s.storage),
  'keyword.modifier': style(s.storage), // semantic: clangd `modifier`
  'keyword.operator': style(s.keyword, 'italic'), // Python and, or, not, in, is
  'keyword.operator.regex': style(s.regex), // regex flags, \b and backreferences
  'keyword.preproc': style(s.macro), // #include, #define
  preproc: style(s.macro),
  'keyword.directive': style(grey.fgMuted, 'italic'), // shell shebang
  'keyword.jsdoc': style(grey.fgMuted, 'italic'),

  // Operators and punctuation
  operator: style(s.operator),
  punctuation: style(s.punctuation),
  'punctuation.bracket': style(s.punctuation),
  'punctuation.delimiter': style(s.punctuation),
  // Interpolation braces (${ }, f-string { }), but also TypeScript type
  // annotation colons, union bars and decorator `@`, and the Rust attribute
  // `#`. Muted like the rest of the punctuation: VS Code only colours the
  // interpolation braces, and those are rarer than type annotations.
  'punctuation.special': style(s.punctuation),
  'punctuation.list_marker': style(s.storage),
  'punctuation.markup': style(grey.fgMuted),
  'punctuation.bracket.regex': style(s.storage), // VS Code regex groups
  embedded: style(s.variable),

  // Comments
  comment: style(s.comment, 'italic'),
  'comment.doc': style(s.docComment, 'italic'),
  'comment.documentation': style(s.docComment, 'italic'), // semantic

  // Strings
  string: style(s.string),
  'string.doc': style(s.string, 'italic'), // Python docstrings
  'string.escape': style(s.escape),
  'string.regex': style(s.regex),
  'string.regexp': style(s.regex), // semantic
  'string.special': style(s.interpolation), // format specifiers, Go/Rust format strings
  'text.literal': style(s.string), // Rust chars (semantic), Markdown inline code

  // Numbers, constants and literals
  number: style(s.number),
  constant: style(s.constant),
  // None, null, undefined, nullptr. C++ queries also capture ALL_CAPS
  // identifiers here, so C++ constants and macros are teal rather than cobalt.
  'constant.builtin': style(s.builtin, 'italic'),
  boolean: style(s.builtin, 'italic'),
  'type.enum.member': style(s.constant), // semantic enumMember
  variant: style(s.constant), // semantic enumMember fallback

  // Variables, parameters and properties
  variable: style(s.variable),
  'variable.parameter': style(s.parameter, 'italic'),
  'function.kwargs': style(s.parameter, 'italic'), // Python keyword arguments
  'variable.special': style(s.self, 'italic'), // self, cls, this, super
  // C++ `this`. Zed's semantic rules also send library globals (console,
  // document) here, so with semantic tokens on those turn pink as well.
  'variable.builtin': style(s.self, 'italic'),
  'variable.jsdoc': style(grey.fgMuted, 'italic'),
  property: style(s.property),
  'attribute.special': style(s.builtin), // Python __dict__, __name__
  label: style(s.label),
  lifetime: style(s.lifetime, 'italic'),

  // Functions
  function: style(s.function),
  'function.definition': style(s.function, 'bold'),
  'function.builtin': style(s.builtin),
  'function.method': style(s.method),
  'function.special': style(s.macro), // Rust macros and C function-like macros
  'function.macro': style(s.macro), // semantic
  'function.decorator': style(s.decorator),
  constructor: style(s.storage), // the TypeScript `constructor` keyword

  // Types. Built-in types, interfaces/traits and type parameters are italic.
  type: style(s.type),
  'type.builtin': style(s.type, 'italic'),
  'type.class': style(s.type),
  'type.class.builtin': style(s.type, 'italic'), // Python built-in exceptions
  'type.interface': style(s.type, 'italic'),
  'type.parameter': style(s.type, 'italic'), // semantic
  'type.definition': style(s.type), // semantic declarations
  'type.interface.definition': style(s.type, 'italic'), // semantic
  'type.parameter.definition': style(s.type, 'italic'), // semantic
  concept: style(s.type, 'italic'),
  'type.unit': style(s.number), // CSS units
  'type.jsdoc': style(grey.fgMuted, 'italic'),
  namespace: style(s.namespace),
  module: style(s.namespace),

  // Decorators and attributes. `attribute` is Rust #[...] and C++ [[...]]
  // here; HTML attribute names share it, so they are green rather than ice.
  attribute: style(s.decorator),
  decorator: style(s.decorator),
  'attribute.jsx': style(s.attribute),

  // Tags
  tag: style(s.tag),
  'tag.component': style(s.type), // JSX components
  'tag.doctype': style(grey.fgMuted),
  text: style(s.variable),

  // CSS
  selector: style(s.tag),
  'selector.class': style(s.type),
  'selector.id': style(accent.rose),
  'selector.pseudo': style(s.method),
  charset: style(s.keyword),
  import: style(s.keyword),
  keyframes: style(s.keyword),
  media: style(s.keyword),
  supports: style(s.keyword),

  // Markdown
  title: style(s.heading, 'bold'),
  emphasis: style(s.variable, 'italic'),
  'emphasis.strong': style(s.bold, 'bold'),
  strikethrough: style(grey.fgMuted),
  link_text: style(s.link),
  link_uri: style(s.property),

  // Diffs
  'diff.plus': style(s.inserted),
  'diff.minus': style(s.deleted),
  'diff.delta': style(s.changed),

  // Editor annotations: inlay hints and edit predictions, like VS Code's
  // editorInlayHint and ghost text.
  hint: { color: grey.fgSubtle, background_color: grey.bgFloat },
  predictive: style(grey.fgSubtle),
  primary: style(s.variable),
};
