import {ExecuteState, OperatorRender} from './OperatorRender';
import {RawSet} from '../rawsets/RawSet';
import {TargetAttr} from '../configs/TargetAttr';

export class DrTargetAttr extends OperatorRender {
    execRender(): ExecuteState {
        const attributeNames = this.elementSource.element.getAttributeNames();
        // const targetAttr = config?.targetAttrs?.find(it => (!drAttr.drForOf && !drAttr.drFor && !drAttr.drRepeat) && attributeNames.includes(it.name));
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