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

    test('regexpstyle', async (done) => {
        let id ='zz';
        let message = `
#first ~ *:not(#first ~ style[domstyle] ~ *) {
font-size: 30px;
color: blue;
}
div {
    color: rebeccapurple;
}element{color:red} asdas{collapse: collapse;
    color: rebeccapurple;}
`
        // let message = '/asdasd/{path:second\\/?[0-9]?}/go/{a/sd}ood';
        const data = StringUtils.regexExec(/(\{(?:\{??[^\{]*?\}))/g, message);
        data.forEach((item, idx) => {
            message = message.replace(item[0], `{${idx}}\r\n`)
        })
        console.log('1-->', message)

        message = message.replace(/^(.)/gm, id + ' $1');
        console.log('2-->', message)

        data.forEach((item, idx) => {
            message = message.replace(`{${idx}}`, item[0])
        })
        console.log('-->', message)

        expect(200).toBe(200)
        done()
    })

    test('regexpstyle2', async (done) => {
        let id = 'zz'
        let message = `
#first ~ *:not(#first ~ style[domstyle] ~ *) {0}

div {1}
element{2}
 asdas{3}
`;
        // message = message.replace(/(\r\n|\n|\r)/gm, '');
        // console.log(message)
        // message = message.replace(/^(.)/gm, id + ' $1');
        message = message.replace(/^(.)+\{/gm, id + ' $1');
        console.log(message)
        expect(200).toBe(200)
        done()
    })


    test('regexpstyle3', async (done) => {
        let id ='zz';
        // let message = `.gold {color: gold}
        // .aqua { color: aqua}`;
        let message = `div {
    color: rebeccapurple;
}element{color:red} asdas{collapse: collapse;
    color: rebeccapurple;}
.gold {color: gold}.aqua { color: aqua}
`
        // message = message.replace(/([^}]+){/gm, ` #${id} ~ $1:not(#${id} ~ style[domstyle] ~ *) {`);
        // message = message.replace(/([^}].+){/gm, `#${id} ~ $1:not(#${id} ~ style[domstyle] ~ *) {`);
        message = message.replace(/([^}]+){/gm, function(a, b) {
            console.log(a, '--', b);
            if (typeof b === 'string') {
                b = b.trim();
            }
            return `#${id} ~ ${b}:not(#${id} ~ style[domstyle] ~ *) {`;
        });
        console.log(message)
        expect(200).toBe(200)
        done()
    })

})
