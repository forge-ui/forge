import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { execFileSync } from 'node:child_process';
const data = JSON.parse(fs.readFileSync('src/app/components/_agent-api-data.json', 'utf8'));
const comparison = JSON.parse(fs.readFileSync('docs/public-api-comparison.json', 'utf8'));
test('ChatInputBar reference includes every declared property and exact send signature', () => {
  const file = ts.createSourceFile('chat.tsx', fs.readFileSync('core/src/components/ui/chat-input-bar.tsx', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fn = file.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === 'ChatInputBar');
  const props = fn.parameters[0].type.members.map(m => m.name.getText(file));
  assert.deepEqual(data.ChatInputBar.props.map(p => p.name).sort(), props.sort());
  const send = data.ChatInputBar.props.find(p => p.name === 'onSend').type;
  assert.match(send, /ChatInputBarQuickAction/);
  assert.match(send, /ChatInputBarSendContext/);
});
test('every agent component renders its full parameter reference', () => {
  const page = fs.readFileSync('src/app/components/agent/page.tsx', 'utf8');
  for (const [name, component] of Object.entries(comparison.current.components)) {
    if (!component.file.includes('/agent/')) continue;
    const source = ts.createSourceFile('agent.tsx', page, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let referenceCount = 0;
    function visit(node) {
      if (ts.isJsxSelfClosingElement(node) && ['AgentApi', 'CompleteApiReference'].includes(node.tagName.getText(source))) {
        const prop = node.attributes.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.text === 'name');
        if (prop?.initializer && ts.isStringLiteral(prop.initializer) && prop.initializer.text === name) referenceCount++;
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
    assert.equal(referenceCount, 1, `${name}: expected one parameter reference`);
    assert.deepEqual(data[name].props.map(p => p.name), component.props.map(p => p.name));
  }
});
test('comparison retains all main public exports and component parameters', () => {
  assert.deepEqual(comparison.removedExports, []);
  for (const component of comparison.comparisons) assert.deepEqual(component.removed, [], component.name);
});
test('reference describes domain fields rather than built-in String methods', () => {
  for (const type of data.ChatInputBar.types) assert.ok(!type.fields.some(f => f.name === 'charAt'), type.name);
  assert.ok(data.ChatInputBar.types.find(t => t.name === 'ComposerSource').fields.some(f => f.name === 'avatarSrc'));
  assert.ok(data.ChatInputBar.types.find(t => t.name === 'ChatInputBarSendContext').fields.some(f => f.name === 'replyTo'));
  assert.match(data.ChatInputBar.types.find(t => t.name === 'ComposerStatus').definition, /stopping/);
});

test('generated comparison matches current source and main', () => {
  execFileSync(process.execPath, ['scripts/audit-public-api-comparison.mjs', '--check'], { stdio: 'pipe' });
});
