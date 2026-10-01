local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h:h")
local deps = root .. "/.cache/neovim"

local M = { root = root }

function M.setup()
  local pins = dofile(root .. "/tests/neovim/pins.lua")
  local versions = io.open(deps .. "/versions.txt")
  local installed = versions and versions:read("*a") or ""
  if versions then
    versions:close()
  end
  local current = vim.startswith(installed, "nvim-treesitter " .. pins.nvim_treesitter .. "\n")
    and vim.iter(pins.languages):all(function(lang)
      return installed:find("\n" .. lang .. " ", 1, true) ~= nil
    end)
  if not current then
    io.stderr:write("Parsers are missing or out of date. Run `nvim --clean --headless -l tests/neovim/deps.lua` first.\n")
    os.exit(1)
  end
  vim.opt.runtimepath = { root, deps, deps .. "/nvim-treesitter/runtime", vim.env.VIMRUNTIME }
  vim.cmd.colorscheme("oxocarbon-grey")
  return installed
end

function M.open(path, lang)
  vim.cmd.edit(path)
  local buf = vim.api.nvim_get_current_buf()
  vim.treesitter.start(buf, lang)
  local parser = vim.treesitter.get_parser(buf, lang)
  parser:parse(true)
  return buf, parser
end

local function resolve(name)
  while name do
    local def = vim.api.nvim_get_hl(0, { name = name, link = false })
    if next(def) then
      return def
    end
    name = name:match("^(.*)%.[^.]+$")
  end
  return {}
end

function M.style_at(buf, row, col)
  local captures = vim.inspect_pos(buf, row, col, { syntax = false, extmarks = false, semantic_tokens = false }).treesitter
  for i, capture in ipairs(captures) do
    capture.order = i
  end
  table.sort(captures, function(x, y)
    local px = tonumber(x.metadata and x.metadata.priority) or 100
    local py = tonumber(y.metadata and y.metadata.priority) or 100
    if px ~= py then
      return px < py
    end
    return x.order < y.order
  end)
  local merged, names = {}, {}
  for _, capture in ipairs(captures) do
    table.insert(names, capture.hl_group)
    for key, value in pairs(resolve(capture.hl_group)) do
      merged[key] = value
    end
  end
  return {
    fg = merged.fg and ("#%06x"):format(merged.fg),
    italic = merged.italic or nil,
    bold = merged.bold or nil,
  }, table.concat(names, " ")
end

return M
