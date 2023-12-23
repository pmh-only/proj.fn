import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/handler.ts',
  output: {
    format: 'es',
    file: 'main.mjs'
  },
  plugins: [typescript()]
}
