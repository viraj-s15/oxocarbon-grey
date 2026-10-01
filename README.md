# Oxocarbon Grey

A dark VS Code theme based on [Oxocarbon](https://github.com/nyoom-engineering/oxocarbon.nvim), with a flat graphene background and richer syntax colours. Tuned for Python, Rust, TypeScript and C++. A Zed port lives in [`zed/`](zed).

![Python](images/preview-python.png)

![Rust](images/preview-rust.png)

![TypeScript](images/preview-typescript.png)

![C++](images/preview-cpp.png)

## Install

Available on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=viraj-s15.oxocarbon-grey) and [Open VSX](https://open-vsx.org/extension/viraj-s15/oxocarbon-grey). Search for **Oxocarbon Grey** in the Extensions view, or:

```sh
code --install-extension viraj-s15.oxocarbon-grey
```

Keep semantic highlighting on for the full effect.

## Zed

The Zed port is available for local testing from this repository. It has not been published to Zed's extension registry yet, so it cannot be installed from Zed's Extensions page by name.

It is a theme-only extension (`oxocarbon-grey-theme`) with one dark theme, **Oxocarbon Grey**. Its colours are generated from the same palette as the VS Code theme, and the generated files are committed. Installing it needs neither Node nor the generator.

### Install it as a dev extension

1. Get the code. For a pull request that has not been merged yet, fetch it by number:

   ```sh
   git clone https://github.com/viraj-s15/oxocarbon-grey
   cd oxocarbon-grey
   git fetch origin pull/<number>/head:zed-review
   git switch zed-review
   ```

   On `main`, the clone alone is enough.

2. Optional: with Node 22, `npm run check` confirms that the committed `zed/` files match the generator and pass the checks below.
3. Open Zed's Extensions page: <kbd>cmd-shift-x</kbd> on macOS, <kbd>ctrl-shift-x</kbd> on Linux and Windows, or `zed: extensions` in the command palette.
4. Click **Install Dev Extension** and select the repository's `zed/` directory, not the repository root.
5. Open the theme selector (<kbd>cmd-k cmd-t</kbd> or <kbd>ctrl-k ctrl-t</kbd>, or `theme selector: toggle`) and pick **Oxocarbon Grey**. To keep it, set `"theme": "Oxocarbon Grey"` in your settings.

Zed links the dev extension to the directory you picked. It does not copy it, so switching branches or regenerating `zed/` changes what Zed loads. After a change:

1. Run `npm run build:zed`, or check out the new commit.
2. Click **Rebuild** on the dev extension's card in the Extensions page, or run `zed: rebuild dev extension`.

To remove it, click **Uninstall** on the same card. This removes Zed's link and leaves the repository alone.

If a published version of an extension with the same ID is installed, Zed uninstalls it before installing the dev extension. The Extensions page then shows the published entry as "Overridden by dev extension". This only matters once the theme is in the registry. Zed's other Oxocarbon extension uses a different ID, so the two do not interfere.

If installation fails, `zed: open log` shows the error.

### Review checklist

Open the files in [`fixtures/`](fixtures) and compare with the VS Code previews above.

- **Syntax** in `inventory.py`, `cache.rs`, `TaskBoard.tsx` and `matrix.cpp`. Check each of these:
  - Comments: grey italic.
  - Rust doc comments: a step brighter.
  - Strings: purple, with ice escapes.
  - Keywords: blue, with control flow (`if`, `return`, `match`) in italic.
  - Declaration keywords: cyan (Python `def`/`class`, TypeScript `const`/`function`/`class`).
  - Types: sky. Built-in types, traits and interfaces are italic.
  - Functions: rose, with definitions in bold.
  - Methods: teal. Properties: ice.
  - Parameters: italic. `self`/`this`: pink italic.
  - Constants: cobalt. `true`/`false`/`None`/`null`: teal italic.
  - Decorators and attributes: green. Macros: cyan. Lifetimes: grey italic.
- **Semantic highlighting.** Optionally enable it for Rust (see below) and reopen `cache.rs`:
  - Enum variants (`Some`, `Ok`, `CacheError::Full`) turn cobalt.
  - Method definitions turn teal bold.
  - Module paths (`std`, `collections`) turn teal.

  `dev: open highlights tree view` shows which capture or token styles each piece of text.
- **Editor:**
  - Selection: grey. Search matches and symbol highlights stay visible inside it.
  - Search: every match cyan-tinted, the current match sky.
  - Matching brackets and highlights of the symbol under the cursor.
  - Current line and line numbers.
  - Indent guides; whitespace (set `"show_whitespaces": "all"`).
  - Inlay hints, if your language server provides them.
- **Diagnostics.** Break something in a fixture. Errors are pink, warnings purple, hints teal. Check the squiggles, inline diagnostics and the diagnostics panel.
- **Diffs and git.** Edit a fixture and check:
  - Gutter hunks: green added, blue modified, pink deleted.
  - The expanded hunk view and `git: diff`.
  - File colours in the project panel.
- **UI.** Check these surfaces:
  - Tabs, project panel, outline panel, title bar and status bar all share one surface with hairline borders. The active tab has brighter text and no accent line.
  - Command palette, menus and popovers float one step lighter.
  - Hover, selected and focused states, with blue focus borders.
  - Muted and placeholder text.
- **Terminal.** Run this in Zed's terminal to show the 16 ANSI colours, then the dim variants:

  ```sh
  for i in $(seq 0 15); do printf '\e[38;5;%sm %2s ' "$i" "$i"; done; printf '\e[0m\n'
  for i in $(seq 30 37); do printf '\e[2;%sm dim \e[0m' "$i"; done; echo
  ```

### Semantic tokens

Zed leaves semantic tokens off by default, and the theme does not need them. For **Rust**, turning them on brings the colours closer to the VS Code theme:

```json
{
  "languages": {
    "Rust": { "semantic_tokens": "combined" }
  }
}
```

With rust-analyzer the changes are:
- Enum variants, including `Some`, `None`, `Ok` and `Err`, become cobalt.
- Method definitions become teal bold.
- Module paths become teal.
- Parameters are italic wherever they are used.

There are two side effects:
- Standard-library functions such as `Instant::now` and `HashMap::new` turn teal.
- Loop labels turn grey italic.

These effects were worked out by running Zed's own semantic token rules over tokens recorded from rust-analyzer on `fixtures/cache.rs`. They still need confirming in Zed.

For TypeScript, Python and C++, semantic tokens are not recommended with this theme. Zed's built-in rules send:
- library globals such as `console` and `Math` to the same style as `this` (pink italic),
- basedpyright's `Callable` parameters to the function colour,
- every clangd `const` local to the constant colour.

### Differences from the VS Code theme

Zed themes map highlight names to styles, with no per-language rules. Zed's built-in queries use the same capture for different things in different languages. So some VS Code distinctions cannot be expressed:

- **Keywords.** Zed's plain `keyword` capture covers different things per language:
  - Python: control flow and imports.
  - Rust and C++: declarations.
  - TypeScript: modifiers.

  It stays keyword blue, so Rust `fn`/`let`/`impl` and C++ `class`/`template`/`const` are blue rather than cyan. Python `if`/`for`/`return`/`import` are blue but not italic. Rust `unsafe` is not pink bold, and `?` is not bold.
- **Rust and Python method definitions** are rose bold like functions. With Rust semantic tokens they become teal bold.
- **Rust enum variants** are sky like types until semantic tokens are on.
- **C++.**
  - Constructors are rose rather than sky bold.
  - Zed captures ALL_CAPS identifiers and non-type template parameters as built-in constants, so they are teal italic.
- **Field declarations and object keys** share the property colour (ice). Zed has no separate declaration capture.
- **Punctuation.** The Rust `#[...]` brackets and the TypeScript decorator `@` are muted rather than green. Interpolation braces are muted rather than cyan, because Zed uses the same capture for TypeScript type-annotation colons.
- **HTML attribute names** are green: they share the `attribute` style with Rust and C++ attributes.
- **No underline or strikethrough.** Zed theme styles cannot set either, so Markdown links and mutable Rust bindings are not underlined.
- **UI.**
  - There is no accent line on the active tab and no border on the current search match.
  - Zed's dim ANSI colours, which VS Code lacks, are the normal colours mixed 70% into the background.
  - Vim and Helix mode indicators use accent chips.

Zed's registry already lists [Oxocarbon](https://zed.dev/extensions/oxocarbon) (`oxocarbon`). It has four dark and four light variants on neutral `#161616` and white, with purple keywords, green functions, blue strings and pink types. Oxocarbon Grey has one dark variant on cool graphene `#1b1c1f` and assigns the accents differently:
- keywords blue
- functions rose
- strings purple
- types sky
- constants cobalt

It also carries over the per-language tuning above. Whether the registry accepts it next to the existing extension is up to Zed's maintainers.

## Build

Colours live in `src/palette.mjs`. `src/ui.mjs`, `src/tokens.mjs` and `src/semantic.mjs` map them for VS Code; `src/zed/` maps them for Zed.

```sh
npm run build             # VS Code theme, icon and zed/
npm run build:zed         # zed/ only
npm run check             # committed output is up to date; Zed checks and tests
npm run check:zed-schema  # zed/ theme against Zed's JSON schema (ajv-cli via npx)
npm run package           # VS Code .vsix
```

`npm run check` writes nothing. For the Zed output it:
- verifies `zed/` matches the generator and contains nothing else,
- rejects style properties that Zed's schema does not know,
- requires every colour property the schema offers, since Zed fills missing ones from One Dark,
- checks that every capture used by Zed's Python, Rust, TypeScript and C++ queries resolves to a style, and that each of Zed's default semantic rules finds one,
- checks contrast,
- checks the registry's ID, manifest and licence rules.

`src/zed/theme-schema.json` is Zed's theme schema generated from Zed's source; `src/zed/validate.mjs` says how to refresh it. CI also validates against the published schema at <https://zed.dev/schema/themes/v0.2.0.json>.

The Zed extension is versioned separately from the VS Code extension. Its version lives in `src/zed/manifest.mjs`, and is bumped whenever `zed/` changes. `zed/LICENSE` is a generated copy of `LICENSE`, because Zed requires the licence inside the extension directory.

## Credits

[oxocarbon.nvim](https://github.com/nyoom-engineering/oxocarbon.nvim) by Nyoom Engineering, based on IBM's [Carbon](https://carbondesignsystem.com) palette.

## License

[MIT](LICENSE)
