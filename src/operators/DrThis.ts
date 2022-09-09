import {OperatorExecuterAttrRequire} from './OperatorExecuterAttrRequire';
import {RawSet} from '../rawsets/RawSet';
import {ComponentSet} from '../components/ComponentSet';
import {ExecuteState} from './OperatorExecuter';

export class DrThis extends OperatorExecuterAttrRequire<string> {
    executeAttrRequire(attr: any): ExecuteState {
        if (attr && this.elementSource.attrs.drThis) {
            if (attr instanceof ComponentSet) {
                if (this.rawSet.data) {
                    const destroyOptions = this.elementSource.attrs.drDestroyOption?.split(',') ?? [];
                    RawSet.destroy((this.rawSet.data as ComponentSet).obj, [], this.source.config, destroyOptions);
                }
                this.rawSet.data = attr;
                const componentBody = RawSet.drThisCreate(this.rawSet, this.elementSource.element, `${this.elementSource.attrs.drThis}.obj`, this.elementSource.attrs.drVarOption ?? '', this.elementSource.attrs.drStripOption, this.source.obj, this.source.config, attr);
                this.returnContainer.fag.append(componentBody)
                this.afterCallBack.onThisComponentSetCallBacks.push(attr);
            } else {
                this.returnContainer.fag.append(RawSet.drThisCreate(this.rawSet, this.elementSource.element, this.elementSource.attrs.drThis, this.elementSource.attrs.drVarOption ?? '', this.elementSource.attrs.drStripOption, this.source.obj, this.source.config))
            }
            const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.obj, this.source.config)
            this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
            this.returnContainer.raws.push(...rr);
        } else {
            this.elementSource.element.remove();
        }
        return ExecuteState.EXECUTE;
    }
}
