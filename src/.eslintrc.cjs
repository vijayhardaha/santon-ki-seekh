module.exports = {
  extends: "airbnb-base",
  env: {
    node: true,
  },
  rules: {
    indent: ["error", 2],
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "comma-dangle": ["error", "always-multiline"],
    "arrow-parens": ["error", "always"],
    "no-console": "off",
    "no-unused-vars": "error",
    "no-const-assign": "error",
    "no-var": "error",
    "prefer-const": "error",
    "no-multiple-empty-lines": ["error", { max: 2 }],
    "brace-style": ["error", "1tbs"],
    "max-len": ["error", { code: 150 }],
    "import/extensions": ["error", { js: "always" }],
  },
};
