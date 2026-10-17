import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import checkFile from 'eslint-plugin-check-file'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

const STORAGE_GLOBALS = ['localStorage', 'indexedDB']
const STORAGE_OWNERS = ['window', 'globalThis', 'self']
const STORAGE_READERS = ['src/storage/**', 'public/theme.js']
const STORAGE_MESSAGE = 'Browser storage is only touched in src/storage/.'

const restrictedStorageGlobals = STORAGE_GLOBALS.map((name) => ({
  name,
  message: STORAGE_MESSAGE,
}))

const restrictedStorageProperties = STORAGE_OWNERS.flatMap((object) =>
  STORAGE_GLOBALS.map((property) => ({
    object,
    property,
    message: STORAGE_MESSAGE,
  })),
)

export default defineConfig([
  globalIgnores(['dist', '.claude']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { 'src/**/*.{js,jsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
      'no-restricted-syntax': [
        'error',
        { selector: 'ExportDefaultDeclaration', message: 'Use named exports.' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^\\.\\.(/|$)',
              message: 'Import across folders through @/.',
            },
            {
              regex: '^\\.(/index(\\.js)?)?/?$',
              message: 'Import the sibling file, not its own barrel.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    ignores: STORAGE_READERS,
    rules: {
      'no-restricted-globals': ['error', ...restrictedStorageGlobals],
      'no-restricted-properties': ['error', ...restrictedStorageProperties],
    },
  },
  prettier,
])
