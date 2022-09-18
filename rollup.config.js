import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import html from 'rollup-plugin-html'
import css from 'rollup-plugin-import-css'
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import sourcemaps from 'rollup-plugin-sourcemaps'
import del from 'rollup-plugin-delete'
import babel from "@rollup/plugin-babel";
import multi from '@rollup/plugin-multi-entry';
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: {
        include: ['src/**/*.ts'],
        entryFileName: 'bundle.js'
    },
    output: {
        sourcemap: true,
        dir: 'dist/dist',
        // entryFileNames: 'bundle.js',
        format: 'cjs',
        esModule: false,
        intro: 'try{if(!exports){exports = {};} }catch(e){var exports = {}};'
        // intro: `try{exports}catch(e){exports = {}}; if (!Object.defineProperty) Object.defineProperty = function(obj, prop, descriptor) {obj[prop] = descriptor.value;};`
    },
    plugins: [
        commonjs(),
        babel({babelHelpers: 'bundled'}),
        multi({
            entryFileNames: 'bundle.js'
        }),
        // nodeResolve({
        //     customResolveOptions: {
        //         moduleDirectory: 'node_modules'
        //     }
        // }),
        // css(),
        // html({ include: '**/*.html' }),
        // json(),
        // copy({
        //     targets: [
        //         { src: 'index.html', dest: 'dist-front' },
        //         { src: 'offline.html', dest: 'dist-front' },
        //         { src: 'service-worker.js', dest: 'dist-front' },
        //         { src: 'manifest.json', dest: 'dist-front' },
        //         { src: 'pwabuilder-sw.js', dest: 'dist-front' },
        //         { src: 'favicon.ico', dest: 'dist-front' },
        //         { src: 'assets', dest: 'dist-front' }
        //     ]
        // }),
        // resolve(),
        typescript({tsconfig: 'tsconfig.rollup.json'}),
        // typescript({ tsconfig: './tsconfig.front.json', clean: true }),
        // sourcemaps(),
        // replace({
        //     preventAssignment: true,
        //     "Object.defineProperty(exports, '__esModule', { value: true });": "",
        //     delimiters: ['\n', '\n']
        // }),
        replace({
            preventAssignment: true,
            'exports.': 'window.',
            delimiters: ['\n', '\n']
        }),
        // replace({
        //     preventAssignment: true,
        //     "Object.defineProperty(exports, '__esModule', { value: true });": "try{if(!exports) {var exports = {}}}catch (e) {var exports = {}} Object.defineProperty(exports, '__esModule', { value: true });",
        //     delimiters: ['\n', '\n']
        // }),
        del({targets: ['dist/dist/*']})
    ]
};
