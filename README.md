# Oxocarbon Grey

A dark VS Code colour theme built on the [Oxocarbon](https://github.com/nyoom-engineering/oxocarbon.nvim) palette, with two changes:

- **One graphene surface.** The whole window, from the title bar through the sidebar, editor, panel and terminal to the status bar, is a single cool dark grey (`#1b1c1f`) with hairline borders. In VS Code's modern layout the gaps around the rounded parts use the same colour, so the parts don't read as separate cards.
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
code --install-extension oxocarbon-grey-0.2.0.vsix
```

or use **Extensions: Install from VSIX...** from the command palette.

## Palette

### Greys

| Role | Hex |
| --- | --- |
| Every part of the window, and the gaps between them | `#1b1c1f` |
| Floating widgets: menus, hovers, suggest, quick input, notifications | `#232428` |
| Current line | `#202125` |
| Selection | `#33353b` |
| Borders (hairline) | `#ffffff0d` (5% white) |
| Indent guides, rulers | `#2b2d31` |
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
| Ice | `#82cfff` | base15 | Numbers, properties, object keys, attributes, escapes |
| Purple | `#be95ff` | base14 | Strings, inline code, warnings |
| Rose | `#ff7eb6` | base12 | Functions, markdown bold |
| Pink | `#ee5396` | base10 | Constants, enum members, `this` / `self`, headings, deletions, errors, badges |
| Green | `#42be65` | base13 | Decorators, TODO, additions |
| Steel | `#7189b3` | (muted blue) | Terminal bright blue only |

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
| Numbers | Ice `#82cfff` |
| Constants, enum members | Pink `#ee5396` |
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

Every syntax colour has at least 4.5:1 contrast on both the editor background and the current line. Comments have at least 3.2:1. The terminal ANSI colours have at least 4.5:1 as text (bright black has 3.4:1). `npm run build` checks all of this.

### Terminal

Normal ANSI colours use the accents: pink, green, purple (for yellow, as in oxocarbon.nvim), blue, rose, teal. VS Code uses the same colour for ANSI text and ANSI backgrounds, so white (`#aeb4be`) and bright blue (`#7189b3`) are toned down. Inverse and highlighted text, such as the "History restored" marker, then shows as a muted grey-blue chip instead of a bright block.

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
