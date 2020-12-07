import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'vsTree'
  },
  plugins: [
    json(),
    commonjs()
  ]
};