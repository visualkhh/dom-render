// import {ScopeResultSet} from './ScopeResultSet';
// import {RandomUtils} from './utils/random/RandomUtils';
// import {TargetNode, TargetNodeMode} from './RootScope';
// import {DomRenderProxy} from './DomRenderProxy';
// import {Scope} from './Scope';
// import {ScopeObjectCall} from './ScopeObjectCall';
// import {ScopeRawSet} from './ScopeRawSet';
//
// export class ScopeObject {
//     public _originObj: any;
//     public _calls: ScopeObjectCall[] = [];
//     [name: string]: any;
//     public _writes = [];
//
//     constructor(public _scope: Scope, public _uuid = RandomUtils.uuid()) {
//     }
//
//     public executeResultSet(script: string): ScopeResultSet {
//         this.eval(script);
//         const startComment = this._scope.raws.window.document.createComment('scope start ' + this._uuid)
//         const endComment = this._scope.raws.window.document.createComment('scope end ' + this._uuid)
//         const templateElement = this._scope.raws.window.document.createElement('template');
//         if (this._writes.length) {
//             templateElement.innerHTML = this._writes.join('');
//             templateElement.content.childNodes.forEach(it => {
//                 // Node.ELEMENT_NODE = 1
//                 if (it.nodeType === 1) {
//                     (it as Element).setAttribute('scope-uuid', this._uuid);
//                 }
//             })
//         }
//         return new ScopeResultSet(this._uuid, this, templateElement.content, startComment, endComment, this._calls)
//     }
//
//     private eval(str: string): any {
//         return this.scopeEval(this, str);
//     }
//
//     private scopeEval(scope: any, script: string) {
//         // console.log('eval--itPath-->', this._scope.config.itPath)
//         // eslint-disable-next-line no-new-func
//         const f = Function(`"use strict";
//         const element = (tag, attrOrContent, content) => {
//             let attrs = '';
//             if (typeof attrOrContent === 'object') {
//                 Object.keys(attrOrContent).forEach(it => {
//                     attrs += (it + "='" + attrOrContent[it] + "' ");
//                 });
//
//             } else if (typeof attrOrContent === 'string') {
//                 content = attrOrContent;
//             }
//             this._writes.push('<'+tag+' '+attrs+'>' + content + '</'+tag+'>');
//         };
//
//         const write = (str) => {
//             this._writes.push(str);
//         };
//
//         const writeIf = (sw, str) => {
//             if(sw) {
//                 this._writes.push(str);
//             }
//         };
//
//         const forWrite = (cnt, str) => {
//             for(var i = 0 ; i < cnt ; i ++) {
//                 this._writes.push(str);
//             }
//         };
//
//         const include = (target, rawSet, itPath, superPath) => {
//             if(target) {
//                 const uuid = this._makeUUID();
//                 const targetNode = this.getTargetNode(uuid);
//                 const rootScope = this._compileRootScope(target, targetNode, uuid, rawSet, itPath, superPath);
//                 this._calls.push({name: 'include', parameter: [target], result: rootScope})
//                 if (rootScope) {
//                     this._writes.push("<template include-scope-uuid='" + uuid + "'></template>");
//                 }
//             }
//         }
//         const includeDhis = (target, rawSet, itPath, superPath) => {
//             include(target, this._replaceDhisToThis(rawSet), itPath, superPath);
//         }
//         ${this.customScript()}
//
//         ${script}
//         `);
//         return f.bind(scope)() ?? {};
//     }
//
//     private _makeUUID() {
//         return RandomUtils.uuid();
//     }
//
//     private _replaceDhisToThis(raws: RawSet) {
//         return {
//             template: ScopeRawSet.replaceDhisToThis(raws.template),
//             styles: raws.styles?.map(it => ScopeRawSet.replaceDhisToThis(it))
//         }
//     }
//     // private _decoding(raws: RawSet) {
//     //     return {
//     //         template: decodeURIComponent(this._scope.raws.window.atob(raws.template)),
//     //         styles: raws.styles?.map(it => decodeURIComponent(this._scope.raws.window.atob(it)))
//     //     }
//     // }
//
//     private _compileRootScope(target: any, targetNode: TargetNode, uuid: string, raws?: RawSet, itPath?: string, superPath?: string) {
//         if (!raws && !('_ScopeObjectProxyHandler_isProxy' in (target === this ? this._originObj : target))) {
//             console.error('no Domrander Proxy Object -> var proxy = Domrender.proxy(target, ScopeRawSet)', target)
//             throw new Error('no Domrander compile Object');
//         }
//         const rawSet = raws ?? target._ScopeObjectProxyHandler_rawSet! as RawSet;
//         const destTarget = (target._ScopeOpjectProxy_targetOrigin ?? target);
//         const varRegex = /<!--%write\((.*?)\)%-->/gm;
//         let varExec = varRegex.exec(rawSet.template)
//         console.log('--2222--->', itPath, superPath)
//         while (varExec) {
//             if (itPath) {
//                 varExec[1] = varExec[1].replace(/it/g, itPath)
//             }
//             console.log('super------->', superPath)
//             if (superPath) {
//                 varExec[1] = varExec[1].replace(/super/g, superPath)
//             }
//             rawSet.template = rawSet.template.replace(varExec[0], '<!--%write(' + varExec[1] + ')%-->')
//             console.log('--333333--->', rawSet.template)
//             varExec = varRegex.exec(varExec.input)
//         }
//
//         console.log('--*********--->', rawSet.template)
//         if (itPath) {
//             rawSet.itPath = itPath;
//         }
//         if (superPath) {
//             rawSet.superPath = superPath;
//         }
//         // if (itPath) {
//         //     // rawSet.template = rawSet.template.replace(/it/g, itPath);
//         //     // rawSet.template = rawSet.template.replace(/it/g, itPath);
//         //     rawSet.template = rawSet.template.replace(/\(it/g, '(' + itPath);
//         //     rawSet.itPath = itPath;
//         // }
//         // if (superPath) {
//         //     // rawSet.template = rawSet.template.replace(/super/g, superPath);
//         //     // rawSet.template = rawSet.template.replace(/super/g, superPath);
//         //     rawSet.template = rawSet.template.replace(/\(super/g, '(' + superPath);
//         //     rawSet.superPath = superPath;
//         // }
//         // if (pipe) {
//         //     pipe?.forEach(it => {
//         //         const key = it.split('|')[0];
//         //         let value = it.split('|')[1];
//         //         if (key || value) {
//         //             value = value.replace(/\(it/g, '(' + itPath);
//         //             rawSet.template = rawSet.template.replace(RegExp('\\(' + key, 'gm'), '(' + value);
//         //         }
//         //     })
//         //     rawSet.pipe = pipe;
//         // }
//
//         // if (!destTarget) {
//         //     destTarget = (target._ScopeOpjectProxy_targetOrigin ?? target)
//         // } else {
//         //     destTarget.super = {name: 444};
//         //     destTarget = (destTarget._ScopeOpjectProxy_targetOrigin ?? destTarget)
//         // }
//         // const config = Object.assign(new Config(), this._scope.config);
//         // config.itPath = itPath ?? config.itPath;
//         // console.log('-->', config.itPath)
//         return DomRenderProxy.compileRootScope(this._scope.raws.window, destTarget, rawSet, this._scope.config, targetNode, uuid);
//     }
//
//     private getTargetNode(uuid: string) {
//         return new TargetNode(`[include-scope-uuid='${uuid}']`, TargetNodeMode.replace, this._scope.raws.window.document);
//     }
//
//     protected customScript() {
//         return '';
//     }
// }
