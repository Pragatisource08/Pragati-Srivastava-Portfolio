// Class names for the city world. Every class is prefixed `city-` and every rule in
// city.css is scoped under `.city-root`, so nothing leaks into other worlds.
// (CSS modules are not available in this repo: Turbopack sends all CSS through Tailwind.)
export const s = new Proxy({} as Record<string, string>, {
  get: (_t, key) => `city-${String(key)}`,
});
