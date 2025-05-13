import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'react/no-unstable-context-value': 'off',
    'react-refresh/only-export-components': 'off',
    'node/prefer-global/process': 'off',
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'react/no-array-index-key': 'off',
    'antfu/no-top-level-await': 'off',
    'style/jsx-one-expression-per-line': 'off',
    'react-dom/no-dangerously-set-innerhtml': 'off',
    'react-dom/no-missing-button-type': 'off',
    'react/prefer-destructuring-assignment': 'off',
  },
  ignores: [
    '.next',
    'public/*',
    'build',
    'dist',
    'api',
  ],
})
