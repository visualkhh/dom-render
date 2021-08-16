import {Config} from '../src/Config';
import {ScopeObject} from '../src/ScopeObject';
import {DomRenderProxy} from '../src/DomRenderProxy';
import {ScopeRawSet} from '../src/ScopeRawSet';
describe('Test', () => {
    test('test', async (done) => {
        // console.log('-->', 'good')
        expect(200).toBe(200)
        done()
    })

    test('test55', async (done) => {
        // console.log('-->', 'good')
        expect(200).toBe(200)
        done()
    })
    test('regex1', async (done) => {
        let text = '-dr-pipe-> <DIV >       <!--%write(super)%--> * <!--%write(it)%--> = <!--%write(super * it)%-->    </DIV>'
        console.log(text)
        const varRegex = /<!--%write\((.*?)\)%-->/gm;
        let varExec = varRegex.exec(text)
        const usingVars = [];
        while (varExec) {
            // text = text.replace(varExec[0], '<!--%' + varExec[1] + '%-->');
            // usingVars.push(varExec[1]);
            console.log(varExec[0], varExec[1])
            varExec = varRegex.exec(varExec.input)
        }
        expect(200).toBe(200)
        done()
    })

    test('regex', async (done) => {
        console.log('-->', 'good')
        const node = {
            textContent: `
                /* aaa */
            
                /*% vava %*/
            
                /*% 3ggurg %*/
            
                /*% dfgdjhi %*/
                .table-class thead {
                    position: sticky;
                    top: 0;
                }
            `
        }

        let text = node.textContent ?? '';
        // const varRegexStr = '\/\*%(.*)%\*\/';
        // const varRegex = RegExp(varRegexStr, 'gm');
        const varRegex = /\/\*%(.*)%\*\//gm;
        let varExec = varRegex.exec(text)
        const usingVars = [];
        while (varExec) {
            text = text.replace(varExec[0], '<!--%' + varExec[1] + '%-->');
            usingVars.push(varExec[1]);
            varExec = varRegex.exec(varExec.input)
        }
        console.log(text)
        expect(200).toBe(200)
        done()
    })
})
