# Changelog

## 0.3.1

Audited against Catppuccin, One Dark Pro, Tokyo Night, GitHub, Material and Dracula, and against real semantic tokens from rust-analyzer, clangd, basedpyright and tsserver, resolved the way VS Code resolves them.

- Fixed: with rust-analyzer, declaration keywords (`fn`, `let`, `impl`) could turn italic and `true`/`false` were cyan.
- Fixed: with clangd:
  - `auto` turned sky italic when it deduced a std type;
  - operator overload and constructor names lost their declaration style;
  - static member functions were rose.
- Semantic additions:
  - clangd: namespace-scope `constexpr` values and non-type template parameters are constants, and static data members use the field colour.
  - Pylance: `True`/`False`/`None` are italic, its punctuation tokens are muted, `match`/`case` stay italic, and decorators stay green even for built-ins.
  - basedpyright: `Callable` parameters stay parameters.
  - TypeScript: globals used as values (`Array.isArray`, `new Map`) are teal.
  - Rust: raw-pointer derefs share `unsafe`'s pink bold; methods taking `&mut self` are no longer underlined; std functions are ordinary functions.
- TextMate:
  - Python and TS regex internals, backreferences and named groups;
  - number prefixes and suffixes (`0x`, `3j`, `10n`);
  - Python base-class parentheses, and TS destructuring colons and generator `*`;
  - bold arrow-function declarations; italic trait and interface declarations;
  - Rust `b"…"`/`r#"…"#` prefixes;
  - C++ constructors, enum base types, lambda return types, `->`, `...`, `alignof`/`typeid`/`noexcept`.
- Removed selectors the built-in grammars never emit.
- `fixtures/cache.rs` now compiles.

## 0.3.0

- Per-language tuning for Python, Rust, TypeScript/TSX and C++, covering both the built-in TextMate grammars and the semantic tokens from Pylance, rust-analyzer, tsserver and clangd. Role colours are the same in all four languages.
- Added `fixtures/` with a realistic sample file per language; the preview images are rendered from them.
- New roles:
  - interpolation braces are cyan, with the code inside in normal colours;
  - doc comments are a step brighter than comments;
  - Rust lifetimes are muted italic;
  - object keys and field declarations are light blue;
  - built-in functions and globals are teal;
  - traits, interfaces and concepts are italic sky, like library types.
- Python: docstrings are italic, dunder methods are never bold, format specs are ice, exceptions are italic like other built-in types.
- Rust: macros and attributes are coloured as a whole, `?` is bold, `unsafe` is bold pink and mutable bindings are underlined with rust-analyzer, `Some`/`None`/`Ok`/`Err` use the constant colour, `mut` is no longer italic.
- TypeScript/TSX: decorator names are green, `new X()` uses the type colour, `?.` is an operator.
- C++: all preprocessor directives are cyan, `ALL_CAPS()` calls use the macro colour, attributes are green, operator overloads are bold like function declarations, and clangd's `auto` stays a keyword.
- Fixed: C++ parameter types were italic, and regex character-set brackets and Python `...` used the constant colour.

## 0.2.1

- Constants and enum members are now cobalt `#4589ff` (IBM Carbon blue 50) instead of pink, so pink is left for functions and `self` / `this`. This covers the `constant.other.caps` scopes and the semantic `readonly` / `enumMember` tokens from Pylance, TypeScript and rust-analyzer.
- Control-flow keywords, imports and exports, word operators (`and`, `or`, `not`, `in`, `is`) and language literals (`true`, `false`, `null`, `None`, `nil`, `undefined`) are italic. Declaration keywords (`def`, `class`, `fn`, `let`, `const`, `function`, `struct`, `impl`) stay upright. The italic also applies when semantic highlighting is on.

## 0.2.0

- Removed peach. Numbers are now ice `#82cfff`, as in Oxocarbon. Constants and enum members are now pink `#ee5396`. Warnings are purple `#be95ff`, as in oxocarbon.nvim.
- The whole window is now one flat surface: the title bar, activity bar, sidebar, editor, tabs, breadcrumbs, panel, terminal, status bar and minimap all use `#1b1c1f`.
- Support for VS Code's modern layout (1.139+): `modernUI.shellBackground`, `surface.*`, `editor.border`, `modernPanel.border` and the `modernActivityBar.*` keys match the surface, so the rounded parts no longer read as separate cards.
- Borders are a single 5% white hairline. Removed drop shadows from flat surfaces; floating widgets keep a soft shadow.
- Terminal: the tab list, panel header and terminal body share the surface colour. ANSI white and bright blue are muted, so inverse chips such as "History restored" no longer show as a bright block. Selection is a soft blue tint, and command decorations are muted.
- Current line highlight is darker (`#202125`), so pink text has at least 4.5:1 contrast on it. The contrast check now covers the line highlight and the terminal ANSI colours.

## 0.1.0

- First release.
- Graphene grey workbench and editor colours.
- Syntax colours for TypeScript/JavaScript/JSX, Python, Rust, Go, C/C++, JSON, YAML, TOML, Markdown, HTML, CSS and shell.
- Semantic token colours for TypeScript, Pylance, rust-analyzer, clangd and gopls.
- Terminal ANSI colours, git decorations, diff and merge editors, bracket pair colours.
