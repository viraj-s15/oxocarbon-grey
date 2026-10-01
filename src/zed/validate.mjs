import { readFileSync } from 'node:fs';
import { contrast } from '../contrast.mjs';

// theme-schema.json: `cargo run -p schema_generator -- theme` in zed-industries/zed@40180d9c40e2.

const schema = JSON.parse(readFileSync(new URL('./theme-schema.json', import.meta.url), 'utf8'));
const defs = schema.$defs;
const styleProps = defs.ThemeStyleContent.properties;
const structured = new Set(['accents', 'players', 'syntax', 'background.appearance']);
const colorPattern = new RegExp(defs.Color.pattern);

// Captures in Zed's Python, Rust, TypeScript, TSX and C++ highlights.scm at the same commit.
const captures = `attribute attribute.builtin attribute.jsx attribute.special boolean comment
  comment.doc concept constant constant.builtin constructor embedded function function.builtin
  function.call function.decorator function.decorator.call function.definition function.kwargs
  function.method function.method.call function.method.constructor function.special
  function.special.definition keyword keyword.control keyword.declaration keyword.definition
  keyword.import keyword.operator keyword.operator.regex keyword.preproc label lifetime module
  namespace number operator operator.spaceship preproc property property.name punctuation.bracket
  punctuation.bracket.jsx punctuation.delimiter punctuation.delimiter.jsx punctuation.special string
  string.doc string.escape string.regex string.special tag.component.jsx tag.jsx text.jsx type
  type.builtin type.class type.class.builtin type.class.call type.class.definition
  type.class.inheritance type.interface type.name variable variable.builtin variable.parameter
  variable.special`.split(/\s+/);

const semanticStyles = [
  ['namespace', 'module', 'type'],
  ['type.class.definition', 'type.definition'],
  ['type.class', 'class', 'type'],
  ['type.enum.definition', 'type.definition'],
  ['type.enum', 'enum', 'type'],
  ['type.interface.definition', 'type.definition'],
  ['type.interface', 'interface', 'type'],
  ['type.struct.definition', 'type.definition'],
  ['type.struct', 'struct', 'type'],
  ['type.parameter.definition', 'type.definition'],
  ['type.parameter', 'type'],
  ['type.definition'],
  ['type'],
  ['variable.parameter'],
  ['constant.builtin'],
  ['variable.builtin'],
  ['constant'],
  ['variable'],
  ['property'],
  ['type.enum.member', 'type.enum', 'variant'],
  ['function.decorator', 'function.annotation', 'attribute'],
  ['function.builtin'],
  ['function'],
  ['function.method', 'function'],
  ['function.macro', 'function'],
  ['label'],
  ['comment.documentation', 'comment.doc'],
  ['comment'],
  ['string.doc'],
  ['string'],
  ['keyword'],
  ['number'],
  ['string.regexp', 'string'],
  ['operator'],
  ['keyword.modifier'],
  ['type.event', 'type'],
  ['punctuation.bracket'],
  ['punctuation'],
  ['attribute', 'decorator'],
  ['boolean'],
  ['text.literal'],
  ['string.escape'],
  ['string.special'],
  ['lifetime'],
  ['variable.special'],
];

const checkManifest = (m) => {
  const problems = [];
  if (!/^[a-z0-9-]+$/.test(m.id)) problems.push(`id "${m.id}" must be lowercase kebab-case`);
  if (/zed|extension/.test(m.id)) problems.push(`id "${m.id}" must not contain "zed" or "extension"`);
  if (!m.id.endsWith('-theme')) problems.push(`id "${m.id}" should end in -theme for a theme extension`);
  if (/^Zed |\bZed$/.test(m.name) || /extension/i.test(m.name)) problems.push(`name "${m.name}" must not mention Zed or "extension"`);
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(m.version)) problems.push(`version "${m.version}" must be major.minor.patch`);
  if (m.schema_version !== 1) problems.push('schema_version must be 1');
  if (!m.description || m.description.trim().length <= m.name.trim().length) problems.push('description must be longer than the name');
  if (!m.authors?.some((a) => a.trim())) problems.push('authors must not be empty');
  try {
    const url = new URL(m.repository);
    if (url.protocol !== 'https:') problems.push('repository must be an https URL');
  } catch {
    problems.push(`repository "${m.repository}" is not a valid URL`);
  }
  return problems;
};

const mitPatterns = [
  /Copyright/i,
  /Permission is hereby granted, free of charge, to any person obtaining a copy/i,
  /The above copyright notice and this permission notice shall be included in all/i,
  /THE SOFTWARE IS PROVIDED ["“]AS IS["”], WITHOUT WARRANTY OF ANY KIND, EXPRESS OR/i,
];

const has = (obj, key) => Object.hasOwn(obj, key);
const opaque = (hex) => /^#[0-9a-f]{6}(ff)?$/i.test(hex ?? '');

