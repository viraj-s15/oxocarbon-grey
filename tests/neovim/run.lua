local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h:h")

local results = { passed = 0, failed = {} }

local function test(name, fn)
  local ok, err = pcall(fn)
  if ok then
    results.passed = results.passed + 1
  else
    table.insert(results.failed, ("%s\n    %s"):format(name, err))
  end
end

local function check(condition, message)
  if not condition then
    error(message, 2)
  end
end

local function eq(actual, expected, what)
  if not vim.deep_equal(actual, expected) then
    error(("%s: expected %s, got %s"):format(what, vim.inspect(expected), vim.inspect(actual)), 2)
  end
end

local function hex(n)
  return n and ("#%06x"):format(n) or nil
end

local function hl(name)
  local def = vim.api.nvim_get_hl(0, { name = name, link = false })
  return {
    fg = hex(def.fg),
    bg = hex(def.bg),
    sp = hex(def.sp),
    italic = def.italic or nil,
    bold = def.bold or nil,
    underline = def.underline or nil,
    undercurl = def.undercurl or nil,
    strikethrough = def.strikethrough or nil,
  }
end

local function same_highlights(actual, expected, what)
  local differ = {}
  for name in pairs(vim.tbl_extend("force", {}, actual, expected)) do
    if not vim.deep_equal(actual[name] or {}, expected[name] or {}) then
      table.insert(differ, name)
    end
  end
  table.sort(differ)
  if #differ > 0 then
    error(("%s: %d groups differ: %s"):format(what, #differ, table.concat(differ, ", ", 1, math.min(#differ, 12))), 2)
  end
end

local function snapshot()
  local all = vim.api.nvim_get_hl(0, {})
  all.Normal = vim.api.nvim_get_hl(0, { name = "Normal" })
  return all
end

local function luminance(color)
  local sum = 0
  for i, weight in ipairs({ 0.2126, 0.7152, 0.0722 }) do
    local c = tonumber(color:sub(i * 2, i * 2 + 1), 16) / 255
    c = c <= 0.03928 and c / 12.92 or ((c + 0.055) / 1.055) ^ 2.4
    sum = sum + weight * c
  end
  return sum
end

local function contrast(a, b)
  local x, y = luminance(a), luminance(b)
  return (math.max(x, y) + 0.05) / (math.min(x, y) + 0.05)
end

local function documented(file, pattern, first, last)
  local names, inside = {}, first == nil
  for line in io.lines(vim.env.VIMRUNTIME .. "/doc/" .. file) do
    if first and line:find(first, 1, true) then
      inside = true
    elseif last and line:find(last, 1, true) then
      inside = false
    end
    if inside and pattern:sub(1, 1) == "^" then
      local name = line:match(pattern)
      if name then
        names[name] = true
      end
    elseif inside then
      for name in line:gmatch(pattern) do
        names[name] = true
      end
    end
  end
  return vim.tbl_keys(names)
end

test("the colorscheme is not found before the checkout is on runtimepath", function()
  check(not pcall(vim.cmd.colorscheme, "oxocarbon-grey"), "loaded without the checkout on runtimepath")
end)

vim.opt.runtimepath:prepend(root)

test("the repository root alone provides the colorscheme", function()
  eq(vim.api.nvim_get_runtime_file("colors/oxocarbon-grey.lua", true), { root .. "/colors/oxocarbon-grey.lua" }, "colors file")
  vim.cmd.colorscheme("oxocarbon-grey")
  eq(vim.g.colors_name, "oxocarbon-grey", "g:colors_name")
  eq(vim.o.background, "dark", "background")
end)

local p = require("oxocarbon_grey.palette")
local g, a, s, ansi = p.grey, p.accent, p.syntax, p.ansi
local theme = require("oxocarbon_grey")
local initial = snapshot()

test("the generated palette carries the shared colours as opaque hex", function()
  eq(
    { g.bg, g.bgFloat, g.bgLine, g.bgSelection, g.fg },
    { "#1b1c1f", "#232428", "#202125", "#33353b", "#dde1e6" },
    "base colours"
  )
  eq(g.hairline, "#27282a", "hairline composited over the background")
  for _, section in pairs(p) do
    for key, color in pairs(section) do
      check(color:match("^#%x%x%x%x%x%x$"), ("%s is not #rrggbb: %s"):format(key, color))
    end
  end
end)

test("editor surfaces use the palette", function()
  eq(hl("Normal"), { fg = g.fg, bg = g.bg }, "Normal")
  eq(hl("NormalNC"), { fg = g.fg, bg = g.bg }, "NormalNC")
  eq(hl("NormalFloat"), { fg = g.fg, bg = g.bgFloat }, "NormalFloat")
  eq(hl("CursorLine").bg, g.bgLine, "CursorLine")
  eq(hl("Visual").bg, g.bgSelection, "Visual")
  eq(hl("Pmenu"), { fg = g.fg, bg = g.bgFloat }, "Pmenu")
  eq(hl("PmenuSel"), { fg = g.white, bg = g.bgSelection }, "PmenuSel")
  eq(hl("LineNr").fg, g.lineNr, "LineNr")
  eq(hl("CursorLineNr").fg, g.lineNrActive, "CursorLineNr")
  eq(hl("WinSeparator").fg, g.hairline, "WinSeparator")
  eq(hl("CurSearch"), { fg = g.bg, bg = a.sky }, "CurSearch")
  eq(hl("Search").bg, theme.blend(a.cyan, g.bg, 0.2), "Search")
  eq(hl("DiffAdd").bg, theme.blend(a.green, g.bg, 0.08), "DiffAdd")
  eq(hl("DiffText").bg, theme.blend(a.blue, g.bg, 0.18), "DiffText")
  eq(hl("DiffDelete").bg, theme.blend(a.pink, g.bg, 0.08), "DiffDelete")
  eq(hl("SpellBad"), { sp = a.pink, undercurl = true }, "SpellBad")
end)

test("syntax colours follow the shared mapping", function()
  local expected = {
    Comment = { fg = s.comment, italic = true },
    Keyword = { fg = s.keyword },
    Conditional = { fg = s.keyword, italic = true },
    StorageClass = { fg = s.storage },
    Function = { fg = s["function"] },
    Type = { fg = s.type },
    String = { fg = s.string },
    SpecialChar = { fg = s.escape },
    Constant = { fg = s.constant },
    Operator = { fg = s.operator },
    Macro = { fg = s.macro },
    ["@variable"] = { fg = s.variable },
    ["@variable.parameter"] = { fg = s.parameter, italic = true },
    ["@variable.builtin"] = { fg = s.self, italic = true },
    ["@variable.member"] = { fg = s.property },
    ["@property"] = { fg = s.property },
    ["@keyword"] = { fg = s.keyword },
    ["@keyword.function"] = { fg = s.storage },
    ["@keyword.type"] = { fg = s.storage },
    ["@keyword.return"] = { fg = s.keyword, italic = true },
    ["@keyword.conditional"] = { fg = s.keyword, italic = true },
    ["@function"] = { fg = s["function"] },
    ["@function.call"] = { fg = s["function"] },
    ["@function.method"] = { fg = s.method },
    ["@function.method.call"] = { fg = s.method },
    ["@function.macro"] = { fg = s.macro },
    ["@type"] = { fg = s.type },
    ["@type.builtin"] = { fg = s.type, italic = true },
    ["@string"] = { fg = s.string },
    ["@string.escape"] = { fg = s.escape },
    ["@constant"] = { fg = s.constant },
    ["@boolean"] = { fg = s.builtin, italic = true },
    ["@operator"] = { fg = s.operator },
    ["@attribute"] = { fg = s.decorator },
    ["@comment"] = { fg = s.comment, italic = true },
    ["@comment.documentation"] = { fg = s.docComment, italic = true },
    ["@keyword.rust"] = { fg = s.storage },
    ["@keyword.typescript"] = { fg = s.storage },
    ["@constant.builtin.rust"] = { fg = s.constant },
    ["@attribute.rust"] = { fg = s.lifetime, italic = true },
  }
  for group, want in pairs(expected) do
    eq(hl(group), want, group)
  end
end)

test("semantic tokens keep tree-sitter distinctions where servers are coarser", function()
  eq(vim.api.nvim_get_hl(0, { name = "@lsp.type.variable" }), {}, "@lsp.type.variable is cleared")
  eq(hl("@lsp.type.method"), { fg = s.method }, "@lsp.type.method")
  eq(hl("@lsp.type.parameter"), { fg = s.parameter, italic = true }, "@lsp.type.parameter")
  eq(hl("@lsp.type.enumMember"), { fg = s.constant }, "@lsp.type.enumMember")
  eq(hl("@lsp.typemod.variable.defaultLibrary"), { fg = s.builtin }, "built-in variables")
  eq(hl("@lsp.typemod.variable.readonly.python"), { fg = s.constant }, "Python constants")
  eq(hl("@lsp.typemod.function.declaration"), { bold = true }, "function declarations keep the type colour")
  eq(hl("@lsp.mod.decorator.python"), { fg = s.decorator }, "Python decorators")
  eq(hl("@lsp.typemod.keyword.controlFlow"), { fg = s.keyword, italic = true }, "control flow")
  eq(hl("@lsp.type.keyword.rust"), { fg = s.storage }, "Rust keywords")
  eq(hl("@lsp.type.selfKeyword"), { fg = s.self, italic = true }, "self")
  eq(hl("@lsp.mod.deprecated"), { strikethrough = true }, "deprecated")
end)

test("diagnostics use one colour per severity", function()
  local colors = { Error = a.pink, Warn = a.purple, Info = a.blue, Hint = a.teal, Ok = a.green }
  for name, color in pairs(colors) do
    eq(hl("Diagnostic" .. name).fg, color, "Diagnostic" .. name)
    eq(hl("DiagnosticUnderline" .. name), { sp = color, undercurl = true }, "DiagnosticUnderline" .. name)
    eq(hl("DiagnosticVirtualText" .. name), { fg = color, bg = theme.blend(color, g.bg, 0.08) }, "DiagnosticVirtualText" .. name)
    eq(hl("DiagnosticSign" .. name).fg, color, "DiagnosticSign" .. name)
    eq(hl("DiagnosticFloating" .. name).fg, color, "DiagnosticFloating" .. name)
  end
end)

test("terminal colours come from the shared ANSI palette", function()
  local order = {
    "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
    "brightBlack", "brightRed", "brightGreen", "brightYellow",
    "brightBlue", "brightMagenta", "brightCyan", "brightWhite",
  }
  for i, name in ipairs(order) do
    eq(vim.g["terminal_color_" .. (i - 1)], ansi[name], "terminal_color_" .. (i - 1))
  end
  eq(vim.g.terminal_color_3, a.purple, "yellow is purple")
  eq(vim.g.terminal_color_11, a.purple, "bright yellow is purple")
end)

test("every link points at a defined group", function()
  for group, spec in pairs(theme.groups()) do
    if spec.link then
      eq(vim.api.nvim_get_hl(0, { name = group }).link, spec.link, group .. " link")
      check(next(vim.api.nvim_get_hl(0, { name = spec.link })) ~= nil, ("%s links to undefined %s"):format(group, spec.link))
      eq(hl(group), hl(spec.link), group .. " resolves like " .. spec.link)
    end
  end
end)

test("every documented Tree-sitter capture has a style", function()
  local groups = theme.groups()
  local captures = documented("treesitter.txt", "^(@[%w%._]+)", "*treesitter-highlight-groups*", "*treesitter-highlight-spell*")
  check(#captures > 50, "found only " .. #captures .. " documented captures")
  for _, capture in ipairs(captures) do
    check(groups[capture], "no style for " .. capture)
  end
end)

test("every documented semantic token type and diagnostic group has a style", function()
  local groups = theme.groups()
  local types = documented("lsp.txt", "^(@lsp%.type%.%w+)")
  check(#types > 20, "found only " .. #types .. " documented token types")
  for _, group in ipairs(vim.list_extend(types, documented("diagnostic.txt", "%*hl%-(Diagnostic%w+)%*"))) do
    check(groups[group], "no style for " .. group)
  end
end)

test("every documented editor group has a style or is deliberately left to Neovim", function()
  local groups = theme.groups()
  local left = {
    conceal = true, Ignore = true, Menu = true, Scrollbar = true, Tooltip = true, User = true,
    MsgArea = true, StderrMsg = true, StdoutMsg = true, TermCursorNC = true,
    FloatShadow = true, FloatShadowThrough = true, FLoatShadowThrough = true,
    PmenuShadow = true, PmenuShadowThrough = true, ComplMatchIns = true, ComplHintMore = true, PreInsert = true,
  }
  for _, group in ipairs(documented("syntax.txt", "%*hl%-(%w+)%*")) do
    check(groups[group] or left[group] or group:match("^User%d$"), "no style for " .. group)
  end
end)

test("code stays readable on selections, matches and highlights", function()
  local surfaces = {
    Visual = hl("Visual").bg,
    Search = hl("Search").bg,
    MatchParen = hl("MatchParen").bg,
    DiffAdd = hl("DiffAdd").bg,
    DiffChange = hl("DiffChange").bg,
    DiffText = hl("DiffText").bg,
    DiffDelete = hl("DiffDelete").bg,
    LspReferenceText = hl("LspReferenceText").bg,
    LspReferenceWrite = hl("LspReferenceWrite").bg,
    NormalFloat = hl("NormalFloat").bg,
    CursorLine = hl("CursorLine").bg,
  }
  for surface, bg in pairs(surfaces) do
    for role, fg in pairs(s) do
      if role ~= "comment" then
        local ratio = contrast(fg, bg)
        check(ratio >= 3, ("%s %s on %s %s: %.2f"):format(role, fg, surface, bg, ratio))
      end
    end
  end
  check(contrast(hl("CurSearch").fg, hl("CurSearch").bg) >= 4.5, "CurSearch text")
  for _, name in ipairs({ "Error", "Warn", "Info", "Hint", "Ok" }) do
    local def = hl("DiagnosticVirtualText" .. name)
    check(contrast(def.fg, def.bg) >= 4.5, "DiagnosticVirtualText" .. name)
  end
end)

test("reapplying gives the same highlights and adds no autocommands", function()
  local autocmds = #vim.api.nvim_get_autocmds({})
  vim.cmd.colorscheme("oxocarbon-grey")
  vim.cmd.colorscheme("oxocarbon-grey")
  same_highlights(snapshot(), initial, "highlights after reapplying")
  eq(#vim.api.nvim_get_autocmds({}), autocmds, "autocommand count")
end)

test("switching away clears the theme and switching back restores it", function()
  vim.cmd.colorscheme("default")
  eq(vim.g.colors_name, "default", "g:colors_name after switching away")
  eq(vim.api.nvim_get_hl(0, { name = "@lsp.type.variable" }).link, "@variable", "Neovim default restored")
  check(hl("Normal").bg ~= g.bg, "Normal background left behind")
  vim.cmd.colorscheme("oxocarbon-grey")
  eq(vim.g.colors_name, "oxocarbon-grey", "g:colors_name after switching back")
  same_highlights(snapshot(), initial, "highlights after switching back")
end)

test("loading from a light background switches to dark and keeps it set", function()
  vim.cmd.colorscheme("elflord")
  vim.o.background = "light"
  eq(vim.g.colors_name, nil, "Neovim unloads the dark-only elflord")
  vim.cmd.colorscheme("oxocarbon-grey")
  eq(vim.o.background, "dark", "background")
  eq(vim.g.colors_name, "oxocarbon-grey", "g:colors_name")
  eq(vim.api.nvim_get_option_info2("background", {}).was_set, true, "background marked as set")
  same_highlights(snapshot(), initial, "highlights")
end)

test("loading needs none of the optional plugins", function()
  for _, module in ipairs({ "telescope", "gitsigns", "blink.cmp" }) do
    check(not pcall(require, module), module .. " is installed in the test environment")
  end
  eq(hl("TelescopeNormal"), hl("NormalFloat"), "TelescopeNormal")
  eq(hl("GitSignsAdd").fg, a.green, "GitSignsAdd")
  eq(hl("BlinkCmpKindMethod").fg, s.method, "BlinkCmpKindMethod")
end)

test("setup does not apply the theme by itself", function()
  theme.setup({ italic = false })
  eq(hl("Comment").italic, true, "Comment before :colorscheme")
  theme.setup()
end)

test("italic = false removes italics", function()
  theme.setup({ italic = false })
  vim.cmd.colorscheme("oxocarbon-grey")
  for group, spec in pairs(theme.groups()) do
    if not spec.link then
      check(not hl(group).italic, group .. " is still italic")
    end
  end
  eq(hl("Comment"), { fg = s.comment }, "Comment")
  eq(hl("@lsp.typemod.function.declaration").bold, true, "bold is untouched")
end)

test("bold = false removes bold", function()
  theme.setup({ bold = false })
  vim.cmd.colorscheme("oxocarbon-grey")
  for group, spec in pairs(theme.groups()) do
    if not spec.link then
      check(not hl(group).bold, group .. " is still bold")
    end
  end
  eq(hl("Comment").italic, true, "italic is untouched")
end)

test("overrides replace groups, as a table or a function of the palette", function()
  theme.setup({ overrides = { Comment = { fg = "#ffffff" }, Visual = { link = "Search" } } })
  vim.cmd.colorscheme("oxocarbon-grey")
  eq(hl("Comment"), { fg = "#ffffff" }, "Comment")
  eq(vim.api.nvim_get_hl(0, { name = "Visual" }).link, "Search", "Visual")

  theme.setup({
    overrides = function(colors)
      return { Normal = { fg = colors.grey.fg, bg = colors.grey.bgFloat } }
    end,
  })
  vim.cmd.colorscheme("oxocarbon-grey")
  eq(hl("Normal"), { fg = g.fg, bg = g.bgFloat }, "Normal")
  eq(hl("Comment"), { fg = s.comment, italic = true }, "earlier overrides do not persist")
end)

test("the overrides function gets a copy of the palette", function()
  theme.setup({
    overrides = function(colors)
      colors.syntax.comment = "#ff0000"
      return {}
    end,
  })
  vim.cmd.colorscheme("oxocarbon-grey")
  theme.setup()
  vim.cmd.colorscheme("oxocarbon-grey")
  eq(hl("Comment").fg, s.comment, "Comment")
  eq(require("oxocarbon_grey.palette").syntax.comment, s.comment, "palette")
end)

test("an invalid override is reported without stopping the caller", function()
  theme.setup({ overrides = { Comment = { fg = "notacolor" } } })
  local ok, err = pcall(vim.cmd.colorscheme, "oxocarbon-grey")
  check(ok, "the default vim.notify raised: " .. tostring(err))
  local messages = {}
  local notify = vim.notify
  vim.notify = function(msg, level)
    table.insert(messages, { msg, level })
  end
  vim.cmd.colorscheme("oxocarbon-grey")
  vim.notify = notify
  theme.setup()
  eq(messages, { { "oxocarbon-grey: invalid highlight definition for Comment", vim.log.levels.WARN } }, "notifications")
  eq(hl("Normal"), { fg = g.fg, bg = g.bg }, "Normal")
  vim.cmd.colorscheme("oxocarbon-grey")
end)

test("a failing overrides function leaves the current highlights alone", function()
  theme.setup({
    overrides = function()
      return "not a table"
    end,
  })
  check(not pcall(vim.cmd.colorscheme, "oxocarbon-grey"), ":colorscheme succeeded")
  theme.setup()
  same_highlights(snapshot(), initial, "highlights")
end)

test("setup() rejects options of the wrong type", function()
  for _, opts in ipairs({ "italic", { italic = "no" }, { bold = 1 }, { overrides = "Comment" } }) do
    check(not pcall(theme.setup, opts), "accepted " .. vim.inspect(opts))
  end
  theme.setup()
end)

test("setup() with no options restores the defaults", function()
  theme.setup({ italic = false, bold = false, overrides = { Normal = { bg = "#000000" } } })
  theme.setup()
  vim.cmd.colorscheme("oxocarbon-grey")
  same_highlights(snapshot(), initial, "highlights")
end)

test("unknown options are reported", function()
  local messages = {}
  local notify = vim.notify
  vim.notify = function(msg, level)
    table.insert(messages, { msg, level })
  end
  theme.setup({ itallic = false })
  vim.notify = notify
  theme.setup()
  eq(messages, { { 'oxocarbon-grey: unknown option "itallic"', vim.log.levels.WARN } }, "notifications")
end)

local version = vim.version()
io.stdout:write(("Neovim %d.%d.%d: %d passed, %d failed\n"):format(version.major, version.minor, version.patch, results.passed, #results.failed))
for _, failure in ipairs(results.failed) do
  io.stdout:write("FAIL " .. failure .. "\n")
end
os.exit(#results.failed == 0 and 0 or 1)
