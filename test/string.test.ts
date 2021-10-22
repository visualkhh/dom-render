import {ScriptUtils} from '../src/utils/script/ScriptUtils';
import {StringUtils} from '../src/utils/string/StringUtils';
import {Range} from '../src/iterators/Range';

describe('Test', () => {
    test('test', async (done) => {
        const data = 'Tex #{hljs.highlight(this.quickStartCli, {language: \'shell\'})} t to se${ㅁㄴㅇ}e matches. Roll over #{ㅁㄴㅇㅁㄴㅇ}matches or the expressi'
        // const a = StringUtils.betweenReplace('${','}', 're${4124}ated ${by gs}kinner.asd')
        // const a = StringUtils.betweenRegexpStr('[$#]\\{','\\}', data)
        const a = StringUtils.regexExec(/[$#]\{.*?\}/g, data);
        console.log(a)
        expect(200).toBe(200)
        done()
    })

})
