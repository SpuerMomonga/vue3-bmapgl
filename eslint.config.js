import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    vue: true,
    typescript: true,
    regexp: false,
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      'n/prefer-global/process': 'off',
      // 'no-control-regex': 'off',
      'toml/padding-line-between-pairs': 'off',
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/brace-style': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      'ts/no-unsafe-function-type': 'off',
      'ts/no-namespace': 'off',
      'unicorn/error-message': 'off',
      'pnpm/yaml-enforce-settings': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
    ignores: [
      'node_modules',
      'lib',
      'dist',
      'es',
    ],
  },
)
