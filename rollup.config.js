import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
export default {
    input: 'src/DomRenderCompiler.ts',
    output: {
        dir: 'dist',
        format: 'cjs'
    },
    plugins: [
        typescript(),
        replace({
            "Object.defineProperty(exports, '__esModule', { value: true });": 'try{if(!exports) {var exports = {}}}catch (e) {var exports = {}} Object.defineProperty(exports, \'__esModule\', { value: true });',
            delimiters: ['\n', '\n']
        })
    ]
};
