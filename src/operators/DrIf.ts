import {ExecuteState, OperatorRender} from './OperatorRender';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet, Render} from '../RawSet';

export class DrIf extends OperatorRender {
    execRender(): ExecuteState {
        if (this.elementSource.attrs.drIf) {
            const itRandom = RawSet.drItOtherEncoding(this.elementSource.element);
            const vars = RawSet.drVarEncoding(this.elementSource.element, this.elementSource.attrs.drVarOption ?? '');
            const newTemp = this.source.config.window.document.createElement('temp');
            // Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v)); <-- 이부분은 다른 attr에도 적용을 할지말지 생각해야됨  엘리먼트 존재유무에 따라서 적용을 할지말지 결정해야됨
            const keepgoing = ScriptUtils.eval(`
                    ${this.render.bindScript}
                    ${this.elementSource.attrs.drBeforeOption ?? ''}
                    if ($rawset.data === (${this.elementSource.attrs.drIf})) {
                        return false;
                    }
                    $rawset.data = ${this.elementSource.attrs.drIf}
                    if($rawset.data) {
                        const n = $element.cloneNode(true);
                        Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));
                        var destIt = ${this.elementSource.attrs.drItOption};
                        if (destIt !== undefined) {
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__render.drStripOption === 'true') {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                    }
                    ${this.elementSource.attrs.drAfterOption ?? ''};
                    return true;
                    `, Object.assign(this.source.obj,
                {
                    __render: Object.freeze({
                        fag: newTemp,
                        drAttr: this.elementSource.attrs,
                        drAttrsOriginName: RawSet.drAttrsOriginName,
                        drStripOption: this.elementSource.attrs.drStripOption,
                        ...this.render
                    } as Render)
                }
            ));
            // console.log('keepgoing', keepgoing);
            if (keepgoing === false) {
                return ExecuteState.STOP;
            }
            RawSet.drVarDecoding(newTemp, vars);
            RawSet.drItOtherDecoding(newTemp, itRandom);
            // const bypass = (newTemp.innerHTML ?? '').trim().length <= 0;
            const tempalte = this.source.config.window.document.createElement('template');
            tempalte.innerHTML = newTemp.innerHTML;
            // console.log(tempalte.innerHTML)
            this.returnContainer.fag.append(tempalte.content)
            const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.config)
            this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
            this.returnContainer.raws.push(...rr);
            // if (bypass) {
            //     continue;
            // }
            return ExecuteState.EXECUTE;
        }
        return ExecuteState.NO_EXECUTE;
    }
}