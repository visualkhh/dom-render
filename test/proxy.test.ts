export class TestProxyHandler<T extends object> implements ProxyHandler<T> {

    set?(target: T, p: string | symbol, value: any, receiver: any): boolean {
        console.log('--', target, p, value)
        return true;
    }

    get?(target: T, p: string | symbol, receiver: any): any {
        return p in target ? (target as any)[p].bind(target) : undefined
    }
}
describe('Test', () => {
    test('proxy', async (done) => {
        expect(200).toBe(200)
        const date1 = new Date(); // {setDate: (n: number) => {}};
        const date = new Proxy(date1, new TestProxyHandler())
        date.setDate(555)
        console.log(date instanceof Date)
        console.log(date instanceof TestProxyHandler)
        // date.toString = () => {
        //     return date1.toString();
        // }
        console.log('------', date.getTime())
        done()
    })
})
