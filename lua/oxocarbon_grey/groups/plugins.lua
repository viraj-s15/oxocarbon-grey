return function(p, blend)
  local g, a, s = p.grey, p.accent, p.syntax

  local groups = {
    TelescopeNormal = { link = "NormalFloat" },
    TelescopeBorder = { link = "FloatBorder" },
    TelescopeTitle = { link = "FloatTitle" },
    TelescopePromptPrefix = { fg = a.blue },
    TelescopePromptCounter = { fg = g.fgSubtle },
    TelescopeSelection = { fg = g.white, bg = g.bgSelection },
    TelescopeSelectionCaret = { fg = a.blue, bg = g.bgSelection },
    TelescopeMultiSelection = { fg = a.purple },
    TelescopeMultiIcon = { fg = a.purple },
    TelescopeMatching = { fg = a.blue, bold = true },

    GitSignsAdd = { fg = a.green },
    GitSignsChange = { fg = a.blue },
    GitSignsDelete = { fg = a.pink },
    GitSignsChangedelete = { fg = a.purple },
    GitSignsUntracked = { fg = g.fgSubtle },
    GitSignsAddInline = { bg = blend(a.green, g.bg, 0.18) },
    GitSignsChangeInline = { bg = blend(a.blue, g.bg, 0.18) },
    GitSignsDeleteInline = { bg = blend(a.pink, g.bg, 0.18) },
    GitSignsCurrentLineBlame = { fg = g.fgSubtle, italic = true },

    BlinkCmpMenu = { link = "Pmenu" },
    BlinkCmpMenuBorder = { link = "FloatBorder" },
    BlinkCmpMenuSelection = { link = "PmenuSel" },
    BlinkCmpLabel = { fg = g.fg },
    BlinkCmpLabelMatch = { fg = a.blue, bold = true },
    BlinkCmpLabelDeprecated = { fg = g.fgSubtle, strikethrough = true },
    BlinkCmpLabelDetail = { fg = g.fgMuted },
    BlinkCmpLabelDescription = { fg = g.fgMuted },
    BlinkCmpSource = { fg = g.fgSubtle },
    BlinkCmpGhostText = { fg = g.fgSubtle },
    BlinkCmpDoc = { link = "NormalFloat" },
    BlinkCmpDocBorder = { link = "FloatBorder" },
    BlinkCmpDocSeparator = { fg = g.guide, bg = g.bgFloat },
    BlinkCmpSignatureHelp = { link = "NormalFloat" },
    BlinkCmpSignatureHelpBorder = { link = "FloatBorder" },
    BlinkCmpKind = { fg = s.type },
  }

  local kinds = {
    Text = g.fgMuted,
    Method = s.method,
    Function = s["function"],
    Constructor = s.type,
    Field = s.property,
    Variable = s.variable,
    Class = s.type,
    Interface = s.type,
    Module = s.namespace,
    Property = s.property,
    Unit = s.number,
    Value = s.number,
    Enum = s.type,
    Keyword = s.keyword,
    Snippet = s.decorator,
    Color = a.rose,
    File = g.fgMuted,
    Reference = s.variable,
    Folder = a.blue,
    EnumMember = s.constant,
    Constant = s.constant,
    Struct = s.type,
    Event = s.property,
    Operator = s.operator,
    TypeParameter = s.type,
  }
  for kind, color in pairs(kinds) do
    groups["BlinkCmpKind" .. kind] = { fg = color }
  end

  return groups
end
