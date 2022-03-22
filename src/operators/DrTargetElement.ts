import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {CreatorMetaData, RawSet} from '../RawSet';

export class DrTargetElement extends OperatorRender {
    execRender(): ExecuteState {
        const targetElement = this.source.config?.targetElements?.find(it => it.name.toLowerCase() === this.elementSource.element.tagName.toLowerCase());
        if (targetElement) {
            const documentFragment = targetElement.callBack(this.elementSource.element, this.source.obj, this.rawSet, this.elementSource.attrs);
            if (documentFragment) {
                const detectAction = this.elementSource.element.getAttribute(RawSet.DR_DETECT_NAME);
                const render = (documentFragment as any).render;
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
                const rr = RawSet.checkPointCreates(documentFragment, this.source.config)
                this.elementSource.element.parentNode?.replaceChild(documentFragment, this.elementSource.element);
                this.returnContainer.raws.push(...rr);
                this.afterCallBack.onElementInitCallBacks.push({
                    name: targetElement.name.toLowerCase(),
                    obj: this.source.obj,
                    targetElement,
                    creatorMetaData: targetElement.__creatorMetaData as CreatorMetaData
                });
                targetElement?.complete?.(this.elementSource.element, this.source.obj, this.rawSet);
            }
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}