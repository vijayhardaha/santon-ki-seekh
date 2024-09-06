// .eslintrc.js
module.exports = {
	root: true,
	extends: [
		"next",
		"next/core-web-vitals",
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:prettier/recommended", // Add Prettier integration
	],
	plugins: ["react", "jsx-a11y", "import", "prettier"],
	rules: {
		// Customize ESLint rules here
		"react/react-in-jsx-scope": "off", // Next.js does not require importing React in JSX files.
		"prettier/prettier": "error", // Enforce Prettier formatting as errors.
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
