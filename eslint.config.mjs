/* eslint-disable import/no-extraneous-dependencies */
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importHelpers from 'eslint-plugin-import-helpers';
import { importX } from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    ignores: ['**/build/', '**/node_modules/', '**/dist/'],
    extends: compat.extends(
      'airbnb-base',
      'plugin:@typescript-eslint/recommended',
      'prettier',
      'plugin:prettier/recommended',
    ),

    plugins: {
      'import-helpers': importHelpers,
      prettier,
      'import-x': importX,
    },

    rules: {
      'prettier/prettier': 'error',
      'no-useless-constructor': 'off',
      'import/prefer-default-export': 'off',
      'no-underscore-dangle': 'off',
      'no-console': 'off',
      'class-methods-use-this': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],

          custom: {
            regex: '^I[A-Z]',
            match: true,
          },
        },
      ],

      'import-helpers/order-imports': [
        'warn',
        {
          groups: ['module', '/^@/.+$/', ['parent', 'sibling', 'index']],

          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],
    },
  },
  ...tseslint.configs.recommended,
]);
