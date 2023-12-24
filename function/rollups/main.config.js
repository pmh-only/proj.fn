import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './src/main.ts',
  output: {
    format: 'es',
    file: 'dist/main.mjs'
  },
  plugins: [
    typescript(),
    nodeResolve(),
    commonjs()
  ]
}
