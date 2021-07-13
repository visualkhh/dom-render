import {Config} from '../src/Config';
import {ScopeObject} from '../src/ScopeObject';
import {DomRender} from '../src/DomRender';
import {ScopeRawSet} from '../src/ScopeRawSet';
describe('Test', () => {
    test('test', async (done) => {
        // console.log('-->', 'good')
        const config = new Config((it) => new ScopeObject())
        console.log('-->', config)
        expect(200).toBe(200)
        done()
    })

    test('test55', async (done) => {
        // console.log('-->', 'good')
        const config = new Config();
        const raw = new ScopeRawSet('');
        const domRender = new DomRender(raw, config, 'zzzzzz')
        console.log('-->', domRender)
        expect(200).toBe(200)
        done()
    })
})
