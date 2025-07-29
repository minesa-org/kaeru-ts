import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import plugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";

export default [
	js.configs.recommended,
	{
		files: ["**/*.ts", "**/*.d.ts"],
		ignores: ["node_modules/**", "dist/**"],
		languageOptions: {
			parser,
			parserOptions: {
				project: "./tsconfig.json",
				sourceType: "module",
			},
			globals: {
				console: "readonly",
				process: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
			},
			ecmaVersion: "latest",
			sourceType: "module",
		},
		plugins: {
			"@typescript-eslint": plugin,
			prettier,
		},
		rules: {
			"no-console": "off",
			"prettier/prettier": "error",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];
