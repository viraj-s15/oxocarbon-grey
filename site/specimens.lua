local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h")
local highlight = dofile(root .. "/tests/neovim/highlight.lua")
local out = root .. "/site/specimens.json"
local source = highlight.setup():match("^(.-)\n")

local specimens = {
  { id = "python", name = "Python", file = "inventory.py", lang = "python", from = 26, to = 51 },
  { id = "rust", name = "Rust", file = "cache.rs", lang = "rust", from = 41, to = 66 },
  { id = "typescript", name = "TypeScript", file = "TaskBoard.tsx", lang = "tsx", from = 79, to = 104 },
  { id = "cpp", name = "C++", file = "matrix.cpp", lang = "cpp", from = 21, to = 47 },
}

local palette = require("oxocarbon_grey.palette")
local names = {}
for _, key in ipairs({ "fgSubtle", "fgMuted", "fg" }) do
  names[palette.grey[key]] = key
end
for key, hex in pairs(palette.accent) do
  names[hex] = key
end

local function style(buf, row, col)
  local got = highlight.style_at(buf, row, col)
  local name = names[got.fg or palette.grey.fg]
  if not name then
    error(("%s at %d:%d is not a palette text colour"):format(got.fg, row + 1, col + 1), 0)
  end
  return name .. (got.italic and " i" or "") .. (got.bold and " b" or "")
end

local function token(text, class)
  return vim.json.encode(class and { text, class } or text)
end

local lines = { "{", ('  "source": %s,'):format(vim.json.encode(source)), '  "specimens": [' }
for i, spec in ipairs(specimens) do
  local buf = highlight.open(root .. "/fixtures/" .. spec.file, spec.lang)
  table.insert(lines, ('    { "id": %s, "name": %s, "file": %s, "line": %d, "lines": ['):format(
    vim.json.encode(spec.id), vim.json.encode(spec.name), vim.json.encode(spec.file), spec.from))
  for row = spec.from - 1, spec.to - 1 do
    local text = vim.api.nvim_buf_get_lines(buf, row, row + 1, true)[1]
    local tokens, current, class = {}, "", nil
    for col = 0, #text - 1 do
      local char = text:sub(col + 1, col + 1)
      local next_class = class
      if not char:match("%s") then
        next_class = style(buf, row, col)
      end
      if next_class ~= class and current ~= "" then
        table.insert(tokens, token(current, class))
        current = ""
      end
      current, class = current .. char, next_class
    end
    if current ~= "" then
      table.insert(tokens, token(current, class))
    end
    table.insert(lines, "      [" .. table.concat(tokens, ", ") .. "]" .. (row < spec.to - 1 and "," or ""))
  end
  table.insert(lines, "    ] }" .. (i < #specimens and "," or ""))
end
vim.list_extend(lines, { "  ]", "}" })
local json = table.concat(lines, "\n") .. "\n"

if vim.tbl_contains(_G.arg or {}, "--check") then
  local file = io.open(out)
  local current = file and file:read("*a")
  if file then
    file:close()
  end
  if current ~= json then
    io.stderr:write("site/specimens.json is out of date. Run `npm run build:specimens`.\n")
    os.exit(1)
  end
  io.stdout:write("site/specimens.json is up to date\n")
else
  local file = assert(io.open(out, "w"))
  file:write(json)
  file:close()
  io.stdout:write("wrote site/specimens.json\n")
end
