local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h:h")
local deps = root .. "/.cache/neovim"

local pins = dofile(root .. "/tests/neovim/pins.lua")
local versions = io.open(deps .. "/versions.txt")
local installed = versions and versions:read("*a") or ""
if versions then
  versions:close()
end
local expected = {}
for _, lang in ipairs(pins.languages) do
  table.insert(expected, "\n" .. lang .. " ")
end
if not vim.startswith(installed, "nvim-treesitter " .. pins.nvim_treesitter .. "\n")
  or not vim.iter(expected):all(function(lang) return installed:find(lang, 1, true) end) then
  io.stderr:write("Parsers are missing or out of date. Run `nvim --clean --headless -l tests/neovim/deps.lua` first.\n")
  os.exit(1)
end
io.stdout:write(installed)

vim.opt.runtimepath = { root, deps, deps .. "/nvim-treesitter/runtime", vim.env.VIMRUNTIME }
vim.cmd.colorscheme("oxocarbon-grey")

local theme = require("oxocarbon_grey")
local p = require("oxocarbon_grey.palette")
local s, g = p.syntax, p.grey
local groups = theme.groups()
local failures = {}
local checked = 0

local function fail(message)
  table.insert(failures, message)
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

local function covered(capture, lang)
  local name = "@" .. capture .. "." .. lang
  while name do
    if groups[name] then
      return true
    end
    name = name:match("^(.*)%.[^.]+$")
  end
  return false
end

local function style_at(buf, row, col)
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

local function find(buf, text, nth)
  local count = 0
  for row, line in ipairs(vim.api.nvim_buf_get_lines(buf, 0, -1, false)) do
    local start = 1
    while true do
      local col = line:find(text, start, true)
      if not col then
        break
      end
      count = count + 1
      if count == (nth or 1) then
        return row - 1, col - 1
      end
      start = col + 1
    end
  end
end

local function italic(color)
  return { fg = color, italic = true }
end

