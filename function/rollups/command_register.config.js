import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: './utils/command_register.ts',
  output: {
    format: 'commonjs',
    file: 'dist/command_register.cjs'
  },
  plugins: [
    typescript({
      outputToFilesystem: true
    }),
    nodeResolve(),
    commonjs()
  ]
}
