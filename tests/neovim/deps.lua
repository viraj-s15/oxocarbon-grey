local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h:h")
local dir = root .. "/.cache/neovim"
local pins = dofile(root .. "/tests/neovim/pins.lua")

local function run(cmd, cwd)
  local result = vim.system(cmd, { cwd = cwd, text = true }):wait()
  if result.code ~= 0 then
    error(("%s failed:\n%s%s"):format(table.concat(cmd, " "), result.stdout, result.stderr), 0)
  end
  return vim.trim(result.stdout)
end

local function checkout(url, revision, path)
  if vim.fn.isdirectory(path .. "/.git") == 0 then
    run({ "git", "init", "-q", path })
  end
  local marker = path .. "/.git/oxocarbon-grey-revision"
  local file = io.open(marker)
  local current = file and file:read("*l")
  if file then
    file:close()
  end
  if current ~= revision then
    run({ "git", "fetch", "-q", "--depth", "1", url, revision }, path)
    run({ "git", "checkout", "-q", "--detach", "FETCH_HEAD" }, path)
    file = assert(io.open(marker, "w"))
    file:write(revision, "\n")
    file:close()
  end
  return run({ "git", "rev-parse", "HEAD" }, path)
end

vim.fn.mkdir(dir .. "/parser", "p")
local versions = {
  "nvim-treesitter " .. checkout("https://github.com/nvim-treesitter/nvim-treesitter", pins.nvim_treesitter, dir .. "/nvim-treesitter"),
}

local parsers = dofile(dir .. "/nvim-treesitter/lua/nvim-treesitter/parsers.lua")
for _, lang in ipairs(pins.languages) do
  local info = parsers[lang].install_info
  local repo = dir .. "/grammars/" .. info.url:match("[^/]+$")
  local commit = checkout(info.url, info.revision, repo)
  local src = repo .. "/" .. (info.location and info.location .. "/" or "") .. "src"
  local sources = { src .. "/parser.c" }
  if vim.uv.fs_stat(src .. "/scanner.c") then
    table.insert(sources, src .. "/scanner.c")
  end
  local out = ("%s/parser/%s.so"):format(dir, lang)
  run(vim.list_extend({ "cc", "-O2", "-shared", "-fPIC", "-std=c11", "-I", src, "-o", out }, sources))
  table.insert(versions, ("%s %s %s"):format(lang, info.url, commit))
end

local file = assert(io.open(dir .. "/versions.txt", "w"))
file:write(table.concat(versions, "\n"), "\n")
file:close()
io.stdout:write(table.concat(versions, "\n"), "\n")
