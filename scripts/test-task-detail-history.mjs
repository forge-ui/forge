import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/app/templates/task-board/_use-task-detail-history.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup() {
  const effects = [], listeners = new Map(), queue = [], prompts = [], reads = [];
  const entries = [{ url: 'http://localhost/templates/task-board', state: { existing: 'preserved' } }];
  let cursor = 0, dirty = false;
  const location = {};
  const sync = () => Object.assign(location, { href: entries[cursor].url, pathname: new URL(entries[cursor].url).pathname, search: new URL(entries[cursor].url).search, hash: new URL(entries[cursor].url).hash });
  sync();
  const history = {
    get state() { return entries[cursor].state; },
    replaceState(state, _title, url) { entries[cursor] = { state, url: url ? new URL(url, location.href).href : location.href }; sync(); },
    pushState(state, _title, url) { entries.splice(cursor + 1); entries.push({ state, url: new URL(url, location.href).href }); cursor++; sync(); },
    go(delta) { assert.notEqual(delta, 0); queue.push(delta); },
  };
  const loaded = { exports: {} };
  vm.runInNewContext(compiled, { exports: loaded.exports, require: name => {
    assert.equal(name, 'react'); return { useRef: current => ({ current }), useEffect: effect => effects.push(effect) };
  }, history, location, window: { addEventListener: (name, handler) => listeners.set(name, handler), removeEventListener: name => listeners.delete(name) } });
  const guard = { current: proceed => dirty ? prompts.push(proceed) : proceed() };
  const write = loaded.exports.useTaskDetailHistory(guard, hash => reads.push(hash));
  effects.forEach(effect => effect());
  const flushOne = () => {
    const delta = queue.shift(); if (delta === undefined) return;
    const next = cursor + delta; if (next < 0 || next >= entries.length) return;
    cursor = next; sync(); listeners.get('popstate')();
  };
  const flush = () => { let count = 0; while (queue.length) { assert.ok(count++ < 40, 'history restoration must converge'); flushOne(); } };
  return { history, location, entries, prompts, reads, write, flush, flushOne, dirty: value => { dirty = value; }, approve: () => { const proceed = prompts.at(-1); assert.ok(proceed); dirty = false; proceed(); } };
}
{
  const s = setup(); s.write('#task/a'); s.write('#task/a/child');
  assert.equal(s.history.state.existing, 'preserved');
  s.history.go(-1); s.flush(); assert.equal(s.location.hash, '#task/a');
  s.history.go(1); s.flush(); assert.equal(s.location.hash, '#task/a/child');
}
{
  const s = setup(); s.write('#task/a'); s.write('#task/a/child'); s.dirty(true);
  s.history.go(-1); s.flush(); assert.equal(s.location.hash, '#task/a/child');
  // Continuing editing is deliberately not a callback to the hook, matching the UI.
  assert.equal(s.prompts.length, 1);
  s.history.go(-1); s.flush(); assert.equal(s.location.hash, '#task/a/child');
  s.approve(); s.flush(); assert.equal(s.location.hash, '#task/a');
  s.history.go(1); s.flush(); assert.equal(s.location.hash, '#task/a/child');
}
{
  const s = setup(); s.write('#task/a'); s.write('#task/a/child'); s.dirty(true);
  s.history.go(-1); s.flushOne();
  // Decide before the queued restoration completes.
  s.approve(); s.flush(); assert.equal(s.location.hash, '#task/a');
}
{
  const s = setup(); s.write('#task/a'); s.write('#task/a/child'); s.dirty(true);
  s.history.go(-1); s.history.go(-1); s.flush();
  assert.equal(s.location.hash, '#task/a/child');
  s.approve(); s.flush(); assert.equal(s.location.hash, '#task/a');
}
{
  const s = setup(); s.write('#task/a'); s.write('#task/a/child');
  s.history.go(-1); s.flush(); s.dirty(true);
  s.history.go(1); s.flush(); assert.equal(s.location.hash, '#task/a');
  s.approve(); s.flush(); assert.equal(s.location.hash, '#task/a/child');
}
console.log('PASS: preserves existing history state; Back/Forward, continue editing, early discard, queued rapid Back and guarded Forward converge without losing entries');
