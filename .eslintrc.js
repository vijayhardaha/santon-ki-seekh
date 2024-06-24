// .eslintrc.js example
module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: ["eslint:recommended", "google"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
};
