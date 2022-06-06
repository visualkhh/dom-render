import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet, Render} from '../RawSet';

export class DrInnerText extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drInnerText) {
            const newTemp = this.source.config.window.document.createElement('temp');
            ScriptUtils.eval(` 
                        ${this.render.bindScript}
                        const n = $element.cloneNode(true);  
                        ${this.elementSource.attrs.drBeforeOption ?? ''}
                        n.innerText = ${this.elementSource.attrs.drInnerText};
                        if (this.__render.drStripOption === 'true') {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                        ${this.elementSource.attrs.drAfterOption ?? ''}
                    `, Object.assign(this.source.obj, {
                __render: Object.freeze({
                    drStripOption: this.elementSource.attrs.drStripOption,
                    fag: newTemp,
                    ...this.render
                } as Render)
            }));
            const tempalte = this.source.config.window.document.createElement('template');
            tempalte.innerHTML = newTemp.innerHTML;
            this.returnContainer.fag.append(tempalte.content);
            const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.obj, this.source.config);
            this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
            this.returnContainer.raws.push(...rr);
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}