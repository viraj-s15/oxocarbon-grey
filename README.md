# Oxocarbon Grey

A dark VS Code colour theme built on the [Oxocarbon](https://github.com/nyoom-engineering/oxocarbon.nvim) palette, with two changes:

- **Graphene background.** A cool dark grey (`#1b1c1f`) with slightly darker chrome instead of near-black.
- **More nuanced syntax.** Oxocarbon uses one blue for keywords, types, operators, booleans and tags. Here they are split across the palette, and there is a full semantic token map so language servers (TypeScript, Pylance, rust-analyzer, clangd, gopls) colour things consistently.

## Screenshots

These previews were rendered with [Shiki](https://shiki.style) from the TextMate rules only. In VS Code, semantic highlighting adds more detail, such as teal method calls and ice-blue properties.

![TypeScript](images/preview-typescript.png)

![Python](images/preview-python.png)

![Rust](images/preview-rust.png)

<!-- TODO: add full VS Code window screenshots (sidebar, terminal, diff editor). -->

## Install

**From Open VSX** (VSCodium, Gitpod, Theia, Cursor and other Open VSX clients), once published:

1. Open the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **Oxocarbon Grey** and install it.
3. Run **Preferences: Color Theme** and pick **Oxocarbon Grey**.

Or from the command line:

```sh
codium --install-extension viraj-s15.oxocarbon-grey
```

**From a `.vsix` file:**

```sh
code --install-extension oxocarbon-grey-0.1.0.vsix
```

or use **Extensions: Install from VSIX...** from the command palette.

## Palette

### Greys

| Role | Hex |
| --- | --- |
| Editor background | `#1b1c1f` |
| Sidebar, activity bar, panel, title bar, status bar | `#161719` |
| Widgets, menus, hovers, inputs | `#232428` |
| Current line | `#222327` |
| Selection | `#33353b` |
| Borders | `#2b2d31` |
| Line numbers | `#4d5159` |
| Foreground, active line number | `#dde1e6` |
| Punctuation, secondary text | `#8d9199` |
| Comments, placeholders | `#6e747d` |

### Accents

| Name | Hex | Oxocarbon | Used for |
| --- | --- | --- | --- |
| Blue | `#78a9ff` | base09 | Control keywords, HTML tags, links, UI accent |
| Light blue | `#a6c8ff` | (Carbon blue 30) | Operators |
| Cyan | `#3ddbd9` | base08 | Storage and declaration keywords, macros |
| Teal | `#08bdba` | base07 | Methods, namespaces, booleans, built-in constants, regex |
| Sky | `#33b1ff` | base11 | Types, classes, interfaces, enums |
| Ice | `#82cfff` | base15 | Properties, object keys, attributes, escapes |
| Purple | `#be95ff` | base14 | Strings, inline code |
| Rose | `#ff7eb6` | base12 | Functions |
| Pink | `#ee5396` | base10 | `this` / `self`, headings, deletions, errors, badges |
| Peach | `#ffab91` | light variant | Numbers, constants, enum members, warnings |
| Green | `#42be65` | base13 | Decorators, TODO, additions |

### Syntax

| Token | Colour |
| --- | --- |
| `if` `for` `return` `import` | Blue `#78a9ff` |
| `const` `let` `fn` `def` `class` `struct` | Cyan `#3ddbd9` |
| Operators | Light blue `#a6c8ff` |
| Function declarations / calls | Rose `#ff7eb6` bold / regular |
| Methods | Teal `#08bdba` (declarations bold) |
| Types, classes, interfaces, enums | Sky `#33b1ff` |
| Built-in types, type parameters, lifetimes | Sky `#33b1ff` italic |
| Strings | Purple `#be95ff` |
| Escapes, format placeholders | Ice `#82cfff` |
| Regular expressions | Teal `#08bdba` |
| Numbers, constants, enum members | Peach `#ffab91` |
| `true` `false` `null` `None`, built-in constants | Teal `#08bdba` |
| Properties, object keys | Ice `#82cfff` |
| Variables | `#dde1e6` |
| Parameters | `#dde1e6` italic |
| `this` `self` `super` `cls` | Pink `#ee5396` italic |
| Decorators, attributes, annotations | Green `#42be65` |
| Namespaces, modules | Teal `#08bdba` |
| Macros, preprocessor | Cyan `#3ddbd9` |
| Commas, semicolons, brackets, dots | `#8d9199` |
| Comments | `#6e747d` italic |
| TODO / FIXME (where the grammar marks them) | Green `#42be65` bold italic |
| HTML / JSX tags, attributes | Blue `#78a9ff`, ice `#82cfff` |
| Markdown headings, links, inline code | Pink bold, blue, purple |
| Diff inserted / deleted / changed | Green, pink, blue |

Every syntax colour has at least 4.5:1 contrast on the editor background. Comments have 3.4:1. `npm run build` checks this.

## Customising or building

All colours live in [`src/palette.mjs`](src/palette.mjs). The generator needs Node 20.15+ and has no dependencies:

```sh
npm run build     # regenerate themes/oxocarbon-grey-color-theme.json and images/icon.png
npm run check     # fail if the committed theme is out of date
npm run package   # build, then create oxocarbon-grey-<version>.vsix with @vscode/vsce
```

| File | Contents |
| --- | --- |
| `src/palette.mjs` | Greys, accents, syntax roles, ANSI colours |
| `src/ui.mjs` | Workbench colours |
| `src/tokens.mjs` | TextMate token rules |
| `src/semantic.mjs` | Semantic token colours |
| `src/contrast.mjs` | WCAG contrast checks |
| `src/icon.mjs` | Draws the extension icon |

To tweak a single colour without forking, use `workbench.colorCustomizations`, `editor.tokenColorCustomizations` or `editor.semanticTokenColorCustomizations` in your settings, scoped to `"[Oxocarbon Grey]"`.

## Credits

- Palette and original syntax mapping: [oxocarbon.nvim](https://github.com/nyoom-engineering/oxocarbon.nvim) by Nyoom Engineering, MIT licensed.
- Oxocarbon itself is based on IBM's [Carbon](https://carbondesignsystem.com) colour palette.

## License

[MIT](LICENSE)
