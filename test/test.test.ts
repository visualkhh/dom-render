import {Config} from '../src/Config';
import {ScopeObject} from '../src/ScopeObject';
describe('Test', () => {
    test('test', async (done) => {
        // console.log('-->', 'good')
        const config = new Config((it) => new ScopeObject())
        console.log('-->', config)
        expect(200).toBe(200)
        done()
    })
})
