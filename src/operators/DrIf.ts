import {OperatorExecuterAttrRequire} from './OperatorExecuterAttrRequire';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../rawsets/RawSet';
import {Render} from '../rawsets/Render';
import {AfterCallBack, ElementSource, ExecuteState, ReturnContainer, Source} from './OperatorExecuter';

export class DrIf extends OperatorExecuterAttrRequire<string> {
    constructor(rawSet: RawSet, render: Render, returnContainer: ReturnContainer, elementSource: ElementSource, source: Source, afterCallBack: AfterCallBack) {
        source.operatorAround = undefined;
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack, false);
    }

    async executeAttrRequire(attr: string): Promise<ExecuteState> {
        const itRandom = RawSet.drItOtherEncoding(this.elementSource.element);
        const vars = RawSet.drVarEncoding(this.elementSource.element, this.elementSource.attrs.drVarOption ?? '');
        const newTemp = this.source.config.window.document.createElement('temp');
        // Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v)); <-- 이부분은 다른 attr에도 적용을 할지말지 생각해야됨  엘리먼트 존재유무에 따라서 적용을 할지말지 결정해야됨
        const keepgoing = ScriptUtils.eval(`
                ${this.render.bindScript}
                ${this.elementSource.attrs.drBeforeOption ?? ''}
                if ($rawset.data === (${attr})) {
                    return false;
                }
                $rawset.data = ${attr};
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
        // TODO: 뭐지?? 지워야되는거 아닌가?
        if (keepgoing === false) {
            return ExecuteState.STOP;
        }
        RawSet.drVarDecoding(newTemp, vars);
        RawSet.drItOtherDecoding(newTemp, itRandom);
        // const bypass = (newTemp.innerHTML ?? '').trim().length <= 0;
        const tempalte = this.source.config.window.document.createElement('template');
        tempalte.innerHTML = newTemp.innerHTML;
        this.returnContainer.fag.append(tempalte.content)
        const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.obj, this.source.config)
        this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
        this.returnContainer.raws.push(...rr);
        return ExecuteState.EXECUTE;
    }
}
