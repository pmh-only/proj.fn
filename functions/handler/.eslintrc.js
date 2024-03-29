// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('node:path')

module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}',
        '*.config.js'
      ],
      parserOptions: {
        sourceType: 'script',
        project: path.join(__dirname, '/tsconfig.node.json')
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: path.join(__dirname, '/tsconfig.json')
  },
  rules: {
  }
}
