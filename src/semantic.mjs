// Semantic token colours. These override the TextMate colours when a language
// server provides semantic tokens (TypeScript, Pylance, rust-analyzer, clangd,
// gopls, ...). Selectors are `type.modifier:language`; the most specific match
// wins per style property, so a rule that only sets a colour keeps the
// TextMate italic/bold.
import { syntax as s } from './palette.mjs';

const italic = (foreground) => ({ foreground, italic: true });
const bold = (foreground) => ({ foreground, bold: true });
const upright = (foreground) => ({ foreground, italic: false, bold: false });

export default {
  // Standard token types, shared by every language
  namespace: s.namespace,
  module: s.namespace,
  class: s.type,
  enum: s.type,
  struct: s.type,
  type: s.type,
  typeAlias: s.type,
  union: s.type,
  // Traits, interfaces and concepts are italic; so are built-in/library types.
  interface: italic(s.type),
  concept: italic(s.type),
  'class.defaultLibrary': italic(s.type),
  'enum.defaultLibrary': italic(s.type),
  'interface.defaultLibrary': italic(s.type),
  'struct.defaultLibrary': italic(s.type),
  'type.defaultLibrary': italic(s.type),
  typeParameter: italic(s.type),
  parameter: italic(s.parameter),
  variable: s.variable,
  'variable.defaultLibrary': s.builtin,
  // TS and clangd mark every `const` as readonly; keep those looking like variables.
  'variable.readonly': s.variable,
  'variable.readonly.defaultLibrary': s.builtin,
  'variable.constant': s.constant,
  'variable.static.readonly': s.constant,
  'property.static.readonly': s.constant,
  property: s.property,
  'property.declaration': s.propertyDeclaration,
  'property.defaultLibrary': s.property,
  enumMember: s.constant,
  event: s.property,
  function: s.function,
  'function.declaration': bold(s.function),
  'function.definition': bold(s.function),
  'function.defaultLibrary': s.builtin,
  method: s.method,
  'method.declaration': bold(s.method),
  'method.definition': bold(s.method),
  'method.defaultLibrary': s.method,
  macro: s.macro,
  decorator: s.decorator,
  label: s.label,
  comment: italic(s.comment),
  'comment.documentation': italic(s.docComment),
  string: s.string,
  // Colour only: the TextMate rule decides whether a keyword is italic.
  keyword: s.keyword,
  'keyword.controlFlow': italic(s.keyword),
  number: s.number,
  regexp: s.regex,
  operator: s.operator,
  '*.deprecated': { strikethrough: true },

  // Python (Pylance)
  'variable.readonly:python': s.constant,
  // Pylance marks UPPER_CASE class attributes (self.CELLS) readonly.
  'property.readonly:python': s.constant,
  'function.builtin:python': s.builtin,
  'function.defaultLibrary:python': s.builtin,
  'class.builtin:python': italic(s.type),
  'class.defaultLibrary:python': italic(s.type),
  '*.decorator:python': s.decorator,
  selfParameter: italic(s.self),
  clsParameter: italic(s.self),
  // Dunder methods: method colour, never bold.
  magicFunction: upright(s.method),
  'magicFunction.declaration': upright(s.method),
  builtinConstant: s.builtin,

  // TypeScript / JavaScript (tsserver) uses the standard types above: object
  // keys and member declarations are property.declaration, globals such as
  // console and fetch are *.defaultLibrary.

  // Go (gopls) only marks real constants readonly.
  'variable.readonly:go': s.constant,

  // Rust (rust-analyzer)
  'keyword:rust': s.storage,
  'keyword.controlFlow:rust': italic(s.keyword),
  'keyword.unsafe:rust': bold(s.unsafe),
  'operator.controlFlow:rust': bold(s.keyword),
  'selfKeyword:rust': italic(s.self),
  'selfTypeKeyword:rust': upright(s.type),
  selfKeyword: italic(s.self),
  selfTypeKeyword: upright(s.type),
  'macro:rust': s.macro,
  macroBang: s.macro,
  procMacro: s.macro,
  attribute: s.decorator,
  attributeBracket: s.decorator,
  builtinAttribute: s.decorator,
  derive: s.decorator,
  deriveHelper: s.decorator,
  builtinType: italic(s.type),
  lifetime: italic(s.lifetime),
  boolean: italic(s.builtin),
  character: s.string,
  escapeSequence: s.escape,
  formatSpecifier: s.interpolation,
  punctuation: s.punctuation,
  'variable.static:rust': s.constant,
  'static:rust': s.constant,
  'const:rust': s.constant,
  constParameter: s.constant,
  crateRoot: s.namespace,
  toolModule: s.namespace,
  // Mutable bindings and `&mut self` are underlined, as rust-analyzer suggests.
  '*.mutable:rust': { underline: true },

  // C / C++ (clangd)
  'macro:cpp': s.macro,
  'macro:c': s.macro,
  // `auto` is emitted as the deduced type; keep it looking like a keyword.
  '*.deduced:cpp': upright(s.storage),
  'modifier:cpp': s.storage,
  'bracket:cpp': s.punctuation,
  'operator.userDefined:cpp': s.operator,
};
