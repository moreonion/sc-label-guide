module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    'space-before-function-paren' : ['error', 'never'],
    'keyword-spacing': 'off',
    'space-infix-ops': 'off',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn'
  },
  globals: {}
}
