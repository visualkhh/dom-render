import { JSDOM } from 'jsdom';
import {DomRender} from 'dom-render';
// const dom = new JSDOM(`<body>
// <div id="one">asd</div>
// <div id="two"/>
// <h1>
//   \${this.name}$
// </h1>
// <ul>
//     <li dr-for-of="this.friends">
//     </li>
// </ul>
// p
// <div dr-pre>
// </div>
// </body>`, { runScripts: "dangerously" });
// eslint-disable-next-line no-template-curly-in-string
const jsdom = new JSDOM('<body><div id="app"><h1> ${this.name}$ </h1><div><profile/></div></div>');

// const one = dom.window.document.querySelector('#one');
// const two = dom.window.document.querySelector('#two');
// if (one && two) {
//   // one.innerHTML = '12'
//   // two.innerHTML = '123'
//   console.log(one.innerHTML)
//   console.log(two.innerHTML)
//   console.log(dom.window.document.body.innerHTML)
// }
// console.log('-------------')

// global setting
global.document = jsdom.window.document;
global.window = jsdom.window as unknown as Window & typeof globalThis;
const dummyResponse = {ok: false, json: () => Promise.resolve({})}; // as Response;
global.fetch = (...data: any): Promise<any> => Promise.resolve(dummyResponse);
global.history = jsdom.window.history;
global.Event = jsdom.window.Event;
global.IntersectionObserver = jsdom.window.IntersectionObserver;
// @ts-ignore
// global.Error = ErrorBase;
global.navigator = jsdom.window.navigator;
global.NodeFilter = jsdom.window.NodeFilter;
global.Node = jsdom.window.Node;
global.HTMLElement = jsdom.window.HTMLElement;
global.Element = jsdom.window.Element;


class Data {
  name = 'my name is dom-render';
  friends = [{name: 'a'}, {name: 'b'}, {name: 'c'}];
}
class Profile {
  name = 'my name is dom-render';
  friends = [{name: 'a'}, {name: 'b'}, {name: 'c'}];
}

const data = DomRender.run(new Data(), jsdom.window.document.querySelector('#app')!,
  {
    window: jsdom.window,
    targetElements: [
      DomRender.createComponent({
        type: Profile,
        template: '<div>profile #innerHTML#</div>'
      }),
    ],
  });
setTimeout(() => {
  data.friends[1].name = Date.now().toString()
}, 1000);


setTimeout(() => {
  console.log(jsdom.window.document.body.innerHTML)
}, 2000);
