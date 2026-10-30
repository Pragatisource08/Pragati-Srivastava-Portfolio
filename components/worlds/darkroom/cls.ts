// Class names for the darkroom stylesheet. CSS modules are not available in this
// repo (every .css file is compiled as plain CSS), so `s.trayWrap` resolves to the
// global class "dr-tray-wrap", and darkroom.css scopes everything under .dr-root.
const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const s = new Proxy({} as Record<string, string>, {
  get: (_t, key) => (typeof key === "string" ? `dr-${kebab(key)}` : undefined),
});

export default s;
