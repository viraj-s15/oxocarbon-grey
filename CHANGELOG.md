# Changelog

## Unreleased

- Zed port in `zed/` (Zed extension `oxocarbon-grey-theme` 0.1.0, not yet published). It is generated from the same palette by `src/zed/`. `npm run check` validates it, and the VS Code theme is unchanged.

## 1.0.0

First release.

- Graphene grey workbench: title bar, activity bar, sidebar, editor, tabs, panel, terminal and status bar share one flat `#1b1c1f` surface with 5% white hairline borders, including VS Code's modern layout (1.139+).
- Oxocarbon syntax colours with cobalt constants, ice numbers, teal built-ins, italic control-flow keywords and language literals (`true`, `false`, `None`, `null`).
- Per-language tuning for Python, Rust, TypeScript/TSX and C++, covering both the built-in TextMate grammars and the semantic tokens from Pylance/basedpyright, rust-analyzer, tsserver and clangd.
- TextMate colours for Go, JSON, YAML, TOML, Markdown, HTML, CSS and shell.
- Terminal ANSI colours, git decorations, diff and merge editors, bracket pair colours.
- Every text colour is checked for contrast against the surfaces it appears on.
