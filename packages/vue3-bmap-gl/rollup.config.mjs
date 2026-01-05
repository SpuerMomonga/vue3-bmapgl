import path from 'node:path'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'
import { globSync } from 'tinyglobby'

const plugins = [
  vue(),
  vueJsx(),
  nodeResolve({
    extensions: ['.mjs', '.js', '.json', '.ts'],
  }),
  commonjs(),
  esbuild({
    sourceMap: true,
    target: 'esnext',
    loaders: {
      '.vue': 'ts',
    },
  }),
  postcss({
    modules: true,
    extract: false,
    inject: true,
    minimize: true,
    extensions: ['.css'],
  }),
]

const esm = defineConfig({
  input: globSync('src/**/*.{ts,js,vue,tsx}'),
  plugins: [del({ targets: 'es', hook: 'buildStart' }), ...plugins, typescript({ tsconfig: './tsconfig.json', declarationDir: 'es' })],
  external: ['vue'],
  output: {
    module: 'ESNext',
    format: 'esm',
    dir: 'es',
    entryFileNames: `[name].mjs`,
    preserveModules: true,
    preserveModulesRoot: path.resolve('./', 'src'),
    sourcemap: true,
  },
  treeshake: {
    moduleSideEffects: false,
  },
})

const cjs = defineConfig({
  input: globSync('src/**/*.{ts,js,vue,tsx}'),
  plugins: [del({ targets: 'lib', hook: 'buildStart' }), ...plugins, typescript({ tsconfig: './tsconfig.json', declarationDir: 'lib' })],
  external: ['vue'],
  output: {
    module: 'CommonJS',
    format: 'cjs',
    dir: 'lib',
    entryFileNames: `[name].js`,
    preserveModules: true,
    preserveModulesRoot: path.resolve('./', 'src'),
    sourcemap: true,
  },
  treeshake: {
    moduleSideEffects: false,
  },
})

const devUmd = defineConfig({
  input: path.resolve('./src/index.ts'),
  plugins: [
    del({ targets: 'dist/index.js', hook: 'buildStart' }),
    replace({
      values: {
        __DEV__: 'process.env.NODE_ENV !== \'production\'',
      },
      preventAssignment: true,
    }),
    ...plugins,
  ],
  external: ['vue'],
  output: {
    file: path.resolve('dist/index.js'),
    name: 'Vue3Bmapgl',
    format: 'umd',
  },
})

const prodUmd = defineConfig({
  input: path.resolve('./src/index.ts'),
  plugins: [
    del({ targets: 'dist/index.prod.js', hook: 'buildStart' }),
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      preventAssignment: true,
    }),
    terser(),
    ...plugins,
  ],
  external: ['vue'],
  output: {
    file: path.resolve('dist/index.prod.js'),
    name: 'Vue3Bmapgl',
    format: 'umd',
  },
})

export default defineConfig([esm, cjs, devUmd, prodUmd])
