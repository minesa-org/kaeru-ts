// .eslint.config.js
import js from "@eslint/js";
import { globSync } from "glob";

/** @type {import('eslint').Linter.Config} */
export default [
	js.configs.recommended,

	{
		files: ["**/*.js"],
		ignores: ["node_modules/**", "dist/**"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...js.configs.recommended.languageOptions.globals,
				console: true,
				process: true,
				__dirname: true,
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		rules: {
			"no-console": "off",
			"no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			"no-undef": "error",
			"no-empty": ["warn", { allowEmptyCatch: true }],
		},
	},

	{
		files: ["**/*.js"],
		plugins: {
			prettier: await import("eslint-plugin-prettier"),
		},
		rules: {
			"prettier/prettier": "error",
		},
	},
];
