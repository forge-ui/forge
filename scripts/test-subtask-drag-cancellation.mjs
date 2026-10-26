import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Run the actual pointer handlers with a deferred landing animation, so a blur
// or Escape can race with its completion without relying on wall-clock timing.
const source = await readFile(new URL('../src/app/templates/task-board/_sortable-subtasks.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup() {
  const effects = [], listeners = new Map(), frames = [], animations = [], commits = [];
  const rect = top => ({ top, height: 40, left: 0, width: 300 });
  const slots = ['a', 'b', 'c'].map((id, index) => ({ dataset: { subtaskSortSlot: id }, getBoundingClientRect: () => rect(index * 40) }));
  const root = { querySelectorAll: () => slots, getBoundingClientRect: () => rect(0), parentElement: null };
  const jsx = (type, props) => ({ type, props });
  const loaded = { exports: {} };
  const mocks = {
    react: { useRef: current => ({ current }), useState: initial => [initial, () => {}], useEffect: effect => effects.push(effect) },
    'react-dom': { createPortal: node => node },
    'react/jsx-runtime': { jsx, jsxs: jsx },
    'motion/react': { motion: { div: 'motion.div' }, useReducedMotion: () => false, useMotionValue: () => ({ set() {} }), animate: () => {
      let finish;
      const animation = new Promise(resolve => { finish = resolve; });
      animation.stop = () => { animation.stopped = true; };
      animation.finish = finish; animations.push(animation); return animation;
    } },
  };
  vm.runInNewContext(compiled, {
    exports: loaded.exports, require: name => { assert.ok(name in mocks, name); return mocks[name]; },
    window: { addEventListener: (name, handler) => listeners.set(name, handler), removeEventListener: (name, handler) => { if (listeners.get(name) === handler) listeners.delete(name); } },
    document: { documentElement: { setPointerCapture() {} } },
    requestAnimationFrame: callback => frames.push(callback), cancelAnimationFrame() {},
  });
  const tree = loaded.exports.SortableSubtasks({ items: ['a', 'b', 'c'].map(id => ({ id })), disabled: false, onReorder: ids => commits.push(Array.from(ids)), children: () => null });
  tree.props.ref.current = root;
  const cleanup = effects.map(effect => effect());
  function start() {
    tree.props.children[0][0].props.children.props.onPointerDown({ button: 0, pointerType: 'mouse', clientX: 20, clientY: 10, target: { closest: () => null }, currentTarget: slots[0] });
    listeners.get('pointermove')({ pointerId: 1, clientX: 20, clientY: 110 });
  }
  return { start, listeners, animations, commits, cleanup, release: () => listeners.get('pointerup')({ clientY: 110 }), flush: () => frames.splice(0).forEach(callback => callback()) };
}
{
  const s = setup(); s.start(); const released = s.release();
  assert.equal(s.commits.length, 0);
  s.animations[0].finish(); await released;
  assert.deepEqual(s.commits, [['b', 'c', 'a']]);
}
for (const cancellation of ['blur', 'pointercancel', 'Escape', 'unmount']) {
  const s = setup(); s.start(); const released = s.release();
  let prevented = false;
  if (cancellation === 'Escape') s.listeners.get('keydown')({ key: 'Escape', preventDefault() { prevented = true; }, stopImmediatePropagation() {} });
  else if (cancellation === 'unmount') s.cleanup.forEach(cleanup => cleanup?.());
  else s.listeners.get(cancellation)();
  assert.equal(s.animations[0].stopped, true, cancellation);
  s.animations[0].finish(); await released;
  assert.deepEqual(s.commits, [], cancellation);
  if (cancellation === 'Escape') assert.equal(prevented, true);
}
{
  const s = setup(); s.start(); s.listeners.get('blur')();
  let prevented = false;
  s.listeners.get('click')({ preventDefault() { prevented = true; }, stopPropagation() {} });
  assert.equal(prevented, true);
  await s.release(); assert.deepEqual(s.commits, []);
}
console.log('PASS: normal landing commits once; blur, pointer cancellation, Escape and unmount prevent delayed commits; cancelled dragging suppresses release click');
