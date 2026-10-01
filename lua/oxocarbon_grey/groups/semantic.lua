return function(p)
  local s = p.syntax
  local function fg(color)
    return { fg = color }
  end
  local function italic(color)
    return { fg = color, italic = true }
  end
  local function bold(color)
    return { fg = color, bold = true }
  end

  local groups = {
    ["@lsp.type.namespace"] = fg(s.namespace),
    ["@lsp.type.module"] = fg(s.namespace),
    ["@lsp.type.class"] = fg(s.type),
    ["@lsp.type.enum"] = fg(s.type),
    ["@lsp.type.struct"] = fg(s.type),
    ["@lsp.type.type"] = fg(s.type),
    ["@lsp.type.typeAlias"] = fg(s.type),
    ["@lsp.type.union"] = fg(s.type),
    ["@lsp.type.interface"] = italic(s.type),
    ["@lsp.type.concept"] = italic(s.type),
    ["@lsp.type.typeParameter"] = italic(s.type),
    ["@lsp.type.builtinType"] = italic(s.type),
    ["@lsp.type.parameter"] = italic(s.parameter),
    -- Cleared rather than linked to @variable, so the tree-sitter colours for
    -- built-ins, constants and members underneath a plain variable token survive.
    ["@lsp.type.variable"] = {},
    ["@lsp.type.property"] = fg(s.property),
    ["@lsp.type.enumMember"] = fg(s.constant),
    ["@lsp.type.event"] = fg(s.property),
    ["@lsp.type.function"] = fg(s["function"]),
    ["@lsp.type.method"] = fg(s.method),
    ["@lsp.type.macro"] = fg(s.macro),
    ["@lsp.type.decorator"] = fg(s.decorator),
    ["@lsp.type.label"] = fg(s.label),
    ["@lsp.type.comment"] = italic(s.comment),
    ["@lsp.type.string"] = fg(s.string),
    ["@lsp.type.keyword"] = fg(s.keyword),
    ["@lsp.type.modifier"] = fg(s.storage),
    ["@lsp.type.number"] = fg(s.number),
    ["@lsp.type.regexp"] = fg(s.regex),
    ["@lsp.type.operator"] = fg(s.operator),
    ["@lsp.type.boolean"] = italic(s.builtin),
    ["@lsp.type.character"] = fg(s.string),
    ["@lsp.type.escapeSequence"] = fg(s.escape),
    ["@lsp.type.formatSpecifier"] = fg(s.interpolation),
    ["@lsp.type.lifetime"] = italic(s.lifetime),
    ["@lsp.type.selfKeyword"] = italic(s.self),
    ["@lsp.type.selfTypeKeyword"] = fg(s.type),
    ["@lsp.type.selfParameter"] = italic(s.self),
    ["@lsp.type.clsParameter"] = italic(s.self),
    ["@lsp.type.builtinConstant"] = italic(s.builtin),
    ["@lsp.type.magicFunction"] = fg(s.method),
    ["@lsp.type.intrinsic"] = fg(s.builtin),

    ["@lsp.mod.deprecated"] = { strikethrough = true },
    ["@lsp.typemod.function.declaration"] = { bold = true },
    ["@lsp.typemod.function.definition"] = { bold = true },
    ["@lsp.typemod.function.defaultLibrary"] = fg(s.builtin),
    ["@lsp.typemod.method.declaration"] = { bold = true },
    ["@lsp.typemod.method.definition"] = { bold = true },
    ["@lsp.typemod.variable.defaultLibrary"] = fg(s.builtin),
    ["@lsp.typemod.variable.constant"] = fg(s.constant),
    ["@lsp.typemod.property.declaration"] = fg(s.propertyDeclaration),
    ["@lsp.typemod.class.defaultLibrary"] = italic(s.type),
    ["@lsp.typemod.enum.defaultLibrary"] = italic(s.type),
    ["@lsp.typemod.interface.defaultLibrary"] = italic(s.type),
    ["@lsp.typemod.struct.defaultLibrary"] = italic(s.type),
    ["@lsp.typemod.type.defaultLibrary"] = italic(s.type),
    ["@lsp.typemod.keyword.controlFlow"] = italic(s.keyword),
    ["@lsp.typemod.comment.documentation"] = italic(s.docComment),

    ["@lsp.typemod.variable.readonly.python"] = fg(s.constant),
    ["@lsp.typemod.function.builtin.python"] = fg(s.builtin),
    ["@lsp.typemod.function.parameter.python"] = italic(s.parameter),
    ["@lsp.mod.decorator.python"] = fg(s.decorator),
    ["@lsp.type.keyword.python"] = italic(s.keyword),
    ["@lsp.typemod.variable.readonly.go"] = fg(s.constant),

    ["@lsp.type.keyword.rust"] = fg(s.storage),
    ["@lsp.typemod.keyword.unsafe.rust"] = bold(s.unsafe),
    ["@lsp.typemod.operator.unsafe.rust"] = bold(s.unsafe),
    ["@lsp.typemod.operator.controlFlow.rust"] = bold(s.keyword),
    ["@lsp.typemod.function.defaultLibrary.rust"] = fg(s["function"]),
    ["@lsp.type.macroBang.rust"] = fg(s.macro),
    ["@lsp.type.procMacro.rust"] = fg(s.macro),
    ["@lsp.type.attribute.rust"] = fg(s.decorator),
    ["@lsp.type.attributeBracket.rust"] = fg(s.decorator),
    ["@lsp.type.builtinAttribute.rust"] = fg(s.decorator),
    ["@lsp.type.derive.rust"] = fg(s.decorator),
    ["@lsp.type.deriveHelper.rust"] = fg(s.decorator),
    ["@lsp.type.punctuation.rust"] = fg(s.punctuation),
    ["@lsp.type.const.rust"] = fg(s.constant),
    ["@lsp.type.static.rust"] = fg(s.constant),
    ["@lsp.type.constParameter.rust"] = fg(s.constant),
    ["@lsp.type.toolModule.rust"] = fg(s.namespace),
    ["@lsp.typemod.variable.mutable.rust"] = { underline = true },
    ["@lsp.typemod.parameter.mutable.rust"] = { underline = true },
    ["@lsp.typemod.selfKeyword.mutable.rust"] = { underline = true },

    ["@lsp.mod.deduced.cpp"] = fg(s.storage),
    ["@lsp.typemod.operator.declaration.cpp"] = bold(s["function"]),
    ["@lsp.typemod.function.defaultLibrary.cpp"] = fg(s["function"]),
    ["@lsp.typemod.variable.classScope.cpp"] = fg(s.property),
    ["@lsp.mod.usedAsMutableReference.cpp"] = { underline = true },
    ["@lsp.mod.usedAsMutablePointer.cpp"] = { underline = true },
  }

  for _, ft in ipairs({ "javascript", "javascriptreact", "typescript", "typescriptreact" }) do
    groups["@lsp.typemod.class.defaultLibrary." .. ft] = fg(s.builtin)
  end

  return groups
end
