// import {DomRenderCompiler} from 'dom-render/DomRenderCompiler';
// import {ScopeRawSet} from 'dom-render/ScopeRawSet';
//
// export class MyUser {
//     name: 'aaa'
//     age: 55
// }
// const raw = new ScopeRawSet(`
// <html>
// <body>
// <body>
// <div><!--% write(this.name); %--></div>
// </body>
// </body>
// </html>
// `);
//
// const compiler = new DomRenderCompiler(raw, new MyUser());
// compiler.run();
// let documentFragment = compiler.root.executeFragment();
//
// console.log('-------->', documentFragment)
