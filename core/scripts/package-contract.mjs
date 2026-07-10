import { createHash } from "node:crypto";
import path from "node:path";
import ts from "typescript";

function symbolKind(symbol, checker) {
  const resolved = symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
  const kinds = [];
  if (resolved.flags & ts.SymbolFlags.Value) kinds.push("value");
  if (resolved.flags & ts.SymbolFlags.Type) kinds.push("type");
  if (resolved.flags & ts.SymbolFlags.Namespace) kinds.push("namespace");
  return kinds.join("+") || "unknown";
}

const declarationPrinter = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: true,
});

function symbolSignature(symbol, checker) {
  const resolved = symbol.flags & ts.SymbolFlags.Alias
    ? checker.getAliasedSymbol(symbol)
    : symbol;
  const declarations = resolved.declarations ?? [];
  const declarationText = declarations
    .map((declaration) =>
      declarationPrinter.printNode(
        ts.EmitHint.Unspecified,
        declaration,
        declaration.getSourceFile(),
      ),
    )
    .sort()
    .join("\n");

  if (!declarationText) {
    throw new Error(`public export has no declaration signature: ${symbol.getName()}`);
  }

  const location = resolved.valueDeclaration ?? declarations[0];
  const publicType = resolved.flags & ts.SymbolFlags.Value
    ? checker.getTypeOfSymbolAtLocation(resolved, location)
    : checker.getDeclaredTypeOfSymbol(resolved);
  const semanticType = checker.typeToString(
    publicType,
    location,
    ts.TypeFormatFlags.NoTruncation |
      ts.TypeFormatFlags.InTypeAlias |
      ts.TypeFormatFlags.UseStructuralFallback |
      ts.TypeFormatFlags.WriteTypeArgumentsOfSignature,
  );

  return createHash("sha256")
    .update(declarationText)
    .update("\0")
    .update(semanticType)
    .digest("hex");
}

function wildcardMatcher(target) {
  const packedTarget = target.startsWith("./") ? target.slice(2) : target;
  const parts = packedTarget.split("*");
  if (parts.length !== 2) return undefined;
  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    match: new RegExp(`^${escapeRegExp(parts[0])}(.+)${escapeRegExp(parts[1])}$`),
    resolve: (substitution) => `${parts[0]}${substitution}${parts[1]}`,
  };
}

export function collectWildcardExportEntries(packageExports, packedPaths) {
  const entries = [];
  const errors = [];

  for (const [subpathPattern, conditions] of Object.entries(packageExports)) {
    if (!subpathPattern.includes("*")) continue;
    const typesTarget = conditions?.types;
    const importTarget = conditions?.import;
    const typesPattern =
      typeof typesTarget === "string" ? wildcardMatcher(typesTarget) : undefined;
    const importPattern =
      typeof importTarget === "string" ? wildcardMatcher(importTarget) : undefined;
    if (!typesPattern || !importPattern || subpathPattern.split("*").length !== 2) {
      errors.push(
        `wildcard export ${subpathPattern} must define matching single-star types and import targets`,
      );
      continue;
    }

    const substitutions = new Set();
    for (const packedPath of packedPaths) {
      const typesMatch = packedPath.match(typesPattern.match);
      const importMatch = packedPath.match(importPattern.match);
      if (typesMatch) substitutions.add(typesMatch[1]);
      if (importMatch) substitutions.add(importMatch[1]);
    }

    for (const substitution of [...substitutions].sort()) {
      const subpath = subpathPattern.replace("*", substitution);
      const types = typesPattern.resolve(substitution);
      const runtime = importPattern.resolve(substitution);
      const hasTypes = packedPaths.has(types);
      const hasRuntime = packedPaths.has(runtime);
      if (!hasRuntime) {
        errors.push(`wildcard export ${subpath} has no JavaScript entry: ${runtime}`);
      }
      if (!hasTypes) {
        errors.push(`wildcard export ${subpath} has no declaration entry: ${types}`);
      }
      if (hasTypes && hasRuntime) {
        entries.push({ subpath, types, import: runtime });
      }
    }
  }

  entries.sort((left, right) => left.subpath.localeCompare(right.subpath));
  errors.sort();
  return { entries, errors };
}

export function collectDeclarationSignature(entryPath, packageRoot = path.dirname(entryPath)) {
  const absoluteEntry = path.resolve(entryPath);
  const absolutePackageRoot = path.resolve(packageRoot);
  const program = ts.createProgram([absoluteEntry], {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    skipLibCheck: true,
    noEmit: true,
  });
  const localDeclarations = program.getSourceFiles()
    .filter((sourceFile) => {
      if (!sourceFile.isDeclarationFile) return false;
      const relativePath = path.relative(absolutePackageRoot, sourceFile.fileName);
      return relativePath !== ""
        && !relativePath.startsWith(`..${path.sep}`)
        && !path.isAbsolute(relativePath);
    })
    .map((sourceFile) => ({
      path: path.relative(absolutePackageRoot, sourceFile.fileName).split(path.sep).join("/"),
      declaration: declarationPrinter.printFile(sourceFile),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));

  if (localDeclarations.length === 0) {
    throw new Error(`declaration entry is missing: ${absoluteEntry}`);
  }

  const hash = createHash("sha256");
  for (const declaration of localDeclarations) {
    hash.update(declaration.path).update("\0").update(declaration.declaration).update("\0");
  }
  return hash.digest("hex");
}

export function collectWildcardApi(packageRoot, entries) {
  return entries
    .map(
      ({ subpath, types }) =>
        `${subpath}:${collectDeclarationSignature(path.join(packageRoot, types), packageRoot)}`,
    )
    .sort();
}

export function collectPublicApi(entryPath) {
  const absoluteEntry = path.resolve(entryPath);
  const program = ts.createProgram([absoluteEntry], {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    skipLibCheck: true,
    noEmit: true,
  });
  const sourceFile = program.getSourceFile(absoluteEntry);
  if (!sourceFile) throw new Error(`public declaration entry is missing: ${absoluteEntry}`);
  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) throw new Error(`public declaration entry is not a module: ${absoluteEntry}`);

  return checker
    .getExportsOfModule(moduleSymbol)
    .map(
      (symbol) =>
        `${symbol.getName()}:${symbolKind(symbol, checker)}:${symbolSignature(symbol, checker)}`,
    )
    .sort();
}
