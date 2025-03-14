// eslint.config.js
import reactPlugin from 'eslint-plugin-react';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  // 1) Basic ignores
  {
    ignores: ['dist/**/*'],
  },
  // 2) Your main config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tsPlugin,
     
    },
    rules: {
      // Merge recommended rule sets (React, TS). 
      // The "flat config" does not support `extends: ["plugin:react/recommended"]`
      // so you must apply them manually like so:
      ...reactPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',

      // Prettier must come last so it can override other styles:
      'prettier/prettier': 'error',

      // Example custom overrides:
      'react/react-in-jsx-scope': 'off', // Not needed in modern React
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
