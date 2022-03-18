import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet, Render} from '../RawSet';

export class Dr extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.dr !== null && this.elementSource.attrs.dr.length >= 0) {
            const itRandom = RawSet.drItOtherEncoding(this.elementSource.element);
            const vars = RawSet.drVarEncoding(this.elementSource.element, this.elementSource.attrs.drVarOption ?? '');
            const newTemp = this.source.config.window.document.createElement('temp');
            ScriptUtils.eval(`
                        ${this.render.bindScript}
                        const n = $element.cloneNode(true);
                        var destIt = ${this.elementSource.attrs.drItOption};
                        if (destIt !== undefined) {
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))
                            // console.log('----', n.innerHTML);
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                            // console.log('----', n.innerHTML);
                        }
                        if (this.__render.drStripOption === 'true') {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }`, Object.assign(this.source.obj, {
                __render: Object.freeze({
                    fag: newTemp,
                    drStripOption: this.elementSource.attrs.drStripOption,
                    ...this.render
                } as Render)
            }));
            RawSet.drVarDecoding(newTemp, vars);
            RawSet.drItOtherDecoding(newTemp, itRandom);
            const tempalte = this.source.config.window.document.createElement('template');
            tempalte.innerHTML = newTemp.innerHTML;
            this.returnContainer.fag.append(tempalte.content)
            const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.config)
            this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
            this.returnContainer.raws.push(...rr);
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}