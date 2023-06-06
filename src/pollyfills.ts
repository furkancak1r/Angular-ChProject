// polyfills.ts dosyasında

// Buffer için polyfill ekleyin
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
  version: "",
  nextTick: require("next-tick"),
};
(window as any).Buffer = require("buffer").Buffer;
