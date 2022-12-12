import {OperatorExecuterAttrRequire} from './OperatorExecuterAttrRequire';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {RawSet} from '../rawsets/RawSet';
import {Render} from '../rawsets/Render';
import {AfterCallBack, ElementSource, ExecuteState, ReturnContainer, Source} from './OperatorExecuter';
import {Config} from '../configs/Config';

export class DrThisProperty extends OperatorExecuterAttrRequire<string> {
    constructor(rawSet: RawSet, render: Render, returnContainer: ReturnContainer, elementSource: ElementSource, source: Source, afterCallBack: AfterCallBack) {
        source.operatorAround = undefined;
        super(rawSet, render, returnContainer, elementSource, source, afterCallBack, false);
    }

    async executeAttrRequire(attr: string): Promise<ExecuteState> {
        const itRandom = RawSet.drItOtherEncoding(this.elementSource.element);
        const vars = RawSet.drVarEncoding(this.elementSource.element, this.elementSource.attrs.drVarOption ?? '');
        const newTemp = this.source.config.window.document.createElement('temp');
        const dictioanry = ScriptUtils.evalReturn(attr, this.source.obj)
        const dictionaryKey = this.elementSource.attrs.drKeyOption ?? '';
        // console.log('--->', attr, dictionaryKey)
        // if (!(dictioanry instanceof Dictionary)) {
        //     return ExecuteState.STOP;
        // }
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // console.log('!!!!!!!!!!!!!!', this.rawSet);
        ScriptUtils.eval(`
                    ${this.render.bindScript}
                    ${this.elementSource.attrs.drBeforeOption ?? ''}
                    var i = 0; 
                    const dictionary = ${attr};
                    const dictionaryKey = '${dictionaryKey}';
                    const dictionaryStr = \`${attr}\`.trim();
                    // console.log('----@#!@#@!#', this.__render.oldChild);
                    if (dictionary) {
                        for(const it in dictionary) {
                            var destIt = dictionaryStr + '["' + it + '"]';
                            const n = this.__render.element.cloneNode(true);
                            n.setAttribute('dr-this', destIt);
                            n.setAttribute('dr-key', it);
                            // n.setAttribute('dr-dictionary-key', it);
                            this.__render.fag.append(n);
                            i++;
                        }
                         this.__render.rawset.point.start.setAttribute('dr-has-keys',Object.keys(dictionary).join(','));
                    }
                    ${this.elementSource.attrs.drAfterOption ?? ''}
                    `, Object.assign(this.source.obj, {
            __render: Object.freeze({
                drStripOption: this.elementSource.attrs.drStripOption,
                drAttr: this.elementSource.attrs,
                drAttrsOriginName: RawSet.drAttrsOriginName,
                fag: newTemp,
                ...this.render
            } as Render)
        }));
        RawSet.drVarDecoding(newTemp, vars);
        RawSet.drItOtherDecoding(newTemp, itRandom);
        const tempalte = this.source.config.window.document.createElement('template');
        tempalte.innerHTML = newTemp.innerHTML;
        this.returnContainer.fag.append(tempalte.content);
        const rr = RawSet.checkPointCreates(this.returnContainer.fag, this.source.obj, this.source.config);
        this.elementSource.element.parentNode?.replaceChild(this.returnContainer.fag, this.elementSource.element);
        // const rrr = rr.flatMap(it => it.render(obj, config));// .flat();
        this.returnContainer.raws.push(...rr);
        return ExecuteState.EXECUTE;
    }


    public static append(obj: any, fullPath: string, key: string, rawSet: RawSet, config: Config) {
        const genNode = config.window.document.importNode(rawSet.fragment, true);
        // console.log('---> append', rawSet, genNode);
        const rawSets: RawSet[] = [];
        for (const cNode of Array.from(genNode.childNodes.values())) {
            const element = cNode.cloneNode(true) as Element;
            element.removeAttribute(RawSet.DR_THIS_PROPERTY_NAME);
            element.setAttribute(RawSet.DR_THIS_NAME, `this.${fullPath}`);
            element.setAttribute(RawSet.DR_KEY_OPTIONNAME, key);
            // rawSet.point.end.after(element);
            const fg = config.window.document.createDocumentFragment()
            fg.append(element);
            rawSets.push(...RawSet.checkPointCreates(fg, obj, config));
            rawSet.point.end.before(fg);
            const start = (rawSet.point.start as Element);
            const keys = start.getAttribute(RawSet.DR_HAS_KEYS_OPTIONNAME)?.split(',') ?? [];
            keys.push(key);
            start.setAttribute(RawSet.DR_HAS_KEYS_OPTIONNAME, keys.join(','));
            rawSets.forEach(async (it) => await it.render(obj, config));
        }
        return rawSets;
    }
}
