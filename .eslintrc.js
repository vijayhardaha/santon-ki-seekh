module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:import/recommended", // Ensure proper import/export handling.
		"plugin:jsx-a11y/recommended",
		"plugin:prettier/recommended",
	],
	plugins: ["import", "jsx-a11y", "prettier"],
	env: {
		node: true, // Ensure the node environment is enabled.
		es2024: true, // Enable latest ECMAScript features.
	},
	parser: "@babel/eslint-parser", // Babel parser ensures ES module syntax is recognized.
	parserOptions: {
		ecmaVersion: 2024, // Latest ECMAScript features.
		sourceType: "module", // Enable ES module syntax.
		requireConfigFile: false, // Disable need for babel.config.json.
	},
	rules: {
		"prettier/prettier": "error", // Ensure Prettier formats are enforced.
		"import/order": [
			"error",
			{
				groups: ["builtin", "external", "internal"],
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
				"newlines-between": "always",
			},
		],
	},
	settings: {
		"import/resolver": {
			node: {
				extensions: [".js", ".mjs", ".json"],
			},
		},
	},
};
