import { StringUtils } from '../src/utils/string/StringUtils';
import { RawSet } from '../src/RawSet';

describe('Test', () => {
    test('regexp', async (done) => {
        const a = "are su${'aaa'}$pported.ar${aas {} }$e su${'aaa123123'}$pported.  "
        const r = /[$#](\{.*\})[$#]/g
        // const aa = StringUtils.betweenRegexpStrGroup('[$#]\\{','\\}[$#]', a)
        const aa = RawSet.exporesionGrouops(a)
        console.log(aa)
        expect(200).toBe(200)
        done()
    })
    test('regexp2', async (done) => {
        let message = '/asdasd/ood';
        // let message = '/asdasd/{path:second\\/?[0-9]?}/go/{a/sd}ood';
        const data = StringUtils.regexExec(/(\{(?:\{??[^\{]*?\}))/g, message);
        data.forEach((item, idx) => {
            message = message.replace(item[0], `{${idx}}`)
        })
        console.log('-->', message)
        data.forEach((item, idx) => {
            message = message.replace(`{${idx}}`, item[0])
        })
        console.log('-->', message)

        expect(200).toBe(200)
        done()
    })
})
