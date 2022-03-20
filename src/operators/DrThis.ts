import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../RawSet';
import {ComponentSet} from '../components/ComponentSet';

export class DrThis extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drThis) {
            const r = ScriptUtils.evalReturn(this.elementSource.attrs.drThis, this.source.obj);
            if (r) {
                if (r instanceof ComponentSet) {
                    if (this.rawSet.data) {
                        RawSet.destroy((this.rawSet.data as ComponentSet).obj, [], this.source.config);
                    }
                    // console.log('dr-this ->  component', this.data);
                    this.rawSet.data = r;
                    this.returnContainer.fag.append(RawSet.drThisCreate(this.elementSource.element, `${this.elementSource.attrs.drThis}.obj`, this.elementSource.attrs.drVarOption ?? '', this.elementSource.attrs.drStripOption, this.source.obj, this.source.config, r))
                    this.afterCallBack.onThisComponentSetCallBacks.push(r);
                } else {
                    this.returnContainer.fag.append(RawSet.drThisCreate(this.elementSource.element, this.elementSource.attrs.drThis, this.elementSource.attrs.drVarOption ?? '', this.elementSource.attrs.drStripOption, this.source.obj, this.source.config))
                }
                const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.config)
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