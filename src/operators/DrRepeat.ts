import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../RawSet';
import {EventManager} from '../events/EventManager';

export class DrRepeat extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drRepeat) {
            const itRandom = RawSet.drItOtherEncoding(this.elementSource.element);
            const vars = RawSet.drVarEncoding(this.elementSource.element, this.elementSource.attrs.drVarOption ?? '');
            const newTemp = this.source.config.window.document.createElement('temp');
            ScriptUtils.eval(`
                    ${this.render.bindScript}
                    ${this.elementSource.attrs.drBeforeOption ?? ''}
                    var i = 0; 
                    const repeat = ${this.elementSource.attrs.drRepeat};
                    const repeatStr = \`${this.elementSource.attrs.drRepeat}\`;
                    let range = repeat;
                    if (typeof repeat === 'number') {
                        range = ${EventManager.RANGE_VARNAME}(repeat);
                    } 
                    for(const it of range) {
                        var destIt = it;
                        if (range.isRange) {
                            destIt = it;
                        }  else {
                            destIt = repeatStr + '[' + i +']'
                        }
                        const n = this.__render.element.cloneNode(true);
                        n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearRangeIt\\#/g, destIt).replace(/\\#nearRangeIndex\\#/g, destIt)))
                        n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, destIt);
                        
                        if (this.__render.drStripOption === 'true') {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                        i++;
                    }
                    ${this.elementSource.attrs.drAfterOption ?? ''}
                    `, Object.assign(this.source.obj, {
                __render: Object.freeze({
                    fag: newTemp,
                    drStripOption: this.elementSource.attrs.drStripOption,
                    ...this.render
                })
            }));
            RawSet.drVarDecoding(newTemp, vars);
            RawSet.drItOtherDecoding(newTemp, itRandom);
            const tempalte = this.source.config.window.document.createElement('template');
            tempalte.innerHTML = newTemp.innerHTML;
            this.returnContainer.fag.append(tempalte.content)
            const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.config)
            this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
            this.returnContainer.raws.push(...rr)
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}