return function(p, blend)
  local g, a, s = p.grey, p.accent, p.syntax
  local function tint(color, amount)
    return blend(color, g.bg, amount)
  end
  local invisible = blend(g.lineNr, g.bg, 0.6)

  local groups = {
    Normal = { fg = g.fg, bg = g.bg },
    NormalNC = { fg = g.fg, bg = g.bg },
    NormalFloat = { fg = g.fg, bg = g.bgFloat },
    FloatBorder = { fg = g.lineNr, bg = g.bgFloat },
    FloatTitle = { fg = g.fg, bg = g.bgFloat, bold = true },
    FloatFooter = { fg = g.fgMuted, bg = g.bgFloat },

    Cursor = { fg = g.bg, bg = g.fg },
    lCursor = { link = "Cursor" },
    CursorIM = { link = "Cursor" },
    TermCursor = { fg = g.bg, bg = g.fg },
    CursorLine = { bg = g.bgLine },
    CursorColumn = { bg = g.bgLine },
    ColorColumn = { bg = g.bgLine },
    QuickFixLine = { bg = g.bgSelection, bold = true },

    LineNr = { fg = g.lineNr },
    LineNrAbove = { link = "LineNr" },
    LineNrBelow = { link = "LineNr" },
    CursorLineNr = { fg = g.lineNrActive },
    SignColumn = { fg = g.lineNr },
    FoldColumn = { fg = g.lineNr },
    CursorLineSign = { link = "SignColumn" },
    CursorLineFold = { link = "FoldColumn" },
    Folded = { fg = g.fgMuted, bg = g.bgFloat },
    WinSeparator = { fg = g.hairline },
    VertSplit = { link = "WinSeparator" },

    Visual = { bg = g.bgSelection },
    VisualNOS = { link = "Visual" },
    Search = { bg = tint(a.cyan, 0.2) },
    CurSearch = { fg = g.bg, bg = a.sky },
    IncSearch = { link = "CurSearch" },
    Substitute = { fg = g.bg, bg = a.rose },
    MatchParen = { bg = tint(a.blue, 0.18), bold = true },
    SnippetTabstop = { bg = tint(a.blue, 0.15) },
    SnippetTabstopActive = { bg = tint(a.blue, 0.25) },

    Pmenu = { fg = g.fg, bg = g.bgFloat },
    PmenuSel = { fg = g.white, bg = g.bgSelection },
    PmenuKind = { fg = s.type, bg = g.bgFloat },
    PmenuKindSel = { fg = s.type, bg = g.bgSelection },
    PmenuExtra = { fg = g.fgMuted, bg = g.bgFloat },
    PmenuExtraSel = { fg = g.fgMuted, bg = g.bgSelection },
    PmenuMatch = { fg = a.blue, bg = g.bgFloat, bold = true },
    PmenuMatchSel = { fg = a.ice, bg = g.bgSelection, bold = true },
    PmenuSbar = { bg = g.bgFloat },
    PmenuThumb = { bg = g.lineNr },
    PmenuBorder = { link = "FloatBorder" },
    WildMenu = { link = "PmenuSel" },
    ComplHint = { fg = g.fgSubtle },

    StatusLine = { fg = g.fgMuted, bg = g.bgLine },
    StatusLineNC = { fg = g.fgSubtle, bg = g.bgLine },
    StatusLineTerm = { link = "StatusLine" },
    StatusLineTermNC = { link = "StatusLineNC" },
    TabLine = { fg = g.fgSubtle, bg = g.bg },
    TabLineFill = { bg = g.bg },
    TabLineSel = { fg = g.fg, bg = g.bg, bold = true },
    WinBar = { fg = g.fgMuted, bg = g.bg, bold = true },
    WinBarNC = { fg = g.fgSubtle, bg = g.bg },
    MsgSeparator = { link = "WinSeparator" },

    NonText = { fg = invisible },
    Whitespace = { fg = invisible },
    SpecialKey = { fg = invisible },
    EndOfBuffer = { fg = g.guide },
    Conceal = { fg = g.fgSubtle },
    Directory = { fg = a.blue },
    Title = { fg = s.heading, bold = true },

    ErrorMsg = { fg = a.pink },
    WarningMsg = { fg = a.purple },
    MoreMsg = { fg = a.green },
    OkMsg = { fg = a.green },
    ModeMsg = { fg = g.fg, bold = true },
    Question = { fg = a.blue },

    DiffAdd = { bg = tint(a.green, 0.08) },
    DiffChange = { bg = tint(a.blue, 0.08) },
    DiffText = { bg = tint(a.blue, 0.18) },
    DiffTextAdd = { bg = tint(a.green, 0.18) },
    DiffDelete = { fg = tint(a.pink, 0.36), bg = tint(a.pink, 0.08) },
    Added = { fg = s.inserted },
    Changed = { fg = s.changed },
    Removed = { fg = s.deleted },

    SpellBad = { undercurl = true, sp = a.pink },
    SpellCap = { undercurl = true, sp = a.purple },
    SpellLocal = { undercurl = true, sp = a.cyan },
    SpellRare = { undercurl = true, sp = a.teal },

    DiagnosticUnnecessary = { fg = g.fgSubtle },
    DiagnosticDeprecated = { strikethrough = true, sp = a.pink },

    LspReferenceText = { bg = tint(a.blue, 0.15) },
    LspReferenceRead = { bg = tint(a.blue, 0.15) },
    LspReferenceWrite = { bg = tint(a.rose, 0.18) },
    LspReferenceTarget = { link = "LspReferenceText" },
    LspInlayHint = { fg = g.fgSubtle, bg = blend(g.bgFloat, g.bg, 0.8) },
    LspCodeLens = { fg = g.fgSubtle },
    LspCodeLensSeparator = { fg = g.guide },
    LspSignatureActiveParameter = { bg = tint(a.blue, 0.18), bold = true },
  }

  local severities = { Error = a.pink, Warn = a.purple, Info = a.blue, Hint = a.teal, Ok = a.green }
  for name, color in pairs(severities) do
    groups["Diagnostic" .. name] = { fg = color }
    groups["DiagnosticUnderline" .. name] = { undercurl = true, sp = color }
    groups["DiagnosticVirtualText" .. name] = { fg = color, bg = tint(color, 0.08) }
    groups["DiagnosticVirtualLines" .. name] = { fg = color }
    groups["DiagnosticFloating" .. name] = { fg = color }
    groups["DiagnosticSign" .. name] = { fg = color }
  end

  return groups
end
