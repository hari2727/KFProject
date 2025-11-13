import path from 'path';
import { fileURLToPath } from 'url';

/** Parser Object */
import parser from '@typescript-eslint/parser';

/** Plugins Config */
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Note: In ESLint Flat Config file system extends:[] setup moved -> under rules */

const ignoreConfig = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '**/test/**',
    '**/coverage/**',
    '**/*.config.mjs',
    '**/*spec.ts',
  ],
};

const baseConfig = {
  files: ['src/**/*.ts'],
  languageOptions: {
    parser,
    ecmaVersion: 'latest',
    globals: {
      browser: true,
      es2022: true,
      node: true,
      jest: true,
    },
    parserOptions: {
      sourceType: 'module',
      project: ['./tsconfig.json', './tsconfig.build.json'],
      tsconfigRootDir: __dirname,
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
    import: importPlugin,
    prettier: prettierPlugin,
  },
  rules: {
    ...(typescriptEslintPlugin.configs['recommended-type-checked']?.rules ||
      {}),
    ...(typescriptEslintPlugin.configs['stylistic-type-checked']?.rules || {}),
    ...(importPlugin.configs.recommended?.rules || {}),
    ...(prettierPlugin.configs.prettier?.rules || {}),
    /** TypeScript ESLint rules */
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    /** Import rules */
    'import/default': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-unresolved': 'off',
    /** Prettier rules */
    'prettier/prettier': 'error',
    /** Other Rules */
    'max-lines': [
      'error',
      { max: 500, skipBlankLines: true, skipComments: true },
    ],
  },
};

export default [ignoreConfig, { ...baseConfig }];
