export function recursivelyStripNullValues(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(recursivelyStripNullValues);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        recursivelyStripNullValues(val),
      ]),
    );
  }

  if (value !== null) {
    return value;
  }
}
