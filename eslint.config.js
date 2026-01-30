import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['src/*.{tsx}'],
		extends: [
			pluginJs.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
			eslintConfigPrettier,
		],
		languageOptions: {
			globals: { ...globals.browser, ...globals.webextensions },
		},
	},
	{
		files: ['src/*.{ts}'],
		extends: [pluginJs.configs.recommended, tseslint.configs.recommended, eslintConfigPrettier],
		languageOptions: {
			globals: { ...globals.browser, ...globals.webextensions },
		},
	},
]);
