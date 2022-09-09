import {OperatorExecuterAttrRequire} from './OperatorExecuterAttrRequire';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../rawsets/RawSet';
import {Render} from '../rawsets/Render';
import {AfterCallBack, ElementSource, ExecuteState, ReturnContainer, Source} from './OperatorExecuter';

export class DrInnerHTML extends OperatorExecuterAttrRequire<string> {
    constructor(rawSet: RawSet, render: Render, returnContainer: ReturnContainer, elementSource: ElementSource, source: Source, afterCallBack: AfterCallBack) {
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack, false);
    }

    executeAttrRequire(attr: string): ExecuteState {
        const newTemp = this.source.config.window.document.createElement('temp');
        ScriptUtils.eval(`
                        ${this.render.bindScript}
                        const n = $element.cloneNode(true);
                        ${this.elementSource.attrs.drBeforeOption ?? ''}
                        n.innerHTML = ${attr};
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
                // eslint-disable-next-line no-use-before-define
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
}
