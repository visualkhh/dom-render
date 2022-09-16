import {RawSet} from '../rawsets/RawSet';
import {TargetAttr} from '../configs/TargetAttr';
import {AfterCallBack, ElementSource, ExecuteState, OperatorExecuter, ReturnContainer, Source} from './OperatorExecuter';
import {Render} from '../rawsets/Render';

export class DrTargetAttr extends OperatorExecuter<void> {
    constructor(rawSet: RawSet, render: Render, returnContainer: ReturnContainer, elementSource: ElementSource, source: Source, afterCallBack: AfterCallBack) {
        source.operatorAround = undefined;
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack, false);
    }

    async execute(): Promise<ExecuteState> {
        const attributeNames = this.elementSource.element.getAttributeNames();
        const targetAttr: TargetAttr | undefined = this.source.config?.targetAttrs?.find(it => attributeNames.includes(it.name));
        if (targetAttr) {
            const attrName = targetAttr.name;
            const attrValue = this.rawSet.getAttributeAndDelete(this.elementSource.element, attrName)
            if (attrValue && attrName && (!this.elementSource.attrs.drForOf && !this.elementSource.attrs.drFor && !this.elementSource.attrs.drRepeat)) {
                const documentFragment = targetAttr.callBack(this.elementSource.element, attrValue, this.source.obj, this.rawSet);
                if (documentFragment) {
                    const rr = RawSet.checkPointCreates(documentFragment, this.source.obj, this.source.config)
                    this.elementSource.element.parentNode?.replaceChild(documentFragment, this.elementSource.element);
                    this.returnContainer.raws.push(...rr);
                    this.afterCallBack.onAttrInitCallBacks.push({
                        attrName,
                        attrValue,
                        obj: this.source.obj
                    });
                    targetAttr?.complete?.(this.elementSource.element, attrValue, this.source.obj, this.rawSet);
                }
            }
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}
