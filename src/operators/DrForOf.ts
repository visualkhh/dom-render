import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet, Render} from '../RawSet';

export class DrForOf extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drForOf) {
            const itRandom = RawSet.drItOtherEncoding(this.elementSource.element);
            const vars = RawSet.drVarEncoding(this.elementSource.element, this.elementSource.attrs.drVarOption ?? '');
            const newTemp = this.source.config.window.document.createElement('temp');
            ScriptUtils.eval(`
                    ${this.render.bindScript}
                    ${this.elementSource.attrs.drBeforeOption ?? ''}
                    var i = 0; 
                    const forOf = ${this.elementSource.attrs.drForOf};
                    const forOfStr = \`${this.elementSource.attrs.drForOf}\`.trim();
                    if (forOf) {
                        for(const it of forOf) {
                            var destIt = it;
                            if (/\\[(.*,?)\\],/g.test(forOfStr)) {
                                if (typeof it === 'string') {
                                    destIt = it;
                                } else {
                                    destIt = forOfStr.substring(1, forOfStr.length-1).split(',')[i];
                                }
                            } else if (forOf.isRange) {
                                    destIt = it;
                            }  else {
                                destIt = forOfStr + '[' + i +']'
                            }
                            const n = this.__render.element.cloneNode(true);
                            Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drForOf' && k !== 'drNextOption' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIt\\#/g, destIt).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIndex\\#/g, i)))
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, i);
                            if (this.__render.drStripOption === 'true') {
                                Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                            } else {
                                this.__render.fag.append(n);
                            }
                            i++;
                        }
                        
                        if('${this.elementSource.attrs.drNextOption}' !== 'null') {
                            const n = this.__render.element.cloneNode(true);
                            Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drForOf' && k !== 'drNextOption' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));
                            const [name, idx] = '${this.elementSource.attrs.drNextOption}'.split(',');
                            n.setAttribute('dr-for-of', name + '[' + idx + ']');
                            n.setAttribute('dr-next', name + ',' +  (Number(idx) + 1));
                            this.__render.fag.append(n);
                        }
                    }
                    ${this.elementSource.attrs.drAfterOption ?? ''}
                    `, Object.assign(this.source.obj, {
                __render: Object.freeze({
                    drStripOption: this.elementSource.attrs.drStripOption,
                    drAttr: this.elementSource.attrs,
                    drAttrsOriginName: RawSet.drAttrsOriginName,
                    fag: newTemp,
                    ...this.render
                    // eslint-disable-next-line no-use-before-define
                } as Render)
            }));
            RawSet.drVarDecoding(newTemp, vars);
            RawSet.drItOtherDecoding(newTemp, itRandom);
            const tempalte = this.source.config.window.document.createElement('template');
            tempalte.innerHTML = newTemp.innerHTML;
            this.returnContainer.fag.append(tempalte.content)
            const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.config);
            this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
            // const rrr = rr.flatMap(it => it.render(obj, config));// .flat();
            this.returnContainer.raws.push(...rr)
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}