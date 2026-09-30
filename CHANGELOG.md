# Changelog

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
