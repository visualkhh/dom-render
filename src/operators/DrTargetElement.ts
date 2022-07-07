import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {CreatorMetaData, RawSet} from '../RawSet';

export class DrTargetElement extends OperatorRender {
    execRender(): ExecuteState {
        const targetElement = this.source.config?.targetElements?.find(it => it.name.toLowerCase() === this.elementSource.element.tagName.toLowerCase());
        if (targetElement) {
            const documentFragment = targetElement.callBack(this.elementSource.element, this.source.obj, this.rawSet, this.elementSource.attrs, this.source.config);
            if (documentFragment) {
                // const targetAttrMap = this.elementSource.element.getAttribute(EventManager.normalAttrMapAttrName);
                const detectAction = this.elementSource.element.getAttribute(RawSet.DR_DETECT_NAME);
                const render = (documentFragment as any).render;
                // console.log('-------drTargetElement->', render, targetAttrMap);
                this.rawSet.fragment = documentFragment;
                this.rawSet.data = render.component;
                // const targetAttrs = this.elementSource.element.getAttributeNames()
                //     .filter(it => RawSet.isExporesion(this.elementSource.element.getAttribute(it)))
                //     .map(it => ({name: it, expresion: RawSet.exporesionGrouops(this.elementSource.element.getAttribute(it))[0][1]}))
                //     .filter(it => it.name.length > 0 && it.expresion.length > 0)
                //     .map(it => {
                //         return `n.setAttribute('${it.name}', ${it.expresion})`;
                //     });
                // if (targetAttrMap) {
                //     ScriptUtils.eval(`
                //                 ${this.render.bindScript}
                //                 //const n = $element.cloneNode(true);
                //                 const n = $element;
                //                 ${targetAttrMap.join(';')};
                //                 // this.__render.fag.append(n);
                //             `, Object.assign(this.source.obj, {
                //         __render: Object.freeze({
                //             fag: newTemp,
                //             targetAttrs: targetAttrMap,
                //             ...this.render
                //         } as Render)
                //     }));
                // }

                if (detectAction && render) {
                    this.rawSet.detect = {
                        action: () => {
                            const script = `var $component = this.__render.component; var $element = this.__render.element; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute;  ${detectAction} `;
                            ScriptUtils.eval(script, Object.assign(this.source.obj, {
                                __render: render
                            }))
                        }
                    };
                }
                // fag.append(documentFragment)
                const rr = RawSet.checkPointCreates(documentFragment, this.source.obj, this.source.config)
                this.elementSource.element.parentNode?.replaceChild(documentFragment, this.elementSource.element);
                this.returnContainer.raws.push(...rr);
                this.afterCallBack.onElementInitCallBacks.push({
                    name: targetElement.name.toLowerCase(),
                    obj: this.source.obj,
                    targetElement,
                    creatorMetaData: targetElement.__creatorMetaData as CreatorMetaData
                });
                // console.log(document.body.innerHTML);
                targetElement?.complete?.(this.elementSource.element, this.source.obj, this.rawSet);
            }
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}
