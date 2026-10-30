const js = require('@eslint/js');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const imports = require('eslint-plugin-import');
const { fixupPluginRules } = require('@eslint/compat');

module.exports = [{
  files: ['src/**/*.{ts,tsx,js,jsx}'],
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: { ...globals.browser, ...globals.node },
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    react: fixupPluginRules(react),
    import: fixupPluginRules(imports),
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      alias: {
        map: [
          ['@renderer', './src/renderer'], ['@pages', './src/renderer/pages'],
          ['@components', './src/renderer/components'], ['@common', './src/common'],
          ['@main', './src/main'], ['@src', './src'],
          ['@styles', './src/renderer/styles'], ['@assets', './assets'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: { version: 'detect' },
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tsPlugin.configs['eslint-recommended'].overrides[0].rules,
    ...tsPlugin.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...imports.configs.errors.rules,
    ...imports.configs.warnings.rules,
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  },
}];
