// Zed UI colours, mapped by hand from the VS Code workbench colours in
// src/ui.mjs. Keys are Zed theme properties (schema v0.2.0), not VS Code keys.
//
// Every colour property the schema offers is set explicitly: Zed fills unset
// properties from its own One Dark defaults, which would leak foreign colours
// into the theme. `npm run check` fails if a property is missing.
import { grey as g, accent as a, ansi } from '../palette.mjs';
import { alpha, mix, transparent } from './color.mjs';

const accent = a.blue;
const warning = a.purple; // oxocarbon.nvim uses purple for warnings
const surface = g.bg; // one flat surface, as in VS Code
const hairline = g.hairline;
const focus = alpha(accent, 0.6); // VS Code focusBorder

// Zed has dim ANSI colours, VS Code does not: mix each colour 70/30 into the background.
const dim = (hex) => mix(hex, g.bg, 0.7);

export const colors = {
  // Borders. VS Code separates every part with a 5% white hairline.
  border: hairline,
  'border.variant': hairline,
  'border.focused': focus,
  'border.selected': accent,
  'border.transparent': transparent,
  'border.disabled': hairline,

  // Surfaces: the window, panels and editor share one background; menus,
  // popovers and dialogs float one step lighter.
  background: surface,
  'surface.background': surface,
  'elevated_surface.background': g.bgFloat,

  // Elements (buttons, inputs) sit on bgFloat. Ghost elements (list rows, menu
  // items, icon buttons) are transparent and must show on both bg and bgFloat,
  // so their states use translucent white.
  'element.background': g.bgFloat,
  'element.hover': g.bgSelection,
  'element.active': alpha(accent, 0.25),
  'element.selected': g.bgSelection,
  'element.disabled': g.bgFloat,
  'element.selection_background': alpha(accent, 0.35),
  'ghost_element.background': transparent,
  'ghost_element.hover': alpha(g.fg, 0.06),
  'ghost_element.active': alpha(g.fg, 0.1),
  'ghost_element.selected': g.bgSelection,
  'ghost_element.disabled': transparent,
  'drop_target.background': alpha(accent, 0.15),
  'drop_target.border': accent,

  // Text and icons
  text: g.fg,
  'text.muted': g.fgMuted,
  'text.placeholder': g.fgSubtle,
  'text.disabled': g.fgSubtle,
  'text.accent': accent,
  icon: g.fgMuted,
  'icon.muted': g.fgSubtle,
  'icon.disabled': g.lineNr,
  'icon.placeholder': g.fgSubtle,
  'icon.accent': accent,
  'link_text.hover': a.ice,
  'debugger.accent': a.pink, // VS Code debugIcon.breakpointForeground

  // Bars, tabs, panels. Zed has no accent line on the active tab; the active
  // tab is told apart by brighter text and the missing bottom hairline.
  'title_bar.background': surface,
  'title_bar.inactive_background': surface,
  'status_bar.background': surface,
  'toolbar.background': surface,
  'tab_bar.background': surface,
  'tab.active_background': surface,
  'tab.inactive_background': surface,
  'panel.background': surface,
  'panel.focused_border': focus,
  'panel.indent_guide': g.guide,
  'panel.indent_guide_hover': g.fgSubtle,
  'panel.indent_guide_active': g.lineNr,
  'panel.overlay_background': surface,
  'panel.overlay_hover': g.bgFloat,
  'pane.focused_border': focus,
  'pane_group.border': hairline,

  // Scrollbars and minimap (VS Code scrollbarSlider.* and minimapSlider.*)
  'scrollbar.thumb.background': alpha(g.fgSubtle, 0.25),
  'scrollbar.thumb.hover_background': alpha(g.fgSubtle, 0.4),
  'scrollbar.thumb.active_background': alpha(g.fgSubtle, 0.55),
  'scrollbar.thumb.border': transparent,
  'scrollbar.track.background': transparent,
  'scrollbar.track.border': transparent,
  'minimap.thumb.background': alpha(g.fgSubtle, 0.15),
  'minimap.thumb.hover_background': alpha(g.fgSubtle, 0.25),
  'minimap.thumb.active_background': alpha(g.fgSubtle, 0.35),
  'minimap.thumb.border': transparent,

  // Search: every match vs the current match (VS Code findMatchHighlight / findMatch)
  'search.match_background': alpha(a.cyan, 0.2),
  'search.active_match_background': alpha(a.sky, 0.4),

  // Editor
  'editor.background': surface,
  'editor.foreground': g.fg,
  'editor.gutter.background': surface,
  'editor.subheader.background': g.bgFloat, // multibuffer excerpt headers
  'editor.active_line.background': g.bgLine,
  'editor.highlighted_line.background': alpha(accent, 0.08), // VS Code rangeHighlight
  'editor.debugger_active_line.background': alpha(warning, 0.15),
  'editor.line_number': g.lineNr,
  'editor.active_line_number': g.lineNrActive,
  'editor.hover_line_number': g.fgMuted,
  'editor.invisible': alpha(g.lineNr, 0.6), // VS Code editorWhitespace
  'editor.wrap_guide': g.guide, // VS Code editorRuler
  'editor.active_wrap_guide': g.lineNr,
  'editor.indent_guide': g.guide,
  'editor.indent_guide_active': g.lineNr,
  'editor.document_highlight.read_background': alpha(accent, 0.15), // wordHighlight
  'editor.document_highlight.write_background': alpha(a.rose, 0.18), // wordHighlightStrong
  'editor.document_highlight.bracket_background': alpha(accent, 0.18), // bracketMatch
  'editor.code_lens.foreground': g.fgSubtle,

  // Diff hunks in the editor. Zed draws staged hunks hollow and unstaged ones
  // filled; these are the opacities Zed itself derives for dark themes.
  'editor.diff_hunk.added.background': alpha(a.green, 0.12),
  'editor.diff_hunk.added.hollow_background': alpha(a.green, 0.06),
  'editor.diff_hunk.added.hollow_border': alpha(a.green, 0.36),
  'editor.diff_hunk.deleted.background': alpha(a.pink, 0.12),
  'editor.diff_hunk.deleted.hollow_background': alpha(a.pink, 0.06),
  'editor.diff_hunk.deleted.hollow_border': alpha(a.pink, 0.36),

  // Version control (VS Code gitDecoration.*, diffEditor.*, merge.*)
  'version_control.added': a.green,
  'version_control.deleted': a.pink,
  'version_control.modified': accent,
  'version_control.renamed': a.cyan,
  'version_control.conflict': warning,
  'version_control.ignored': g.fgSubtle,
  'version_control.word_added': alpha(a.green, 0.18),
  'version_control.word_deleted': alpha(a.pink, 0.18),
  'version_control.conflict_marker.ours': alpha(a.green, 0.12),
  'version_control.conflict_marker.theirs': alpha(accent, 0.12),

  // Terminal
  'terminal.background': surface,
  'terminal.foreground': g.fg,
  'terminal.bright_foreground': g.fg,
  'terminal.dim_foreground': g.fgMuted,
  'terminal.ansi.background': surface,
  'terminal.ansi.black': ansi.black,
  'terminal.ansi.red': ansi.red,
  'terminal.ansi.green': ansi.green,
  'terminal.ansi.yellow': ansi.yellow,
  'terminal.ansi.blue': ansi.blue,
  'terminal.ansi.magenta': ansi.magenta,
  'terminal.ansi.cyan': ansi.cyan,
  'terminal.ansi.white': ansi.white,
  'terminal.ansi.bright_black': ansi.brightBlack,
  'terminal.ansi.bright_red': ansi.brightRed,
  'terminal.ansi.bright_green': ansi.brightGreen,
  'terminal.ansi.bright_yellow': ansi.brightYellow,
  'terminal.ansi.bright_blue': ansi.brightBlue,
  'terminal.ansi.bright_magenta': ansi.brightMagenta,
  'terminal.ansi.bright_cyan': ansi.brightCyan,
  'terminal.ansi.bright_white': ansi.brightWhite,
  'terminal.ansi.dim_black': dim(ansi.black),
  'terminal.ansi.dim_red': dim(ansi.red),
  'terminal.ansi.dim_green': dim(ansi.green),
  'terminal.ansi.dim_yellow': dim(ansi.yellow),
  'terminal.ansi.dim_blue': dim(ansi.blue),
  'terminal.ansi.dim_magenta': dim(ansi.magenta),
  'terminal.ansi.dim_cyan': dim(ansi.cyan),
  'terminal.ansi.dim_white': dim(ansi.white),

  // Vim and Helix mode indicators: dark text on an accent chip.
  'vim.normal.background': accent,
  'vim.normal.foreground': g.bg,
  'vim.insert.background': a.green,
  'vim.insert.foreground': g.bg,
  'vim.replace.background': a.pink,
  'vim.replace.foreground': g.bg,
  'vim.visual.background': a.purple,
  'vim.visual.foreground': g.bg,
  'vim.visual_line.background': a.purple,
  'vim.visual_line.foreground': g.bg,
  'vim.visual_block.background': a.purple,
  'vim.visual_block.foreground': g.bg,
  'vim.helix_normal.background': accent,
  'vim.helix_normal.foreground': g.bg,
  'vim.helix_select.background': a.purple,
  'vim.helix_select.foreground': g.bg,
  'vim.yank.background': alpha(a.purple, 0.3),
  'vim.helix_jump_label.foreground': a.rose,
};

