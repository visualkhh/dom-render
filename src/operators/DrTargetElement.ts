import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../rawsets/RawSet';
import {CreatorMetaData} from '../rawsets/CreatorMetaData';
import {AfterCallBack, ElementSource, ExecuteState, OperatorExecuter, ReturnContainer, Source} from './OperatorExecuter';
import {Render} from '../rawsets/Render';

export class DrTargetElement extends OperatorExecuter<void> {
    constructor(rawSet: RawSet, render: Render, returnContainer: ReturnContainer, elementSource: ElementSource, source: Source, afterCallBack: AfterCallBack) {
        source.operatorAround = undefined;
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack, false);
    }

    async execute(): Promise<ExecuteState> {
        const targetElement = this.source.config?.targetElements?.find(it => it.name.toLowerCase() === this.elementSource.element.tagName.toLowerCase());
        if (targetElement) {
            // const data = await new Promise((resolve, reject) => {
            //     setTimeout(() => resolve(0), 5000);
            // })
            const documentFragment = await targetElement.callBack(this.elementSource.element, this.source.obj, this.rawSet, this.elementSource.attrs, this.source.config);
            if (documentFragment) {
                const detectAction = this.elementSource.element.getAttribute(RawSet.DR_DETECT_NAME);
                const render = (documentFragment as any).render;
                this.rawSet.fragment = documentFragment;
                this.rawSet.data = render.component;
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
                targetElement?.complete?.(this.elementSource.element, this.source.obj, this.rawSet);
            }
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}