export function validate({ theme, manifest, license }) {
  const problems = [...checkManifest(manifest)];
  const licenseText = license.replace(/\s+/g, ' ');
  if (!mitPatterns.every((p) => p.test(licenseText))) problems.push('LICENSE is not recognised as MIT');

  if (theme.themes.length !== 1) problems.push('expected exactly one theme');
  const [t] = theme.themes;
  if (t.name !== manifest.name || theme.name !== manifest.name) problems.push('theme and family must be named after the extension');
  if (t.appearance !== 'dark') problems.push('appearance must be dark');
  const style = t.style;

  for (const [key, value] of Object.entries(style)) {
    if (!has(styleProps, key)) problems.push(`unknown style property "${key}"`);
    else if (styleProps[key].deprecated) problems.push(`deprecated style property "${key}"`);
    else if (!structured.has(key) && !colorPattern.test(value)) problems.push(`${key}: "${value}" is not a colour`);
  }
  if (!defs.WindowBackgroundContent.enum.includes(style['background.appearance'])) problems.push('invalid background.appearance');

  for (const [key, prop] of Object.entries(styleProps)) {
    if (!structured.has(key) && !prop.deprecated && !has(style, key)) problems.push(`missing style property "${key}"`);
  }

  const players = Array.isArray(style.players) ? style.players : [];
  const accents = Array.isArray(style.accents) ? style.accents : [];
  const syntax = style.syntax && typeof style.syntax === 'object' ? style.syntax : {};
  if (players.length !== 8) problems.push(`expected 8 players, got ${players.length}`);
  players.forEach((p, i) => {
    for (const k of ['cursor', 'background', 'selection']) if (!colorPattern.test(p?.[k] ?? '')) problems.push(`players[${i}].${k} is not a colour`);
  });
  if (!accents.length) problems.push('missing accents');
  accents.forEach((c, i) => colorPattern.test(c) || problems.push(`accents[${i}] is not a colour`));

  const highlightProps = Object.keys(defs.HighlightStyleContent.properties);
  for (const [name, s] of Object.entries(syntax)) {
    for (const k of Object.keys(s)) if (!highlightProps.includes(k)) problems.push(`syntax.${name}: unknown field "${k}"`);
    if (!colorPattern.test(s.color ?? '')) problems.push(`syntax.${name}: missing or invalid color`);
    if (s.background_color !== undefined && !colorPattern.test(s.background_color)) problems.push(`syntax.${name}: invalid background_color`);
    if (s.font_style !== undefined && !defs.FontStyleContent.enum.includes(s.font_style)) problems.push(`syntax.${name}: invalid font_style`);
    if (s.font_weight !== undefined && !(s.font_weight >= 100 && s.font_weight <= 900)) problems.push(`syntax.${name}: invalid font_weight`);
  }
  const resolves = (capture) => {
    for (let name = capture; name; name = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : '') if (has(syntax, name)) return true;
    return false;
  };
  for (const c of captures) if (!resolves(c)) problems.push(`capture @${c} has no style`);
  for (const list of semanticStyles) if (!list.some((n) => has(syntax, n))) problems.push(`no style for semantic rule [${list.join(', ')}]`);

  const editorBgs = [style['editor.background'], style['editor.active_line.background']];
  const dim = new Set(['comment', 'hint']);
  for (const [name, s] of Object.entries(syntax)) {
    const min = dim.has(name) ? 3 : 4.5;
    const bgs = s.background_color ? [s.background_color] : editorBgs;
    for (const bg of bgs) {
      if (!opaque(s.color) || !opaque(bg)) {
        problems.push(`syntax.${name} must use opaque #rrggbb colours`);
        continue;
      }
      const ratio = contrast(s.color, bg);
      if (ratio < min) problems.push(`syntax.${name} ${s.color} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
    }
  }
  const ui = [
    ['text', 'background', 4.5],
    ['text', 'elevated_surface.background', 4.5],
    ['text.muted', 'background', 4.5],
    ['text.muted', 'elevated_surface.background', 4.5],
    ['text', 'element.selected', 4.5],
    ['text.placeholder', 'element.background', 3],
    ['text.accent', 'background', 4.5],
    ['editor.active_line_number', 'editor.active_line.background', 4.5],
    ['terminal.foreground', 'terminal.background', 4.5],
    ['vim.normal.foreground', 'vim.normal.background', 4.5],
    ['vim.insert.foreground', 'vim.insert.background', 4.5],
    ['vim.visual.foreground', 'vim.visual.background', 4.5],
  ];
  for (const [fg, bg, min] of ui) {
    if (!opaque(style[fg]) || !opaque(style[bg])) {
      problems.push(`contrast check ${fg} on ${bg} needs opaque colours`);
      continue;
    }
    const ratio = contrast(style[fg], style[bg]);
    if (ratio < min) problems.push(`${fg} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
  }
  return problems;
}
