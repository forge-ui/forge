function normalizeEntry(entry) {
  return entry.length === 2 ? [entry[0], "", entry[1]] : entry;
}

function fingerprint(file, aliasPath, value) {
  return JSON.stringify([file, aliasPath, value]);
}

export function createSemanticAliasGate(approvedEntries) {
  const remaining = new Map();
  const duplicateEntries = new Map();

  for (const approvedEntry of approvedEntries) {
    const [file, aliasPath, value] = normalizeEntry(approvedEntry);
    const key = fingerprint(file, aliasPath, value);
    if (remaining.has(key)) {
      duplicateEntries.set(key, approvedEntry);
      continue;
    }
    remaining.set(key, approvedEntry);
  }

  return {
    consume(file, aliasPathOrValue, maybeValue) {
      const aliasPath = maybeValue === undefined ? "" : aliasPathOrValue;
      const value = maybeValue === undefined ? aliasPathOrValue : maybeValue;
      const key = fingerprint(file, aliasPath, value);
      if (!remaining.has(key)) return false;
      remaining.delete(key);
      return true;
    },
    finalize() {
      return {
        duplicates: [...duplicateEntries.values()],
        stale: [...remaining.values()],
      };
    },
  };
}
