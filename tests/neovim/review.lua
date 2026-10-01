local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h:h:h")
local deps = root .. "/.cache/neovim"

vim.opt.runtimepath:prepend(root)
if not vim.uv.fs_stat(deps .. "/versions.txt") then
  vim.notify("No review parsers in .cache/neovim, so Tree-sitter is off. See the README.", vim.log.levels.WARN)
elseif vim.fn.has("nvim-0.12") == 0 then
  vim.notify("The review parsers need Neovim 0.12, so Tree-sitter is off.", vim.log.levels.WARN)
else
  vim.opt.runtimepath:prepend(deps .. "/nvim-treesitter/runtime")
  vim.opt.runtimepath:prepend(deps)
  vim.treesitter.language.register("tsx", "typescriptreact")
  vim.api.nvim_create_autocmd("FileType", {
    callback = function(args)
      pcall(vim.treesitter.start, args.buf)
    end,
  })
end

vim.o.termguicolors = true
vim.o.number = true
vim.o.cursorline = true
vim.o.signcolumn = "yes"
vim.o.colorcolumn = "100"
vim.o.listchars = "tab:> ,trail:-,space:."
vim.o.completeopt = "menuone,noselect"
vim.diagnostic.config({ virtual_text = true, signs = true, underline = true, float = { border = "rounded" } })
vim.cmd.colorscheme("oxocarbon-grey")

vim.api.nvim_create_user_command("ReviewDiagnostics", function()
  local ns = vim.api.nvim_create_namespace("oxocarbon_grey_review")
  local severities = { "ERROR", "WARN", "INFO", "HINT" }
  local diagnostics = {}
  for i, severity in ipairs(severities) do
    table.insert(diagnostics, {
      lnum = i - 1,
      col = 0,
      end_col = 4,
      severity = vim.diagnostic.severity[severity],
      message = severity:lower() .. " diagnostic for review",
    })
  end
  vim.diagnostic.set(ns, 0, diagnostics)
end, { desc = "Show one sample diagnostic of each severity in the current buffer" })
