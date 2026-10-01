return function(p)
  local g, s = p.grey, p.syntax

  return {
    Comment = { fg = s.comment, italic = true },
    SpecialComment = { fg = s.docComment, italic = true },
    Todo = { fg = s.todo, bold = true, italic = true },

    Constant = { fg = s.constant },
    String = { fg = s.string },
    Character = { fg = s.string },
    Number = { fg = s.number },
    Float = { fg = s.number },
    Boolean = { fg = s.builtin, italic = true },

    Identifier = { fg = s.variable },
    Function = { fg = s["function"] },

    Statement = { fg = s.keyword },
    Keyword = { fg = s.keyword },
    Conditional = { fg = s.keyword, italic = true },
    Repeat = { fg = s.keyword, italic = true },
    Exception = { fg = s.keyword, italic = true },
    Include = { fg = s.keyword, italic = true },
    Label = { fg = s.label },
    Operator = { fg = s.operator },

    PreProc = { fg = s.macro },
    Define = { fg = s.macro },
    Macro = { fg = s.macro },
    PreCondit = { fg = s.macro },

    Type = { fg = s.type },
    StorageClass = { fg = s.storage },
    Structure = { fg = s.storage },
    Typedef = { fg = s.storage },

    Special = { fg = s.interpolation },
    SpecialChar = { fg = s.escape },
    Tag = { fg = s.tag },
    Delimiter = { fg = s.punctuation },
    Debug = { fg = s.unsafe },

    Underlined = { underline = true },
    Bold = { bold = true },
    Italic = { italic = true },
    Error = { fg = s.invalid },

    diffAdded = { fg = s.inserted },
    diffRemoved = { fg = s.deleted },
    diffChanged = { fg = s.changed },
    diffLine = { fg = s.namespace },
    diffFile = { fg = g.fgMuted, bold = true },
    diffIndexLine = { fg = g.fgMuted },
  }
end
