module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "sourceType": "module",
    "ecmaVersion": 2020,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "arrow-parens": ["error", "always"],
    "brace-style": ["error", "1tbs"],
    "comma-dangle": ["error", "always-multiline"],
    "indent": ["error", 2],
    "max-len": ["error", {code: 120}],
    "no-console": "off",
    "no-const-assign": "error",
    "no-multiple-empty-lines": ["error", {max: 2}],
    "no-restricted-globals": ["error", "name", "length"],
    "no-unused-vars": "error",
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "semi": ["error", "always"],
  },
  globals: {},
};