// Status colours: diagnostics, git status, file states. Each has a translucent
// background (inline diagnostics, banners) and a border.
const statusColor = (name, color) => ({
  [name]: color,
  [`${name}.background`]: alpha(color, 0.12),
  [`${name}.border`]: alpha(color, 0.5),
});

export const status = {
  ...statusColor('error', a.pink),
  ...statusColor('warning', warning),
  ...statusColor('info', accent),
  ...statusColor('hint', a.teal), // VS Code editorHint
  ...statusColor('success', a.green),
  ...statusColor('created', a.green),
  ...statusColor('modified', accent),
  ...statusColor('deleted', a.pink),
  ...statusColor('renamed', a.cyan),
  ...statusColor('conflict', warning),
  ...statusColor('ignored', g.fgSubtle),
  ...statusColor('hidden', g.fgSubtle),
  ...statusColor('unreachable', g.fgSubtle),
  ...statusColor('predictive', g.fgSubtle), // edit predictions, like VS Code ghost text
};

// Players: the first entry is you. Its cursor and selection match VS Code
// (light grey cursor, opaque grey selection); collaborators get accent colours.
const collaborator = (color) => ({ cursor: color, background: color, selection: alpha(color, 0.25) });
export const players = [
  { cursor: g.fg, background: accent, selection: g.bgSelection },
  collaborator(a.pink),
  collaborator(a.green),
  collaborator(a.purple),
  collaborator(a.cyan),
  collaborator(a.rose),
  collaborator(a.ice),
  collaborator(a.teal),
];

// Accents colour nested brackets and indent guides when colorization is on;
// same order as VS Code editorBracketHighlight.foreground1-6.
export const accents = [a.blue, a.purple, a.cyan, a.rose, a.ice, a.green];
