# Changelog

## Unreleased

- Website in `site/`, deployed to GitHub Pages by `.github/workflows/pages.yml`. Its code samples come from the fixtures, highlighted by the Neovim port with Tree-sitter.
- Neovim colorscheme `oxocarbon-grey` in `colors/` and `lua/`, written in Lua for Neovim 0.10+. Its palette is generated from the same source by `src/neovim/` and committed. It styles Vim syntax, Tree-sitter, LSP semantic tokens, diagnostics and the terminal, plus Telescope, Gitsigns and blink.cmp. `npm run check` checks the palette, `npm run test:neovim` runs the headless tests, and the VS Code and Zed themes are unchanged.
- Zed port in `zed/` (Zed extension `oxocarbon-grey-theme` 0.1.0, not yet published). It is generated from the same palette by `src/zed/`. `npm run check` validates it, and the VS Code theme is unchanged.

## 1.0.0

First release.

- Graphene grey workbench: title bar, activity bar, sidebar, editor, tabs, panel, terminal and status bar share one flat `#1b1c1f` surface with 5% white hairline borders, including VS Code's modern layout (1.139+).
- Oxocarbon syntax colours with cobalt constants, ice numbers, teal built-ins, italic control-flow keywords and language literals (`true`, `false`, `None`, `null`).
- Per-language tuning for Python, Rust, TypeScript/TSX and C++, covering both the built-in TextMate grammars and the semantic tokens from Pylance/basedpyright, rust-analyzer, tsserver and clangd.
- TextMate colours for Go, JSON, YAML, TOML, Markdown, HTML, CSS and shell.
- Terminal ANSI colours, git decorations, diff and merge editors, bracket pair colours.
- Every text colour is checked for contrast against the surfaces it appears on.
