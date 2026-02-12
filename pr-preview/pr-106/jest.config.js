export default {
  transform: {},
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "pixi-viewport": "<rootDir>/test/__mocks__/pixi-viewport.js",
    "pixi\\.min\\.mjs$": "<rootDir>/test/__mocks__/pixi.js",
  },
};
