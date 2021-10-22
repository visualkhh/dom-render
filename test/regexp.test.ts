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
})