local fixtures = {
  {
    file = "inventory.py",
    lang = "python",
    expect = {
      { '"""Inventory', italic(s.string) },
      { "from __future__", italic(s.keyword) },
      { "import asyncio", italic(s.keyword) },
      { "MAX_ITEMS", { fg = s.constant } },
      { "1_000", { fg = s.number } },
      { "class Status", { fg = s.storage } },
      { "def cached", { fg = s.storage } },
      { "cached(func", { fg = s["function"] } },
      { "func:", italic(s.parameter) },
      { "kwargs:", italic(s.parameter) },
      { "if args", italic(s.keyword) },
      { "not in", italic(s.keyword) },
      { "return wrapper", italic(s.keyword) },
      { "@dataclass", { fg = s.decorator } },
      { "self)", italic(s.self) },
      { "cls,", italic(s.self) },
      { "sku: str", italic(s.type), 1, 5 },
      { "{self.sku", { fg = s.interpolation } },
      { ".expanduser", { fg = s.method }, 1, 1 },
      { "len(self", { fg = s.builtin } },
      { "Item(**raw", { fg = s.type } },
      { "self.path", { fg = s.property }, 1, 5 },
      { "None)", italic(s.builtin) },
      { "True)", italic(s.builtin) },
      { "__name__", italic(s.builtin) },
      { "lambda", { fg = s.storage } },
      { "async def", italic(s.keyword) },
      { "await", italic(s.keyword) },
      { "match item", italic(s.keyword) },
      { "\\n", { fg = s.escape } },
      { "0.1", { fg = s.number } },
      { "# TODO", italic(s.comment) },
    },
  },
  {
    file = "cache.rs",
    lang = "rust",
    expect = {
      { "//! A small", italic(s.docComment) },
      { "/// Maximum", italic(s.docComment) },
      { "use std", italic(s.storage) },
      { "std::collections", { fg = s.namespace } },
      { "pub const", { fg = s.storage } },
      { "const MAX", { fg = s.storage } },
      { "MAX_ENTRIES", { fg = s.constant } },
      { "usize", italic(s.type) },
      { "static GREETING", { fg = s.storage } },
      { '"hello"', { fg = s.string } },
      { "derive", { fg = s.macro } },
      { "enum CacheError", { fg = s.storage } },
      { "CacheError", { fg = s.type } },
      { "impl Display", { fg = s.storage } },
      { "fn fmt", { fg = s.storage } },
      { "&self", italic(s.self), 1, 1 },
      { "'_", italic(s.lifetime), 1, 1 },
      { "match self", italic(s.keyword) },
      { "write!", { fg = s.macro } },
      { "Some(pos)", { fg = s.constant } },
      { "Err(CacheError", { fg = s.constant } },
      { "return Err", italic(s.keyword) },
      { "let entry", { fg = s.storage } },
      { "'a, V", italic(s.lifetime), 1, 1 },
      { ".entries.get", { fg = s.property }, 1, 1 },
      { ".get(key).ok_or", { fg = s["function"] }, 1, 1 },
      { "now()", { fg = s["function"] } },
      { "Duration,", { fg = s.type } },
      { "while self", italic(s.keyword) },
      { "macro_rules!", { fg = s.macro } },
      { "$x * $x", { fg = s.macro } },
      { "true, false", italic(s.builtin) },
      { "'x'", { fg = s.string } },
      { "3.14_f32", { fg = s.number } },
      { "as u64", italic(s.keyword) },
      { "> self.ttl", { fg = s.operator } },
    },
  },
  {
    file = "TaskBoard.tsx",
    lang = "tsx",
    expect = {
      { "// A small", italic(s.comment) },
      { "import {", italic(s.keyword) },
      { 'from "react"', italic(s.keyword) },
      { '"react"', { fg = s.string } },
      { "export enum", italic(s.keyword) },
      { "enum Priority", { fg = s.storage } },
      { "interface Task", { fg = s.storage } },
      { "readonly id", { fg = s.storage } },
      { "string;", italic(s.type) },
      { "const MAX_TASKS", { fg = s.storage } },
      { "MAX_TASKS", { fg = s.constant } },
      { "250", { fg = s.number } },
      { "satisfies", italic(s.keyword) },
      { "function sealed", { fg = s.storage } },
      { "sealed(", { fg = s["function"] } },
      { "constructor: Function", italic(s.parameter) },
      { ".seal(", { fg = s.method }, 1, 1 },
      { "@sealed", { fg = s.decorator } },
      { "class TaskStore", { fg = s.storage } },
      { "static readonly", { fg = s.storage } },
      { "new Map", italic(s.keyword) },
      { "Map<", italic(s.type) },
      { "constructor(private", { fg = s.type } },
      { "private readonly", { fg = s.storage } },
      { "this.tasks", italic(s.self) },
      { "throw new", italic(s.keyword) },
      { "${MAX_TASKS}", { fg = s.interpolation } },
      { "async sync", italic(s.keyword) },
      { "sync(signal", { fg = s.method } },
      { "await fetch", italic(s.keyword) },
      { "fetch(`", { fg = s["function"] } },
      { "=> !t.done", { fg = s.operator } },
      { "switch", italic(s.keyword) },
      { "<span", { fg = s.tag }, 1, 1 },
      { "className", { fg = s.attribute } },
      { "/^task-", { fg = s.regex }, 1, 1 },
      { "null);", italic(s.builtin) },
      { "instanceof", italic(s.keyword) },
      { "useState<", { fg = s["function"] } },
    },
  },
  {
    file = "matrix.cpp",
    lang = "cpp",
    expect = {
      { "// A small", italic(s.comment) },
      { "#include <algorithm>", { fg = s.macro } },
      { "<algorithm>", { fg = s.string } },
      { "#define MATRIX", { fg = s.macro } },
      { "MATRIX_VERSION", { fg = s.macro } },
      { "#ifndef", { fg = s.macro } },
      { "namespace linalg", { fg = s.storage } },
      { "linalg {", { fg = s.namespace } },
      { "template <typename", { fg = s.storage } },
      { "typename T>", { fg = s.storage } },
      { "concept Numeric", { fg = s.storage } },
      { "std::integral", { fg = s.namespace } },
      { "enum class", { fg = s.storage } },
      { "class Layout", { fg = s.storage } },
      { "constexpr std::size_t kMaxDim", { fg = s.storage } },
      { "16;", { fg = s.number } },
      { "public:", { fg = s.storage } },
      { "using value_type", { fg = s.storage } },
      { "value_type", { fg = s.type } },
      { "explicit", { fg = s.storage } },
      { "copy(", { fg = s["function"] } },
      { ".begin()", { fg = s.method }, 1, 1 },
      { "return data_", italic(s.keyword) },
      { "for (std", italic(s.keyword) },
      { "this)", italic(s.self) },
      { "nullptr", italic(s.builtin) },
      { "struct Report", { fg = s.storage } },
      { "->name", { fg = s.property }, 1, 2 },
      { 'R"(', { fg = s.string } },
      { "\\n", { fg = s.escape } },
      { "|| count", { fg = s.operator } },
      { "requires", { fg = s.storage } },
    },
  },
}

for _, fixture in ipairs(fixtures) do
  vim.cmd.edit(root .. "/fixtures/" .. fixture.file)
  local buf = vim.api.nvim_get_current_buf()
  vim.treesitter.start(buf, fixture.lang)
  local parser = vim.treesitter.get_parser(buf, fixture.lang)
  parser:parse(true)

  local langs = {}
  parser:for_each_tree(function(_, tree)
    if not vim.tbl_contains(langs, tree:lang()) then
      table.insert(langs, tree:lang())
    end
  end)
  for _, lang in ipairs(langs) do
    local query = vim.treesitter.query.get(lang, "highlights")
    for _, capture in ipairs(query and query.captures or {}) do
      local ignored = capture:sub(1, 1) == "_" or vim.tbl_contains({ "spell", "nospell", "none", "conceal" }, capture)
      if not ignored and not covered(capture, lang) then
        fail(("%s: @%s (%s) has no style"):format(fixture.file, capture, lang))
      end
    end
  end

  for _, case in ipairs(fixture.expect) do
    local text, want, nth, offset = case[1], case[2], case[3], case[4] or 0
    local row, col = find(buf, text, nth)
    if not row then
      fail(("%s: %q not found"):format(fixture.file, text))
    else
      local got, captures = style_at(buf, row, col + offset)
      checked = checked + 1
      if not vim.deep_equal(got, want) then
        fail(("%s:%d:%d %q: expected %s, got %s from %s"):format(
          fixture.file, row + 1, col + offset + 1, text, vim.inspect(want), vim.inspect(got), captures
        ))
      end
    end
  end
end

io.stdout:write(("%d fixture tokens checked, %d failed\n"):format(checked, #failures))
for _, failure in ipairs(failures) do
  io.stdout:write("FAIL " .. failure .. "\n")
end
os.exit(#failures == 0 and 0 or 1)
