import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano';
import { eslint } from "rollup-plugin-eslint"

const isDev = process.env.NODE_ENV !== 'production';

const postcssPlugin = [
  autoprefixer
]

if (!isDev) {
  postcssPlugin.push(cssnano)
}

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/vs-tree.js',
    format: 'umd',
    name: 'vsTree',
    exports: 'named'
  },
  plugins: [
    json(),
    commonjs(),
    eslint({
      fix: true,
      include: ['./src/**'],
      exclude: ['node_modules/**', 'src/less/**']
    }),
    babel({ babelHelpers: 'bundled' }),
    postcss({
      plugins: postcssPlugin,
      extract: 'vs-tree.css',
    }),
    !isDev && terser()
  ]
};