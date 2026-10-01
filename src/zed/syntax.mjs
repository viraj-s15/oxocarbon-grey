import { grey, accent, syntax as s } from '../palette.mjs';

const style = (color, ...flags) => {
  const out = { color };
  if (flags.includes('italic')) out.font_style = 'italic';
  if (flags.includes('bold')) out.font_weight = 700;
  return out;
};

// font_style and font_weight are only set when italic or bold, so a semantic token keeps the
// tree-sitter italic underneath it and the user's buffer_font_weight still applies.
export default {
  // Zed's `keyword` is control flow in Python but declarations in Rust and C++; blue keeps Python right.
  keyword: style(s.keyword),
  'keyword.control': style(s.keyword, 'italic'),
  'keyword.import': style(s.keyword, 'italic'),
  'keyword.declaration': style(s.storage),
  'keyword.definition': style(s.storage),
  'keyword.modifier': style(s.storage),
  'keyword.operator': style(s.keyword, 'italic'),
  'keyword.operator.regex': style(s.regex),
  'keyword.preproc': style(s.macro),
  preproc: style(s.macro),
  'keyword.directive': style(grey.fgMuted, 'italic'),
  'keyword.jsdoc': style(grey.fgMuted, 'italic'),

  operator: style(s.operator),
  punctuation: style(s.punctuation),
  'punctuation.bracket': style(s.punctuation),
  'punctuation.delimiter': style(s.punctuation),
  'punctuation.special': style(s.punctuation),
  'punctuation.list_marker': style(s.storage),
  'punctuation.markup': style(grey.fgMuted),
  'punctuation.bracket.regex': style(s.storage),
  embedded: style(s.variable),

  comment: style(s.comment, 'italic'),
  'comment.doc': style(s.docComment, 'italic'),
  'comment.documentation': style(s.docComment, 'italic'),

  string: style(s.string),
  'string.doc': style(s.string, 'italic'),
  'string.escape': style(s.escape),
  'string.regex': style(s.regex),
  'string.regexp': style(s.regex),
  'string.special': style(s.interpolation),
  'text.literal': style(s.string),

  number: style(s.number),
  constant: style(s.constant),
  'constant.builtin': style(s.builtin, 'italic'),
  boolean: style(s.builtin, 'italic'),
  'type.enum.member': style(s.constant),
  variant: style(s.constant),

  variable: style(s.variable),
  'variable.parameter': style(s.parameter, 'italic'),
  'function.kwargs': style(s.parameter, 'italic'),
  'variable.special': style(s.self, 'italic'),
  'variable.builtin': style(s.self, 'italic'),
  'variable.jsdoc': style(grey.fgMuted, 'italic'),
  property: style(s.property),
  'attribute.special': style(s.builtin),
  label: style(s.label),
  lifetime: style(s.lifetime, 'italic'),

  function: style(s.function),
  'function.definition': style(s.function, 'bold'),
  'function.builtin': style(s.builtin),
  'function.method': style(s.method),
  'function.special': style(s.macro),
  'function.macro': style(s.macro),
  'function.decorator': style(s.decorator),
  constructor: style(s.storage),

  type: style(s.type),
  'type.builtin': style(s.type, 'italic'),
  'type.class': style(s.type),
  'type.class.builtin': style(s.type, 'italic'),
  'type.interface': style(s.type, 'italic'),
  'type.parameter': style(s.type, 'italic'),
  'type.definition': style(s.type),
  'type.interface.definition': style(s.type, 'italic'),
  'type.parameter.definition': style(s.type, 'italic'),
  concept: style(s.type, 'italic'),
  'type.unit': style(s.number),
  'type.jsdoc': style(grey.fgMuted, 'italic'),
  namespace: style(s.namespace),
  module: style(s.namespace),

  attribute: style(s.decorator),
  'attribute.jsx': style(s.attribute),

  tag: style(s.tag),
  'tag.component': style(s.type),
  'tag.doctype': style(grey.fgMuted),
  text: style(s.variable),

  'selector.class': style(s.type),
  'selector.id': style(accent.rose),
  'selector.pseudo': style(s.method),
  charset: style(s.keyword),
  import: style(s.keyword),
  keyframes: style(s.keyword),
  media: style(s.keyword),
  supports: style(s.keyword),

  title: style(s.heading, 'bold'),
  emphasis: style(s.variable, 'italic'),
  'emphasis.strong': style(s.bold, 'bold'),
  strikethrough: style(grey.fgMuted),
  link_text: style(s.link),
  link_uri: style(s.property),

  'diff.plus': style(s.inserted),
  'diff.minus': style(s.deleted),
  'diff.delta': style(s.changed),

  hint: { color: grey.fgSubtle, background_color: grey.bgFloat },
};
