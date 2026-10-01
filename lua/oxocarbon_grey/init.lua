local M = {}

local defaults = {
  italic = true,
  bold = true,
  overrides = {},
}

local config = vim.deepcopy(defaults)

function M.setup(opts)
  opts = opts or {}
  if type(opts) ~= "table" then
    error("oxocarbon-grey: setup() expects a table", 2)
  end
  for key, value in pairs(opts) do
    if defaults[key] == nil then
      vim.notify(("oxocarbon-grey: unknown option %q"):format(key), vim.log.levels.WARN)
    elseif key == "overrides" and type(value) ~= "table" and type(value) ~= "function" then
      error("oxocarbon-grey: overrides must be a table or a function", 2)
    elseif key ~= "overrides" and type(value) ~= "boolean" then
      error(("oxocarbon-grey: %s must be true or false"):format(key), 2)
    end
  end
  config = vim.tbl_extend("force", vim.deepcopy(defaults), opts)
end

local function blend(fg, bg, alpha)
  local out = "#"
  for i = 2, 6, 2 do
    local a, b = tonumber(fg:sub(i, i + 1), 16), tonumber(bg:sub(i, i + 1), 16)
    out = out .. ("%02x"):format(math.floor(a * alpha + b * (1 - alpha) + 0.5))
  end
  return out
end

M.blend = blend

local modules = { "editor", "syntax", "treesitter", "semantic", "plugins" }

function M.groups()
  local palette = require("oxocarbon_grey.palette")
  local groups = {}
  for _, name in ipairs(modules) do
    for group, spec in pairs(require("oxocarbon_grey.groups." .. name)(palette, blend)) do
      groups[group] = spec
    end
  end

  for _, spec in pairs(groups) do
    if not config.italic then
      spec.italic = nil
    end
    if not config.bold then
      spec.bold = nil
    end
  end

  local overrides = config.overrides
  if type(overrides) == "function" then
    overrides = overrides(vim.deepcopy(palette))
  end
  if type(overrides) ~= "table" then
    error("oxocarbon-grey: the overrides function must return a table", 0)
  end
  for group, spec in pairs(overrides) do
    groups[group] = spec
  end
  return groups
end

function M.load()
  local groups = M.groups()

  vim.cmd("highlight clear")
  if vim.fn.exists("syntax_on") == 1 then
    vim.cmd("syntax reset")
  end
  vim.o.background = "dark"
  vim.g.colors_name = "oxocarbon-grey"

  local ansi = require("oxocarbon_grey.palette").ansi
  local order = {
    "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
    "brightBlack", "brightRed", "brightGreen", "brightYellow",
    "brightBlue", "brightMagenta", "brightCyan", "brightWhite",
  }
  for i, name in ipairs(order) do
    vim.g["terminal_color_" .. (i - 1)] = ansi[name]
  end

  local invalid = {}
  for group, spec in pairs(groups) do
    if not pcall(vim.api.nvim_set_hl, 0, group, spec) then
      table.insert(invalid, group)
    end
  end
  if #invalid > 0 then
    table.sort(invalid)
    vim.notify("oxocarbon-grey: invalid highlight definition for " .. table.concat(invalid, ", "), vim.log.levels.WARN)
  end
end

return M
