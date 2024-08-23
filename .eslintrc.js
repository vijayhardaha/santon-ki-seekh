// .eslintrc.js
module.exports = {
	root: true,
	extends: [
		"next",
		"next/core-web-vitals",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:jsx-a11y/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint", "jsx-a11y", "import"],
	rules: {
		// Customize ESLint rules here
		"react/react-in-jsx-scope": "off", // Next.js does not require importing React in JSX files
		"@typescript-eslint/explicit-module-boundary-types": "off", // Example customization
		"import/order": [
			"error",
			{
				groups: ["builtin", "external", "internal"],
				pathGroups: [
					{
						pattern: "react",
						group: "external",
						position: "before",
					},
				],
				pathGroupsExcludedImportTypes: ["react"],
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
				"newlines-between": "always",
				warnOnUnassignedImports: true,
			},
		],
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
