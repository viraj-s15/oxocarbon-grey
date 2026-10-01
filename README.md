# Oxocarbon Grey

A dark VS Code theme based on [Oxocarbon](https://github.com/nyoom-engineering/oxocarbon.nvim), with a flat graphene background and richer syntax colours. Tuned for Python, Rust, TypeScript and C++. A Zed port lives in [`zed/`](zed), a [Neovim](#neovim) colorscheme in [`colors/`](colors) and [`lua/`](lua), and a [Ghostty](#ghostty) theme in [`ghostty/`](ghostty).

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

## Neovim

The repository is also a Neovim plugin with one dark colorscheme, `oxocarbon-grey`. It is written in Lua and needs no other plugin. Its colours come from the same palette as the VS Code and Zed themes: `lua/oxocarbon_grey/palette.lua` is generated from `src/palette.mjs` and committed, so using the theme does not need Node or a build step.

### Requirements

- **Neovim 0.10 or later.** CI tests 0.10.4, 0.11.7 and 0.12.5. Neovim 0.10 renamed the Tree-sitter captures (`@variable.member`, `@keyword.conditional`, `@markup.*`, …) and the theme only styles the new names, so 0.9 and older are not supported.
- **True colour.** The theme uses 24-bit colours and has no 256-colour fallback. Neovim 0.10+ enables `termguicolors` by itself when the terminal reports true-colour support. If colours look wrong, set `vim.o.termguicolors = true` and, in tmux, enable RGB for your terminal (`set -as terminal-features ",xterm-256color:RGB"`). The theme does not set `termguicolors` for you.
- Loading the theme sets `background` to `dark`. It changes no other option. The theme is dark only: if you set `background=light` afterwards, Neovim resets its core highlight groups and clears `g:colors_name`, so it no longer treats the theme as loaded.

### Install

With [lazy.nvim](https://lazy.folke.io/spec), load it at startup before other plugins:

```lua
{
  "viraj-s15/oxocarbon-grey",
  lazy = false,
  priority = 1000,
  config = function()
    vim.cmd.colorscheme("oxocarbon-grey")
  end,
}
```

`lazy = false` and `priority = 1000` make the theme load first, so other plugins that read highlight groups at startup see its colours.

With Neovim 0.12's built-in plugin manager:

```lua
vim.pack.add({ "https://github.com/viraj-s15/oxocarbon-grey" })
vim.cmd.colorscheme("oxocarbon-grey")
```

Neovim only reads `colors/` and `lua/` from the repository. The VS Code and Zed files are ignored.

### Options

The theme works without calling `setup()`. To change it, call `setup()` before `:colorscheme`:

```lua
require("oxocarbon_grey").setup({
  italic = true, -- false removes every italic
  bold = true, -- false removes every bold
  overrides = {}, -- highlight groups to replace, or a function(palette) returning them
})
vim.cmd.colorscheme("oxocarbon-grey")
```

- An override replaces the whole group, as `nvim_set_hl` does. For example, `overrides = { Comment = { fg = "#8d9199", italic = true } }`. Overrides are applied after `italic` and `bold`, so an override can bring an italic back.
- A function receives a copy of the generated palette, with `grey`, `accent`, `syntax` and `ansi` tables: `overrides = function(c) return { CursorLine = { bg = c.grey.bgFloat } } end`. The palette is also available as `require("oxocarbon_grey.palette")`.
- An invalid group definition is reported with `vim.notify`, and the rest of the theme still loads.
- Each `setup()` call starts again from the defaults, so a later call does not inherit options from an earlier one.
- `setup()` only stores the options. Run `:colorscheme oxocarbon-grey` afterwards to apply them.

### Plugins

The theme styles exactly three plugins. All of them are optional, and the theme loads the same way whether or not they are installed.

- [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim): the picker floats on the same surface as other floating windows, with blue matches and a grey selection.
- [gitsigns.nvim](https://github.com/lewis6991/gitsigns.nvim): green added, blue changed and pink deleted signs, inline word diffs and current-line blame.
- [blink.cmp](https://github.com/saghen/blink.cmp): the completion menu, documentation and signature windows, matched characters and colours for each completion kind.

The group names were taken from the plugins' own highlight definitions: telescope.nvim `40aedd8`, gitsigns.nvim `070a5d7` and blink.cmp `8219b58`. Other plugins, nvim-cmp included, are not styled by the theme. Most of them link their groups to core groups such as `Pmenu`, `NormalFloat`, `Special` and `DiagnosticError`, so they pick up the theme's colours that way.

### Tree-sitter and semantic tokens

Without Tree-sitter, the theme styles Vim's regex syntax groups (`Keyword`, `Function`, `Type`, …), so it is usable in any buffer.

Neovim ships Tree-sitter parsers only for C, Lua, Markdown, Vimscript, Vim help and Tree-sitter queries. For Python, Rust, TypeScript and C++ you need the parsers and highlight queries from [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter): its `main` branch for Neovim 0.12, its `master` branch for 0.10 and 0.11. The `main` branch does not start highlighting by itself. Call `vim.treesitter.start()` from a `FileType` autocommand, as its README describes.

Language servers that send semantic tokens add a layer on top. Neovim enables semantic highlighting by default. The theme styles the standard token types, plus the extra types and modifiers that the VS Code theme handles for rust-analyzer, basedpyright, the TypeScript server and clangd. `@lsp.type.variable` is cleared rather than linked to `@variable`. Without that, every variable token would paint over the Tree-sitter colour underneath it, so built-ins, constants and fields would lose their colours. The theme does not change your LSP or diagnostic configuration.

What you see depends on your parsers and language servers. The theme cannot recreate every distinction the VS Code theme makes:

- **Without a language server:**
  - Function and method definitions are not bold.
  - Rust method calls are rose like other calls, because nvim-treesitter captures them as `@function.call`.
  - Rust `#[derive(...)]` attributes are cyan like macros, rather than green.
  - Rust `unsafe` is cyan, rather than pink bold. The apostrophe of a lifetime is cyan, because it shares a capture with `pub` and `dyn`.
  - C++ macro calls such as `CHECK(...)` are sky like constructor calls, because nvim-treesitter captures capitalised calls as constructors.
- **Keyword captures.** nvim-treesitter puts JavaScript and TypeScript `const`, `let`, `static` and `break` under one `@keyword` capture, so `break` is cyan rather than blue italic. C++ `default` and `goto` are cyan for the same reason. In C++, `auto` is captured as a built-in type, so it is sky italic.
- **Built-in globals.** JavaScript and TypeScript `console`, `window` and `document` are pink italic like `this`, because they share `@variable.builtin`. With a TypeScript language server they turn teal, and stay italic.
- **Semantic token combinations.** Neovim matches one modifier at a time (`@lsp.typemod.<type>.<modifier>`), so VS Code rules that need two modifiers cannot be expressed. Under clangd, C++ `static constexpr` members take the field colour and namespace-scope `constexpr` values stay variable-coloured, rather than turning cobalt. Python `@property` getters and upper-case class attributes are not told apart from other properties. When a token carries two modifiers that each set a colour, such as a read-only standard-library value in Python, Neovim applies them in no fixed order. Definitions only add bold, so they never compete for colour.
- **Italic and bold underneath semantic tokens.** Neovim combines italic and bold from Tree-sitter and semantic tokens rather than replacing them. A token that is italic in Tree-sitter, such as Rust `use`, stays italic when rust-analyzer recolours it.

### Approximations

Neovim highlight colours have no alpha channel. Where the VS Code and Zed themes use a translucent colour, the Neovim theme uses an opaque one:

- The 5% white hairline becomes `#27282a`, its colour over the editor background. The generator does this for every translucent palette colour.
- Search matches, matching brackets, symbol references and diff lines use their accent colour blended into the background, at the strength the VS Code theme uses. Diagnostic virtual text, which VS Code lacks, uses an 8% tint.
- The current search match is solid sky with dark text, rather than translucent sky with a border.
- The selection (`Visual`) is opaque `#33353b`. Neovim draws it over search matches, so matches inside a selection are not visible.

### Review an unmerged branch

These steps leave your own Neovim configuration, plugins and data untouched.

1. Check out the branch. For a pull request, fetch it by number:

   ```sh
   git clone https://github.com/viraj-s15/oxocarbon-grey
   cd oxocarbon-grey
   git fetch origin pull/<number>/head:neovim-review
   git switch neovim-review
   ```

2. Optional, for Tree-sitter colours: build the pinned parsers once with `npm run test:neovim:fixtures`, or with `nvim --clean --headless -l tests/neovim/deps.lua` if you don't have npm. This needs Neovim 0.12, git and a C compiler, and writes only to `.cache/neovim/` inside the checkout. With older Neovim, or without the parsers, the review configuration shows a warning and uses Vim syntax colours.
3. Start Neovim with the review configuration:

   ```sh
   nvim --clean -u tests/neovim/review.lua fixtures/inventory.py
   ```

   `--clean` skips your config, plugins and ShaDa file. `tests/neovim/review.lua` puts the checkout on the runtime path, uses the parsers from step 2 if they exist, turns on line numbers, the cursor line and a colour column, and loads the theme.

The review configuration has no language servers, so it shows Tree-sitter colours only. To see semantic tokens, or the colours with your own plugins, point your plugin manager at the checkout:

```lua
{
  dir = "~/path/to/oxocarbon-grey",
  name = "oxocarbon-grey",
  lazy = false,
  priority = 1000,
  config = function()
    vim.cmd.colorscheme("oxocarbon-grey")
  end,
}
```

To review the branch without a local clone, use `"viraj-s15/oxocarbon-grey"` with `branch = "<branch-name>"` in place of `dir` and `name`. Remove the entry after reviewing.

### Review checklist

Compare with the VS Code previews above. `:Inspect` shows which Tree-sitter captures, semantic tokens and highlight groups style the text under the cursor.

- **Syntax** in `inventory.py`, `cache.rs`, `TaskBoard.tsx` and `matrix.cpp`, with parsers. Check each of these:
  - Comments: grey italic. Rust doc comments: a step brighter.
  - Strings: purple, with ice escapes. Python docstrings: italic.
  - Keywords: blue, with control flow (`if`, `return`, `match`, `for`) and imports in italic.
  - Declaration keywords: cyan. That covers `def`/`class`/`lambda`, Rust `fn`/`let`/`impl`/`pub`, TypeScript `const`/`function`/`interface`, and C++ `class`/`template`/`constexpr`.
  - Types: sky. Built-in types are italic.
  - Functions: rose. Methods: teal. Properties and fields: ice.
  - Parameters: italic. `self`/`this`/`cls`: pink italic.
  - Constants and Rust `Some`/`Ok`: cobalt. `None`/`null`/`true`: teal italic.
  - Decorators: green. Macros and `#include`/`#define`: cyan. Lifetimes: grey italic.
- **Semantic tokens**, in your own config with language servers: method definitions teal bold, function definitions rose bold, enum members cobalt, Python constants cobalt, Rust mutable bindings underlined.
- **Selection and search:**
  - `V` selects in grey.
  - `/item` tints every match cyan, and the current match is solid sky.
  - `%` on a bracket highlights the matching one in blue.
- **Floating windows and completion:**
  - In insert mode, <kbd>ctrl-n</kbd> opens the completion menu: one step lighter, with a grey selection and blue matched characters (Neovim 0.11+).
  - Other floating windows use the same lighter surface, with a muted border.
- **Diagnostics.** `:ReviewDiagnostics` adds one error, warning, info and hint to the first four lines. Check that:
  - errors are pink, warnings purple, info blue and hints teal;
  - the undercurls, virtual text and signs use those colours;
  - `:lua vim.diagnostic.open_float()` shows a float with the same colours.
- **Diffs:**
  1. `cp fixtures/cache.rs /tmp/cache.rs`.
  2. Edit the copy.
  3. Run `nvim --clean -u tests/neovim/review.lua -d fixtures/cache.rs /tmp/cache.rs`.

  Added lines are green-tinted, changed lines blue with a stronger blue on the changed text, and deleted lines pink.
- **Editor chrome:**
  - `:split` and `:tabnew` show the status lines, the hairline split and the tab line.
  - `:set winbar=%f` shows the winbar.
  - `:set list` shows whitespace.
  - `:set spell` shows spelling undercurls.
- **Terminal.** Run this in `:terminal` to show the 16 ANSI colours. Yellow (3 and 11) is purple on purpose.

  ```sh
  for i in $(seq 0 15); do printf '\e[38;5;%sm %2s ' "$i" "$i"; done; printf '\e[0m\n'
  ```
- **Plugins**, if you use them: a Telescope picker, Gitsigns signs and inline diffs, and the blink.cmp menu.

### Development

```sh
npm run build:neovim          # regenerate lua/oxocarbon_grey/palette.lua
npm run check                 # Node only; includes the Neovim palette freshness check
npm run test:neovim           # headless Neovim tests; needs nvim on PATH
npm run test:neovim:fixtures  # fixture highlighting with pinned parsers; Neovim 0.12, git, C compiler
```

`npm run check` fails if `lua/oxocarbon_grey/palette.lua` is missing or does not match `src/palette.mjs`, without rewriting it. The Lua highlight definitions in `lua/oxocarbon_grey/groups/` are written by hand.

`npm run test:neovim` runs `tests/neovim/run.lua` in `nvim --clean`. It checks that:
- the checkout alone on the runtime path provides the colorscheme;
- editor, syntax, Tree-sitter, semantic, diagnostic and terminal colours match the palette;
- links resolve;
- every capture, semantic token type and diagnostic group documented by the running Neovim has a style;
- code stays readable on selections, search matches and diff lines;
- reapplying, switching away and back, and loading after a dark-only built-in scheme on a light background all give the same highlights;
- the options behave as documented, including the errors for invalid options and overrides.

`npm run test:neovim:fixtures` builds the parsers into `.cache/neovim/` (git-ignored) from nvim-treesitter `910fdf6` and the parser revisions it pins. It then:
- checks the colour of about 140 tokens in the four fixtures;
- checks that every capture in those languages' highlight queries has a style.

It does not run language servers.

## Ghostty

[`ghostty/oxocarbon-grey`](ghostty/oxocarbon-grey) is a custom theme for [Ghostty](https://ghostty.org). It is distributed by this repository and is not one of Ghostty's built-in themes. Ghostty's built-in `Oxocarbon` is a different theme. The file is generated from `src/palette.mjs` and committed, so installing it needs neither Node nor the generator.

It sets only colours:
- background and foreground;
- cursor and selection;
- the 16 ANSI colours, `palette = 0` to `palette = 15`.

They match the VS Code theme's terminal:
- The cursor is the text colour, with the background colour for the character under it.
- The selection is VS Code's 20% blue selection mixed into the background (`#2e384c`, since Ghostty colours have no alpha), with white text.
- Oxocarbon has no yellow, so ANSI yellow (3 and 11) is purple.

### Install

Ghostty finds a theme by name in `$XDG_CONFIG_HOME/ghostty/themes`, which is `~/.config/ghostty/themes` when `XDG_CONFIG_HOME` is unset. That is also the folder on macOS. Ghostty reads its main config from `~/Library/Application Support/com.mitchellh.ghostty/` on macOS, but it does not look for themes there.

Download the file. The `[ -e … ] ||` part skips the download if a file with that name already exists:

```sh
dir="${XDG_CONFIG_HOME:-$HOME/.config}/ghostty/themes"
mkdir -p "$dir"
[ -e "$dir/oxocarbon-grey" ] || curl -fsSL -o "$dir/oxocarbon-grey" \
  https://viraj-s15.github.io/oxocarbon-grey/ghostty/oxocarbon-grey
```

Or copy it from a clone. `cp -n` does not overwrite an existing file:

```sh
git clone https://github.com/viraj-s15/oxocarbon-grey
cd oxocarbon-grey
dir="${XDG_CONFIG_HOME:-$HOME/.config}/ghostty/themes"
mkdir -p "$dir"
cp -n ghostty/oxocarbon-grey "$dir/"
```

For a pull request that has not been merged yet, run `git fetch origin pull/<number>/head:ghostty-review && git switch ghostty-review` before the `cp`. To replace an older copy, move it aside first: `mv "$dir/oxocarbon-grey" "$dir/oxocarbon-grey.bak"`.

### Turn it on

1. Open your Ghostty config:
   - **macOS:** choose **Settings…** in the Ghostty menu, or press <kbd>cmd-,</kbd>. Ghostty opens `~/Library/Application Support/com.mitchellh.ghostty/config.ghostty` if it exists, then `~/.config/ghostty/config.ghostty` if that exists. If neither exists, it creates the first one. Ghostty loads both files if both exist, and the Application Support one wins on conflicts. Before Ghostty 1.2.3 the file is named `config`, without an extension.
   - **Linux:** `$XDG_CONFIG_HOME/ghostty/config.ghostty`, usually `~/.config/ghostty/config.ghostty`.
2. Add this line. If the file already has a `theme = …` line, change only that line. To keep the old value, comment it out with `#` on its own line. Leave the rest of the file as it is.

   ```ini
   theme = oxocarbon-grey
   ```

3. Reload the config with <kbd>cmd-shift-,</kbd> on macOS, <kbd>ctrl-shift-,</kbd> on Linux, or **Reload Configuration** in the macOS Ghostty menu.

Ghostty loads the theme before your config, so colour settings in your config win. If your config sets `background`, `foreground`, `palette`, `cursor-color`, `cursor-text`, `selection-background` or `selection-foreground`, comment those lines out to see the theme's colours.

`ghostty +validate-config` checks your config, including the theme lookup. If the file is in the wrong folder, it prints `theme "oxocarbon-grey" not found` with the paths it tried. On macOS, run the CLI from the app bundle if `ghostty` is not on your `PATH`:

```sh
/Applications/Ghostty.app/Contents/MacOS/ghostty +validate-config
```

### Remove

1. Delete the `theme = oxocarbon-grey` line, or restore your previous `theme` line.
2. Reload the config.
3. Delete the file:

   ```sh
   rm "${XDG_CONFIG_HOME:-$HOME/.config}/ghostty/themes/oxocarbon-grey"
   ```

### Preview the colours

```sh
sh ghostty/preview.sh
```

The script prints:
- the normal and bright ANSI colours, plus bold and italic;
- the normal background colours with default text, and the bright ones with black text;
- the basic text styles;
- a few sample shell, test and compiler messages.

It only writes to the terminal, and resets all styling when it finishes or is interrupted.

The theme changes programs that use the 16 ANSI colours: shells, `ls`, `git` and compilers. Programs that set their own 24-bit colours draw those instead. That includes Neovim with `termguicolors` on and this repository's colorscheme.

### Development

```sh
npm run build:ghostty   # regenerate ghostty/oxocarbon-grey
npm run check           # includes the freshness check and the Ghostty tests
npm run check:ghostty   # ghostty +validate-config on the file; needs ghostty on PATH
```

`npm run check` fails if `ghostty/oxocarbon-grey` is missing or does not match `src/palette.mjs`, without rewriting it. Its tests check that:
- the file sets only the colour keys above;
- the palette has entries 0 to 15 exactly once, in ANSI order, from the shared palette;
- the output is deterministic;
- the website's download is byte for byte the same file.

`ghostty +validate-config --config-file=<path>` loads only that file, not your own config. The theme was validated this way with Ghostty 1.3.0 on Linux (Ubuntu's `ghostty 1.3.0~us1-0ubuntu1` package), which also resolved `theme = oxocarbon-grey` from `$XDG_CONFIG_HOME/ghostty/themes`. CI runs the structural tests only, not Ghostty itself.

## Website

The theme's website is a single static page in [`site/`](site), deployed with GitHub Pages to <https://viraj-s15.github.io/oxocarbon-grey/>. The code samples on it are excerpts of the files in [`fixtures/`](fixtures), coloured the way the Neovim port draws them with Tree-sitter. Pointing at a colour in the legend fades out every token that does not use it.

- `site/specimens.lua` runs in headless Neovim with the pinned parsers and writes `site/specimens.json`, which is committed. Run `npm run build:specimens` after changing the Neovim highlight groups or the fixtures. `npm run test:neovim:fixtures` fails if the file is out of date.
- `site/build.mjs` fills `site/index.html` with the specimens, the legend, the terminal colours and the palette from `src/palette.mjs`, and writes the page to `_site/` (git-ignored). It copies `ghostty/oxocarbon-grey` to `_site/ghostty/oxocarbon-grey` for the download. It needs only Node.
- The terminal on the page is drawn by the browser from the Ghostty theme's colours. It is not a screenshot.

To preview it locally:

```sh
npm run build:site
python3 -m http.server -d _site 8000   # then open http://localhost:8000
```

### Deployment

`.github/workflows/pages.yml` runs only on pushes to `main`. It runs `npm run check`, builds `_site/` and deploys it once the build succeeds. The deploy job also checks that the run is a push to `main`. Only the deploy job gets the `pages: write` and `id-token: write` permissions. The live website updates only after changes reach `main`. Feature branches and pull requests never deploy. Pull requests run the checks in `check.yml`, and the website can be previewed locally as described above.

The workflow cannot turn GitHub Pages on by itself. A repository admin has to set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** once. This creates the `github-pages` environment, which allows the default branch, `main`. Until it is set, the workflow's `configure-pages` step fails. The deploy job's summary links to the live site.

## Build

Colours live in `src/palette.mjs`. `src/ui.mjs`, `src/tokens.mjs` and `src/semantic.mjs` map them for VS Code; `src/zed/` maps them for Zed; `src/neovim/` generates the Neovim palette, which `lua/oxocarbon_grey/groups/` maps; `src/ghostty/` generates the Ghostty theme.

```sh
npm run build             # VS Code theme, icon, zed/, the Neovim palette and the Ghostty theme
npm run build:zed         # zed/ only
npm run build:neovim      # lua/oxocarbon_grey/palette.lua only
npm run build:ghostty     # ghostty/oxocarbon-grey only
npm run build:site        # the website, into _site/
npm run build:specimens   # site/specimens.json; needs Neovim 0.12 and the fixture parsers
npm run check             # committed output is up to date; Zed, Neovim palette, Ghostty and website checks and tests
npm run check:zed-schema  # zed/ theme against Zed's JSON schema (ajv-cli via npx)
npm run check:ghostty     # Ghostty's own validation of ghostty/oxocarbon-grey; needs ghostty
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
