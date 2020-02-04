import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import rimraf from 'rimraf'
import path from 'path'

rimraf.sync(path.resolve(__dirname, 'umd'))

export default [
  // normal
  {
    input: 'src/index.js',
    plugins: [
      resolve(),
      commonjs()
    ],
    output: [{
      file: 'umd/q-api-validation.js',
      format: 'umd',
      name: 'q-api-validation'
    }]
  },
  // minified
  {
    input: 'src/index.js',
    plugins: [
      terser(),
      resolve(),
      commonjs()
    ],
    output: [{
      file: 'umd/q-api-validation.min.js',
      format: 'umd',
      name: 'q-api-validation'
    }]
  },
  // polyfilled
  {
    input: 'src/index.js',
    plugins: [
      resolve(),
      commonjs(),
      babel()
    ],
    output: [{
      file: 'umd/q-api-validation.polyfill.js',
      format: 'umd',
      name: 'q-api-validation'
    }]
  },
  // polyfilled and minified
  {
    input: 'src/index.js',
    plugins: [
      terser(),
      resolve(),
      commonjs(),
      babel()
    ],
    output: [{
      file: 'umd/q-api-validation.polyfill.min.js',
      format: 'umd',
      name: 'q-api-validation'
    }]
  }
]
