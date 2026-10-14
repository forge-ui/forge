import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/app/prototype/component-fusion/_review-store.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { createReviewStore, REVIEW_STORAGE_KEY } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

function fixture(initial = null) {
  let persisted = initial;
  let writesFail = false;
  let readsFail = false;
  let storageListener;
  const storage = {
    getItem(key) {
      assert.equal(key, REVIEW_STORAGE_KEY);
      if (readsFail) throw new Error("Storage access denied");
      return persisted;
    },
    setItem(key, value) {
      assert.equal(key, REVIEW_STORAGE_KEY);
      if (writesFail) throw new DOMException("Storage is full", "QuotaExceededError");
      persisted = value;
    },
  };
  const store = createReviewStore(() => storage, listener => {
    storageListener = listener;
    return () => { storageListener = undefined; };
  });
  return {
    store,
    persisted: () => persisted,
    failWrites: value => { writesFail = value; },
    failReads: value => { readsFail = value; },
    otherTabWrite: (value, key = REVIEW_STORAGE_KEY) => {
      if (key === REVIEW_STORAGE_KEY || key === null) persisted = value;
      storageListener?.(key);
    },
  };
}

const oldReview = JSON.stringify({ "001": { decision: "pending", note: "旧备注" } });
const newReview = JSON.stringify({ "001": { decision: "changes", note: "保留最新修改意见" } });

test("readable old storage cannot overwrite newer edits after a quota failure", () => {
  const f = fixture(oldReview);
  const unsubscribe = f.store.subscribe(() => {});
  assert.equal(f.store.getSnapshot().raw, oldReview);
  f.failWrites(true);
  f.store.write(newReview);
  assert.equal(f.persisted(), oldReview);
  assert.deepEqual(f.store.getSnapshot(), { raw: newReview, persistenceFailed: true });
  f.otherTabWrite(oldReview);
  assert.deepEqual(f.store.getSnapshot(), { raw: newReview, persistenceFailed: true });
  f.otherTabWrite(null, null);
  assert.equal(f.store.getSnapshot().raw, newReview);
  unsubscribe();
  f.store.subscribe(() => {});
  assert.equal(f.store.getSnapshot().raw, newReview);
});

test("retry persists the current page copy and clears the failure state", () => {
  const f = fixture(oldReview);
  f.store.subscribe(() => {});
  f.failWrites(true);
  f.store.write(newReview);
  f.store.retry();
  assert.equal(f.store.getSnapshot().persistenceFailed, true);
  f.failWrites(false);
  f.store.retry();
  assert.equal(f.persisted(), newReview);
  assert.deepEqual(f.store.getSnapshot(), { raw: newReview, persistenceFailed: false });
  const remote = JSON.stringify({ "031": { decision: "accepted" } });
  f.otherTabWrite(remote);
  assert.deepEqual(f.store.getSnapshot(), { raw: remote, persistenceFailed: false });
});

test("editing again after storage recovers also saves without a manual retry", () => {
  const f = fixture(oldReview);
  f.failWrites(true);
  f.store.write(newReview);
  f.failWrites(false);
  const updated = JSON.stringify({ ...JSON.parse(f.store.getSnapshot().raw), "002": { note: "第二项" } });
  f.store.write(updated);
  assert.deepEqual(f.store.getSnapshot(), { raw: updated, persistenceFailed: false });
  assert.equal(f.persisted(), updated);
});

test("unavailable storage keeps edits in memory without promising reload persistence", () => {
  const f = fixture();
  f.failReads(true);
  f.failWrites(true);
  assert.deepEqual(f.store.getSnapshot(), { raw: "{}", persistenceFailed: false });
  f.store.subscribe(() => {});
  f.store.write(newReview);
  assert.deepEqual(f.store.getSnapshot(), { raw: newReview, persistenceFailed: true });
  assert.equal(f.persisted(), null);
  assert.equal(fixture(f.persisted()).store.getSnapshot().raw, "{}");
});

test("successful writes, relevant cross-tab updates and clears synchronize normally", () => {
  const f = fixture(oldReview);
  let changes = 0;
  const unsubscribe = f.store.subscribe(() => { changes++; });
  assert.equal(f.store.getSnapshot().raw, oldReview);
  f.store.write(newReview);
  assert.equal(f.persisted(), newReview);
  assert.equal(f.store.getSnapshot().persistenceFailed, false);
  const before = changes;
  f.otherTabWrite("irrelevant", "another-storage-key");
  assert.equal(changes, before);
  assert.equal(f.store.getSnapshot().raw, newReview);
  f.otherTabWrite(oldReview);
  assert.equal(f.store.getSnapshot().raw, oldReview);
  f.otherTabWrite(null, null);
  assert.equal(f.store.getSnapshot().raw, "{}");
  assert.equal(f.store.getSnapshot().persistenceFailed, false);
  unsubscribe();
  const after = changes;
  f.otherTabWrite(newReview);
  assert.equal(changes, after);
});

test("fresh storage leaves the catalog's seven approved defaults unchanged", async () => {
  const catalog = JSON.parse(await readFile(new URL("../src/app/prototype/component-fusion/_catalog-data.json", import.meta.url), "utf8"));
  const f = fixture();
  const raw = JSON.parse(f.store.getSnapshot().raw);
  const approved = catalog.items.filter(item => (raw[item.id]?.decision ?? (item.accepted ? "accepted" : "pending")) === "accepted");
  assert.deepEqual(approved.map(item => item.id).sort(), ["013", "031", "039", "040", "043", "044", "046"]);
  const existing = JSON.stringify({ "031": { decision: "changes", note: "已有评审" } });
  assert.equal(fixture(existing).store.getSnapshot().raw, existing);
});
