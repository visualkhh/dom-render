import {ScriptUtils} from '../src/utils/script/ScriptUtils';
import {StringUtils} from '../src/utils/string/StringUtils';

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

    test('proxy', async (done) => {
        const user = {name: 'nane', age: 4, addrs: ['2', '3'], friend: {name: 'zz', age: 55}};

        // const usingVars = ScriptUtils.getVariablePaths(`if(true){ this.age; } this[1+2]; this.friend.name; this.friend.age; this.friend.age; this.friend.name.replace('a','a')`)
        const usingVars = ScriptUtils.getVariablePaths('\`${this.friend.name}; ${this.friend.age + this.friend.age2}; ${this.friend.name.replace(1,2)}\`')
        console.log('----->', usingVars);
        // console.log(destUser.addrs[1]);
        // console.log(destUser.friend.name);

        expect(200).toBe(200)
        done()
    })

    test('regex1', async (done) => {
        let text = '${asd}    ㅁㄴㅇㅁㄴㅇ ㅁㄴ ${asdasd}';
        console.log(text)
        const varRegex = /(?<=\$\{).*?(?=\})/gm;
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
    /*
    search()  - 첫번째로 매칭되는것의 인덱스를 반환하며, 일치하는 부분이 없다면 -1 리턴
    test()  - 매칭되는것이 있다면 true 없다면 false 리턴
    match() - 매칭되는것이 있다면 매칭된 문자열 출력
    */
    test('regex-utile', async (done) => {
        const text = '${asd}    ㅁㄴㅇㅁㄴㅇ ㅁㄴ ${asdasd}';
        const a = StringUtils.regexExec(/\$\{.*?\}/g, text);
        console.log(a)
        expect(200).toBe(200)
        done()
    })

    test('regex-replace', async (done) => {
        // let text = '${this.name}  = ${this.name} ${this.name + \'zzz\'} ${this.name}  = ${this.name <= 1 ? 1 : 2}';
        let text = '${#it# <= 5 ? \'1\' : \'2\'}';
        const a = StringUtils.regexExec(/\$\{.*?\}/g, text);

        const az = {
            name: 'z'
        }
        a.reverse().map(it => { return {start: '', end: '', regexArr: it} }).forEach(it => {
            text = text.substr(0, it.regexArr.index) + text.substr(it.regexArr.index).replace(it.regexArr[0], `<zzz>${it.regexArr[0]}</zzz>`);
        })

        console.log(text)

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
