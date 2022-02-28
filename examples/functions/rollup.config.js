import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace'
import html from 'rollup-plugin-html'
import css from 'rollup-plugin-import-css'
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'index.ts',
    output: {
        sourcemap: true,
        dir: 'dist',
        entryFileNames: 'bundle.js',
        format: 'cjs',
        esModule: false,
        intro: 'try{if(!exports){exports = {};} }catch(e){var exports = {}};'
    },
    plugins: [
        css(),
        html({ include: '**/*.html' }),
        json(),
        copy({
            targets: [
                { src: 'index.html', dest: 'dist' },
                { src: 'assets', dest: 'dist' }
            ]
        }),
        commonjs(),
        nodeResolve(),
        typescript({tsconfig: 'tsconfig.json'}),
        replace({
            preventAssignment: true,
            'exports.': 'window.',
            delimiters: ['\n', '\n']
        }),
        del({targets: ['dist/*']})
    ]
};
