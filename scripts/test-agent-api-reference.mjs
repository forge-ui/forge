import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const data = JSON.parse(fs.readFileSync('src/app/components/_agent-api-data.json', 'utf8'));

function propNames(file, typeNode) {
  let type = typeNode;
  if (type && ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
    const alias = file.statements.find(n => ts.isTypeAliasDeclaration(n) && n.name.text === type.typeName.text);
    if (alias) type = alias.type;
  }
  assert.ok(type && ts.isTypeLiteralNode(type));
  return type.members.map(member => member.name.getText(file));
}

function sourceProps(filePath, functionName) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const file = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fn = file.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === functionName);
  assert.ok(fn, `${functionName} in ${filePath}`);
  return propNames(file, fn.parameters[0].type);
}

function agentComponents() {
  const dir = 'core/src/components/ui/agent';
  return fs.readdirSync(dir).filter(name => name.endsWith('.tsx')).map(name => {
    const filePath = path.join(dir, name);
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const file = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const fn = file.statements.find(n => ts.isFunctionDeclaration(n) && n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword));
    assert.ok(fn, filePath);
    return { name: fn.name.text, props: propNames(file, fn.parameters[0].type) };
  });
}

test('ChatInputBar reference includes every declared property and exact send signature', () => {
  const props = sourceProps('core/src/components/ui/chat-input-bar.tsx', 'ChatInputBar');
  assert.deepEqual(data.ChatInputBar.props.map(p => p.name).sort(), props.sort());
  const send = data.ChatInputBar.props.find(p => p.name === 'onSend').type;
  assert.match(send, /ChatInputBarQuickAction/);
  assert.match(send, /ChatInputBarSendContext/);
});

test('every agent component renders its full parameter reference', () => {
  const page = fs.readFileSync('src/app/components/agent/page.tsx', 'utf8');
  const source = ts.createSourceFile('agent.tsx', page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const components = agentComponents();
  assert.equal(components.length, 12);
  for (const component of components) {
    let referenceCount = 0;
    function visit(node) {
      if (ts.isJsxSelfClosingElement(node) && ['AgentApi', 'CompleteApiReference'].includes(node.tagName.getText(source))) {
        const prop = node.attributes.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.text === 'name');
        if (prop?.initializer && ts.isStringLiteral(prop.initializer) && prop.initializer.text === component.name) referenceCount++;
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    assert.equal(referenceCount, 1, `${component.name}: expected one parameter reference`);
    assert.deepEqual(data[component.name].props.map(p => p.name), component.props);
  }
});

test('reference describes domain fields rather than built-in String methods', () => {
  for (const type of data.ChatInputBar.types) assert.ok(!type.fields.some(f => f.name === 'charAt'), type.name);
  assert.ok(data.ChatInputBar.types.find(t => t.name === 'ComposerSource').fields.some(f => f.name === 'avatarSrc'));
  assert.ok(data.ChatInputBar.types.find(t => t.name === 'ChatInputBarSendContext').fields.some(f => f.name === 'replyTo'));
  assert.match(data.ChatInputBar.types.find(t => t.name === 'ComposerStatus').definition, /stopping/);
});
