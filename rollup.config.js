import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/docsify-sidebar-collapse.js',
    format: 'umd'
  },
  plugins: [
    postcss(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    }),
    resolve({
      jsnext: true
    }),
    commonjs()
  ]
}
