import { ESLint } from "eslint";

export default {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: "./tsconfig.json",
	},
	plugins: ["@typescript-eslint", "prettier"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	],
	rules: {
		"no-console": "warn",
		"prettier/prettier": ["error"],
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
	},
};
