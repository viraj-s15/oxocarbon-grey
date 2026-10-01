return function(p)
  local g, s = p.grey, p.syntax

  local groups = {
    ["@variable"] = { fg = s.variable },
    ["@variable.builtin"] = { fg = s.self, italic = true },
    ["@variable.parameter"] = { fg = s.parameter, italic = true },
    ["@variable.parameter.builtin"] = { fg = s.self, italic = true },
    ["@variable.member"] = { fg = s.property },
    ["@property"] = { fg = s.property },

    ["@constant"] = { fg = s.constant },
    ["@constant.builtin"] = { fg = s.builtin, italic = true },
    ["@constant.macro"] = { fg = s.macro },
    ["@module"] = { fg = s.namespace },
    ["@module.builtin"] = { fg = s.namespace, italic = true },
    ["@label"] = { fg = s.label },

    ["@string"] = { fg = s.string },
    ["@string.documentation"] = { fg = s.string, italic = true },
    ["@string.regexp"] = { fg = s.regex },
    ["@string.escape"] = { fg = s.escape },
    ["@string.special"] = { fg = s.interpolation },
    ["@string.special.symbol"] = { fg = s.constant },
    ["@string.special.path"] = { fg = s.string },
    ["@string.special.url"] = { fg = s.property, underline = true },
    ["@character"] = { fg = s.string },
    ["@character.special"] = { fg = s.escape },

    ["@boolean"] = { fg = s.builtin, italic = true },
    ["@number"] = { fg = s.number },
    ["@number.float"] = { fg = s.number },

    ["@type"] = { fg = s.type },
    ["@type.builtin"] = { fg = s.type, italic = true },
    ["@type.definition"] = { fg = s.type },
    ["@attribute"] = { fg = s.decorator },
    ["@attribute.builtin"] = { fg = s.decorator },

    ["@function"] = { fg = s["function"] },
    ["@function.builtin"] = { fg = s.builtin },
    ["@function.call"] = { fg = s["function"] },
    ["@function.macro"] = { fg = s.macro },
    ["@function.method"] = { fg = s.method },
    ["@function.method.call"] = { fg = s.method },
    ["@constructor"] = { fg = s.type },
    ["@operator"] = { fg = s.operator },

    ["@keyword"] = { fg = s.keyword },
    ["@keyword.coroutine"] = { fg = s.keyword, italic = true },
    ["@keyword.function"] = { fg = s.storage },
    ["@keyword.operator"] = { fg = s.keyword, italic = true },
    ["@keyword.import"] = { fg = s.keyword, italic = true },
    ["@keyword.type"] = { fg = s.storage },
    ["@keyword.modifier"] = { fg = s.storage },
    ["@keyword.repeat"] = { fg = s.keyword, italic = true },
    ["@keyword.return"] = { fg = s.keyword, italic = true },
    ["@keyword.debug"] = { fg = s.unsafe },
    ["@keyword.exception"] = { fg = s.keyword, italic = true },
    ["@keyword.conditional"] = { fg = s.keyword, italic = true },
    ["@keyword.conditional.ternary"] = { fg = s.operator },
    ["@keyword.directive"] = { fg = s.macro },
    ["@keyword.directive.define"] = { fg = s.macro },

    ["@punctuation.delimiter"] = { fg = s.punctuation },
    ["@punctuation.bracket"] = { fg = s.punctuation },
    ["@punctuation.special"] = { fg = s.interpolation },

    ["@comment"] = { fg = s.comment, italic = true },
    ["@comment.documentation"] = { fg = s.docComment, italic = true },
    ["@comment.error"] = { fg = s.invalid, bold = true, italic = true },
    ["@comment.warning"] = { fg = p.accent.purple, bold = true, italic = true },
    ["@comment.todo"] = { fg = s.todo, bold = true, italic = true },
    ["@comment.note"] = { fg = p.accent.blue, bold = true, italic = true },

    ["@markup.strong"] = { fg = s.bold, bold = true },
    ["@markup.italic"] = { italic = true },
    ["@markup.strikethrough"] = { strikethrough = true },
    ["@markup.underline"] = { underline = true },
    ["@markup.heading"] = { fg = s.heading, bold = true },
    ["@markup.quote"] = { fg = g.fgMuted, italic = true },
    ["@markup.math"] = { fg = s.interpolation },
    ["@markup.link"] = { fg = s.link },
    ["@markup.link.label"] = { fg = s.link },
    ["@markup.link.url"] = { fg = s.property, underline = true },
    ["@markup.raw"] = { fg = s.string },
    ["@markup.raw.block"] = { fg = s.string },
    ["@markup.list"] = { fg = s.storage },
    ["@markup.list.checked"] = { fg = s.inserted },
    ["@markup.list.unchecked"] = { fg = g.fgMuted },

    ["@diff.plus"] = { fg = s.inserted },
    ["@diff.minus"] = { fg = s.deleted },
    ["@diff.delta"] = { fg = s.changed },

    ["@tag"] = { fg = s.tag },
    ["@tag.builtin"] = { fg = s.tag },
    ["@tag.attribute"] = { fg = s.attribute },
    ["@tag.delimiter"] = { fg = s.punctuation },

    -- The same capture means different things per language: plain @keyword is
    -- `let`/`impl` in Rust, `const`/`let` in JS/TS and `using`/`constexpr` in C++.
    ["@keyword.rust"] = { fg = s.storage },
    ["@keyword.import.rust"] = { fg = s.storage, italic = true },
    ["@keyword.javascript"] = { fg = s.storage },
    ["@keyword.typescript"] = { fg = s.storage },
    ["@keyword.tsx"] = { fg = s.storage },
    ["@keyword.cpp"] = { fg = s.storage },
    ["@keyword.import.c"] = { fg = s.macro },
    ["@keyword.import.cpp"] = { fg = s.macro },
    ["@constant.builtin.rust"] = { fg = s.constant },
    ["@attribute.rust"] = { fg = s.lifetime, italic = true },
    ["@attribute.builtin.rust"] = { fg = s.lifetime, italic = true },
  }

  for level = 1, 6 do
    groups["@markup.heading." .. level] = { fg = s.heading, bold = true }
  end

  return groups
end
