import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../rawsets/RawSet';
import {ComponentSet} from '../components/ComponentSet';

export class DrThis extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drThis) {
            const r = ScriptUtils.evalReturn(this.elementSource.attrs.drThis, this.source.obj);
            // const isStrip = ScriptUtils.eval(`if (${this.elementSource.attrs.drStripOption ?? 'false'}) { return true; } else { return false; }`, this.source.obj);
            // console.log('isStrip', isStrip)
            if (r) {
                if (r instanceof ComponentSet) {
                    if (this.rawSet.data) {
                        const destroyOptions = this.elementSource.attrs.drDestroyOption?.split(',') ?? [];
                        RawSet.destroy((this.rawSet.data as ComponentSet).obj, [], this.source.config, destroyOptions);
                    }
                    this.rawSet.data = r;
                    const componentBody = RawSet.drThisCreate(this.rawSet, this.elementSource.element, `${this.elementSource.attrs.drThis}.obj`, this.elementSource.attrs.drVarOption ?? '', this.elementSource.attrs.drStripOption, this.source.obj, this.source.config, r);
                    this.returnContainer.fag.append(componentBody)
                    this.afterCallBack.onThisComponentSetCallBacks.push(r);
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
        return ExecuteState.NO_EXECUTE;
    }
}
