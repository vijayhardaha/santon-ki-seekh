// .eslintrc.js
module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: [ "import" ],
	extends: [ "plugin:@wordpress/eslint-plugin/esnext", "eslint:recommended" ],
	env: {
		es2021: true,
		node: true,
	},
	rules: {
		// Customize ESLint rules here
		"no-console": "off", // Allowing console statements for development/debugging purposes
		"no-unused-expressions": "warn", // Warning for unused expressions
		"no-irregular-whitespace": "warn", // Warning for irregular whitespace
		"no-undef": "warn", // Warning for using undeclared variables
		"no-unused-vars": "warn", // Warning for unused variables
		quotes: [ "error", "double" ], // Enforcing the use of double quotes for strings
		"import/order": [
			"error",
			{
				groups: [ "builtin", "external", "internal" ],
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
				"newlines-between": "always",
				warnOnUnassignedImports: true,
			},
		],
	},
};
