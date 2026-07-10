import ts from "typescript";

function propertyNameText(name, sourceFile) {
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return name.getText(sourceFile);
}

function propertyPath(property, sourceFile) {
  const parts = [propertyNameText(property.name, sourceFile)];
  let objectLiteral = property.parent;

  while (ts.isObjectLiteralExpression(objectLiteral)) {
    let wrappedExpression = objectLiteral;
    while (
      (ts.isAsExpression(wrappedExpression.parent)
        || ts.isSatisfiesExpression(wrappedExpression.parent)
        || ts.isParenthesizedExpression(wrappedExpression.parent))
      && wrappedExpression.parent.expression === wrappedExpression
    ) {
      wrappedExpression = wrappedExpression.parent;
    }
    const container = wrappedExpression.parent;
    if (ts.isPropertyAssignment(container) && container.initializer === wrappedExpression) {
      parts.unshift(propertyNameText(container.name, sourceFile));
      objectLiteral = container.parent;
      continue;
    }
    if (ts.isVariableDeclaration(container) && container.initializer === wrappedExpression) {
      parts.unshift(container.name.getText(sourceFile));
    }
    break;
  }

  return parts.join(".");
}

function collectAliasValues(node, aliasPath, sourceFile, hits) {
  if (ts.isStringLiteralLike(node)) {
    if (node.text.includes("fg-red")) hits.push({ aliasPath, value: node.text });
    return;
  }

  if (ts.isObjectLiteralExpression(node)) {
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = propertyNameText(property.name, sourceFile);
      collectAliasValues(property.initializer, `${aliasPath}.${key}`, sourceFile, hits);
    }
    return;
  }

  if (ts.isArrayLiteralExpression(node)) {
    node.elements.forEach((element, index) => {
      collectAliasValues(element, `${aliasPath}[${index}]`, sourceFile, hits);
    });
    return;
  }

  ts.forEachChild(node, (child) => collectAliasValues(child, aliasPath, sourceFile, hits));
}

export function scanSemanticAliases(source, fileName = "source.tsx") {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const hits = [];

  function visit(node) {
    if (
      ts.isPropertyAssignment(node)
      && propertyNameText(node.name, sourceFile) === "orange"
    ) {
      collectAliasValues(node.initializer, propertyPath(node, sourceFile), sourceFile, hits);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return hits;
}
