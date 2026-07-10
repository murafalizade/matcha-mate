import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // This is a React Native app (Expo Router) that also runs on web via
        // react-native-web, plus Metro/Node-only config files — union of all
        // three runtimes rather than picking one.
        ...globals.node,
        ...globals.browser,
        ...globals.es2024,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
      import: importPlugin,
      'unused-imports': unusedImports,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // ===== PRETTIER =====
      'prettier/prettier': 'error',

      // ===== TYPESCRIPT =====
      'no-undef': 'off', // TypeScript handles this; no-undef can't see TS global types
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports plugin below
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // ===== REACT =====
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // not needed with the automatic JSX runtime
      'react/prop-types': 'off', // TypeScript handles this
      'react/display-name': 'off', // noisy for small inline components (render-prop callbacks, etc.)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
  

      // ===== IMPORT ORDER =====
      'import/order': [
        'error',
        {
          groups: [
            'builtin',  // Node.js built-ins (fs, path, crypto …)
            'external', // npm packages
            'internal', // absolute paths / workspace packages
            'parent',   // ../something
            'sibling',  // ./something
            'index',    // ./index
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': 'error',

      // ===== UNUSED IMPORTS =====
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // ===== CODE QUALITY =====
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-alert': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      'no-duplicate-imports': 'error',

      // ===== BEST PRACTICES =====
      curly: ['error', 'all'],
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'require-await': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unreachable': 'error',

      // ===== STYLE =====
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'quote-props': ['error', 'as-needed'],
      'prefer-rest-params': 'error',
      'no-param-reassign': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      'no-unused-vars': 'off',
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
  },

  // Plain JS/JSX files (e.g. jest-expo snapshot tests) aren't part of the
  // TypeScript program, so they get the default (non-TS) parser here, with
  // JSX parsing turned on explicitly since espree doesn't enable it by default.
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2024,
        ...globals.jest,
      },
    },
    plugins: {
      prettier: prettier,
      import: importPlugin,
      'unused-imports': unusedImports,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'prettier/prettier': 'error',
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Relaxed rules for test files (this project uses jest-expo with
  // `__tests__/*-test.{js,ts,tsx}` naming, not *.spec.ts)
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}', '**/*-test.{js,jsx,ts,tsx}', '**/*.test.{js,jsx,ts,tsx}'],
    rules: {
      'require-await': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  {
    ignores: [
      '**/node_modules/**',
      '**/.expo/**',
      '**/dist/**',
      '**/web-build/**',
      '**/android/**',
      '**/ios/**',
      '**/build/**',
      '**/coverage/**',
      '*.config.js',
      '*.config.ts',
      '*.config.mjs',
      '**/expo-env.d.ts',
      '**/nativewind-env.d.ts',
    ],
  },
];
