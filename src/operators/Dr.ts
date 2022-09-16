import {OperatorExecuterAttrRequire} from './OperatorExecuterAttrRequire';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../rawsets/RawSet';
import {Render} from '../rawsets/Render';
import {AfterCallBack, ElementSource, ExecuteState, ReturnContainer, Source} from './OperatorExecuter';

export class Dr extends OperatorExecuterAttrRequire<null> {
    constructor(rawSet: RawSet, render: Render, returnContainer: ReturnContainer, elementSource: ElementSource, source: Source, afterCallBack: AfterCallBack) {
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack);
    }

    async executeAttrRequire(data: null): Promise<ExecuteState> {
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
        const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.obj, this.source.config)
        this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
        this.returnContainer.raws.push(...rr);
        return ExecuteState.EXECUTE;
    }
}
