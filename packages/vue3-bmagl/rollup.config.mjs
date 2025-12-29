import path from 'node:path'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import esbuild from 'rollup-plugin-esbuild'
import { globSync } from 'tinyglobby'

const buildConfig = [
  {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      dir: 'es',
    },
  },
  {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      dir: 'lib',
    },
  },
]

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
]

export default defineConfig(buildConfig.map(config => ({
  input: globSync('src/**/*.{ts,js,vue,tsx}'),
  plugins: [del({ targets: config.output.dir, hook: 'buildStart' }), ...plugins, typescript({ tsconfig: './tsconfig.json', declarationDir: config.output.dir, module: config.module })],
  external: ['vue'],
  output: {
    module: config.module,
    format: config.format,
    dir: path.resolve(config.output.dir),
    entryFileNames: `[name].${config.ext}`,
    preserveModules: true,
    preserveModulesRoot: path.resolve('./', 'src'),
    sourcemap: true,
  },
  treeshake: {
    moduleSideEffects: false,
  },
})))
