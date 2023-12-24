import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default {
  input: './src/main.ts',
  output: {
    format: 'es',
    file: 'dist/main.mjs'
  },
  plugins: [
    typescript({
      outputToFilesystem: true
    }),
    nodeResolve(),
    commonjs(),
    json(),
    terser()
  ]
}
