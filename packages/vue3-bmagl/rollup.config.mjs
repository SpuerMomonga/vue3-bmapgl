import { defineConfig } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
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
  typescript({ tsconfig: './tsconfig.json' }),
]

export default defineConfig([
  {
    input: globSync('src/**/*.{ts,js,vue,tsx}'),
    plugins,
    external: ['vue'],
    output: {
      module: 'ESNext',
      format: 'esm',
      dir: './es',
      entryFileNames: `[name].mjs`,
      preserveModules: true,
      preserveModulesRoot: path.resolve('./', 'src'),
      sourcemap: true,
    },
    treeshake: {
      moduleSideEffects: false,
    },
  }
])