// import {ExecuteState, OperatorRender} from './OperatorRender';
// import {ScriptUtils} from '../utils/script/ScriptUtils';
// import {RawSet, Render} from '../RawSet';
//
// export class AttrExpresion extends OperatorRender {
//     execRender(): ExecuteState {
//         const targetAttrs = this.elementSource.element.getAttributeNames()
//             .filter(it => RawSet.isExporesion(this.elementSource.element.getAttribute(it)))
//             .map(it => ({name: it, expresion: RawSet.exporesionGrouops(this.elementSource.element.getAttribute(it))[0][1]}))
//             .filter(it => it.name.length > 0 && it.expresion.length > 0)
//             .map(it => {
//                 return `n.setAttribute('${it.name}', ${it.expresion})`;
//             });
//         // console.log('--!!!!!!!!!---', targetAttrs)
//         if (targetAttrs?.length > 0) {
//             const newTemp = this.source.config.window.document.createElement('temp');
//             // console.log('------>', targetAttrs, targetAttrs.join(';'))
//             ScriptUtils.eval(`
//                         ${this.render.bindScript}
//                         //const n = $element.cloneNode(true);
//                         const n = $element;
//                         ${targetAttrs.join(';')};
//                         // this.__render.fag.append(n);
//                     `, Object.assign(this.source.obj, {
//                 __render: Object.freeze({
//                     fag: newTemp,
//                     targetAttrs,
//                     ...this.render
//                 } as Render)
//             }));
//             // const tempalte = this.source.config.window.document.createElement('template');
//             // tempalte.innerHTML = newTemp.innerHTML;
//             // this.returnContainer.fag.append(tempalte.content);
//             const rr = RawSet.checkPointCreates(this.render.element, this.source.config);
//             // const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.config);
//             // this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
//             this.returnContainer.raws.push(...rr);
//             // return ExecuteState.EXECUTE;
//             return ExecuteState.NO_EXECUTE;
//         }
//         return ExecuteState.NO_EXECUTE;
//     }
// }