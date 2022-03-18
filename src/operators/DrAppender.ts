import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet, Render} from '../RawSet';

export class DrAppender extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drAppender) {
            const itRandom = RawSet.drItOtherEncoding(this.elementSource.element);
            const vars = RawSet.drVarEncoding(this.elementSource.element, this.elementSource.attrs.drVarOption ?? '');
            const newTemp = this.source.config.window.document.createElement('temp');
            ScriptUtils.eval(`
                    try{
                    ${this.render.bindScript}
                    ${this.elementSource.attrs.drBeforeOption ?? ''}
                        const ifWrap = document.createElement('div');
                        ifWrap.setAttribute('dr-strip', 'true');
                        ifWrap.setAttribute('dr-if', '${this.elementSource.attrs.drAppender} && ${this.elementSource.attrs.drAppender}.length > 0');
                        
                        // console.log('----', ${this.elementSource.attrs.drAppender}.length);
                        
                        const n = this.__render.element.cloneNode(true);
                        Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drAppender' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));
                        n.setAttribute('dr-for-of', '${this.elementSource.attrs.drAppender}[' + (${this.elementSource.attrs.drAppender}.length-1) + ']');
                        n.setAttribute('dr-next', '${this.elementSource.attrs.drAppender},' + ${this.elementSource.attrs.drAppender}.length);
                        ifWrap.append(n);
                        
                        // n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIt\\#/g, destIt).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIndex\\#/g, i)))
                        // n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, i);
                        // if (this.__render.drStripOption === 'true') {
                        // Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        // } else {
                        // this.__render.fag.append(n);
                        // }
                        this.__render.fag.append(ifWrap);
                    ${this.elementSource.attrs.drAfterOption ?? ''}
                    }catch(e){}
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