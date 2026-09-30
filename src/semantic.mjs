// Semantic token colours. These override the TextMate colours when a language
// server provides semantic tokens (TypeScript, Pylance, rust-analyzer, clangd,
// gopls, ...). Selectors are `type.modifier:language`; each style property
// comes from the highest-scoring rule that sets it (100 - supertype level,
// +100 per modifier, +10 for a language). A property no rule sets is NOT taken
// from the token's own TextMate scope: VS Code probes the token type's default
// scope (e.g. keyword -> keyword.control) in this theme instead. So set italic
// and bold explicitly wherever the default probe would give the wrong answer.
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
  // Explicitly upright: the default probe (keyword.control) is italic.
  keyword: upright(s.keyword),
  'keyword.controlFlow': italic(s.keyword),
  number: s.number,
  regexp: s.regex,
  operator: s.operator,
  '*.deprecated': { strikethrough: true },

  // Python (Pylance)
  'variable.readonly:python': s.constant,
  // UPPER_CASE class attributes (self.CELLS) are readonly. basedpyright also
  // marks getter-only @property readonly; their declarations stay methods.
  'property.readonly:python': s.constant,
  'property.declaration.readonly:python': bold(s.method),
  'function.builtin:python': s.builtin,
  'class.builtin:python': italic(s.type),
  // Decorators stay green even when they are builtins (@property, @classmethod).
  '*.decorator:python': s.decorator,
  'class.decorator.builtin:python': upright(s.decorator),
  'function.decorator.builtin:python': s.decorator,
  // basedpyright types Callable parameters as function, TypedDict keys as property.
  'function.parameter:python': italic(s.parameter),
  'function.declaration.parameter:python': { foreground: s.parameter, italic: true, bold: false },
  'property.parameter:python': italic(s.parameter),
  intrinsic: s.builtin,
  // Pylance only emits keyword tokens for soft keywords: match, case (and type).
  'keyword:python': italic(s.keyword),
  selfParameter: italic(s.self),
  clsParameter: italic(s.self),
  // Dunder methods: method colour, never bold.
  magicFunction: upright(s.method),
  'magicFunction.declaration': upright(s.method),
  // Pylance: True, False, None, __debug__.
  builtinConstant: italic(s.builtin),
  // Pylance's punctuation types probe `source.python`, which this theme leaves unstyled.
  parenthesis: s.punctuation,
  bracket: s.punctuation,
  curlybrace: s.punctuation,
  colon: s.punctuation,
  semicolon: s.punctuation,
  arrow: s.punctuation,

  // TypeScript / JavaScript (tsserver) uses the standard types above: object
  // keys and member declarations are property.declaration, globals such as
  // console and fetch are *.defaultLibrary.

  // Go (gopls) only marks real constants readonly.
  'variable.readonly:go': s.constant,

  // Rust (rust-analyzer)
  // Every non-control-flow keyword (fn, let, impl, use, as, in) is plain keyword.
  'keyword:rust': upright(s.storage),
  'keyword.controlFlow:rust': italic(s.keyword),
  'keyword.unsafe:rust': bold(s.unsafe),
  'operator.unsafe:rust': bold(s.unsafe),
  'operator.controlFlow:rust': bold(s.keyword),
  // boolean's supertype is keyword, so keyword:rust would otherwise win.
  'boolean:rust': italic(s.builtin),
  // Std functions (Instant::now, HashMap::new) are ordinary functions.
  'function.defaultLibrary:rust': s.function,
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
  'static:rust': s.constant,
  'const:rust': s.constant,
  constParameter: s.constant,
  toolModule: s.namespace,
  // Mutable bindings, parameters and `&mut self` are underlined; methods that
  // take &mut self and compound assignments are not.
  '*.mutable:rust': { underline: true },
  'method.mutable:rust': { underline: false },
  'function.mutable:rust': { underline: false },
  'operator.mutable:rust': { underline: false },

  // C / C++ (clangd)
  'macro:cpp': s.macro,
  'macro:c': s.macro,
  // `auto` is emitted as the deduced type; keep it looking like a keyword.
  '*.deduced:cpp': upright(s.storage),
  '*.deduced.defaultLibrary:cpp': upright(s.storage),
  'modifier:cpp': s.storage,
  'operator.userDefined:cpp': s.operator,
  'operator.declaration:cpp': bold(s.function),
  'class.declaration.constructorOrDestructor:cpp': bold(s.type),
  'function.static.classScope:cpp': s.method,
  'function.defaultLibrary:cpp': s.function,
  // Namespace-scope constexpr/const values are constants; std ones stay built-in.
  'variable.readonly.fileScope:cpp': s.constant,
  'variable.readonly.globalScope:cpp': s.constant,
  'variable.readonly.defaultLibrary.fileScope:cpp': s.builtin,
  'variable.readonly.defaultLibrary.globalScope:cpp': s.builtin,
  // Static data members are fields; static constexpr members are constants.
  'variable.static.classScope:cpp': s.property,
  'variable.declaration.static.classScope:cpp': s.propertyDeclaration,
  'variable.readonly.static.classScope:cpp': s.constant,
  'variable.declaration.readonly.static.classScope:cpp': s.constant,
  // Non-type template parameters (std::size_t N) are values, like Rust const generics.
  'typeParameter.readonly:cpp': upright(s.constant),
  '*.usedAsMutableReference:cpp': { underline: true },
  '*.usedAsMutablePointer:cpp': { underline: true },
  // cpptools: `new` is a newOperator (supertype operator).
  newOperator: s.keyword,

  // TypeScript / JavaScript: globals used as values (Array.isArray, new Map,
  // Object.keys) are built-ins; the same names in type positions stay types.
  'class.defaultLibrary:typescript': upright(s.builtin),
  'class.defaultLibrary:typescriptreact': upright(s.builtin),
  'class.defaultLibrary:javascript': upright(s.builtin),
  'class.defaultLibrary:javascriptreact': upright(s.builtin),
};
