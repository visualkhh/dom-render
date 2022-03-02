import {RandomUtils} from './utils/random/RandomUtils';
import {StringUtils} from './utils/string/StringUtils';
import {ScriptUtils} from './utils/script/ScriptUtils';
import {EventManager, eventManager} from './events/EventManager';
import {Config, TargetAttr, TargetElement} from './Config';
import {Range} from './iterators/Range';
import {Validator} from './validators/Validator';
import {ValidatorArray} from './validators/ValidatorArray';
import {DomRenderFinalProxy} from './types/Types';

type Attrs = {
    dr: string | null
    drIf: string | null
    drFor: string | null
    drForOf: string | null
    drRepeat: string | null
    drThis: string | null
    drForm: string | null
    drPre: string | null
    drInnerHTML: string | null
    drInnerText: string | null
    drItOption: string | null
    drVarOption: string | null
    drAfterOption: string | null
    drBeforeOption: string | null
    drCompleteOption: string | null
    drStripOption: string | null
}

export class RawSet {
    public static readonly DR = 'dr';
    public static readonly DR_IF_NAME = 'dr-if';
    public static readonly DR_FOR_NAME = 'dr-for';
    public static readonly DR_FOR_OF_NAME = 'dr-for-of';
    public static readonly DR_REPEAT_NAME = 'dr-repeat';
    public static readonly DR_THIS_NAME = 'dr-this';
    public static readonly DR_FORM_NAME = 'dr-form';
    public static readonly DR_PRE_NAME = 'dr-pre';
    public static readonly DR_INNERHTML_NAME = 'dr-inner-html';
    public static readonly DR_INNERTEXT_NAME = 'dr-inner-text';
    public static readonly DR_DETECT_NAME = 'dr-detect';

    // public static readonly DR_DETECT_ACTION_NAME = 'dr-detect-action';

    public static readonly DR_IT_OPTIONNAME = 'dr-it';
    public static readonly DR_VAR_OPTIONNAME = 'dr-var';
    public static readonly DR_AFTER_OPTIONNAME = 'dr-after';
    public static readonly DR_BEFORE_OPTIONNAME = 'dr-before';
    public static readonly DR_COMPLETE_OPTIONNAME = 'dr-complete';
    public static readonly DR_STRIP_OPTIONNAME = 'dr-strip';

    public static readonly drAttrsOriginName: Attrs = {
        dr: RawSet.DR,
        drIf: RawSet.DR_IF_NAME,
        drFor: RawSet.DR_FOR_NAME,
        drForOf: RawSet.DR_FOR_OF_NAME,
        drRepeat: RawSet.DR_REPEAT_NAME,
        drThis: RawSet.DR_THIS_NAME,
        drForm: RawSet.DR_FORM_NAME,
        drPre: RawSet.DR_PRE_NAME,
        drInnerHTML: RawSet.DR_INNERHTML_NAME,
        drInnerText: RawSet.DR_INNERTEXT_NAME,
        drItOption: RawSet.DR_IT_OPTIONNAME,
        drVarOption: RawSet.DR_VAR_OPTIONNAME,
        drAfterOption: RawSet.DR_AFTER_OPTIONNAME,
        drBeforeOption: RawSet.DR_BEFORE_OPTIONNAME,
        drCompleteOption: RawSet.DR_COMPLETE_OPTIONNAME,
        drStripOption: RawSet.DR_STRIP_OPTIONNAME
    };

    public static readonly DR_TAGS = [];

    public static readonly DR_ATTRIBUTES = [RawSet.DR, RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_FOR_NAME, RawSet.DR_THIS_NAME, RawSet.DR_FORM_NAME, RawSet.DR_PRE_NAME, RawSet.DR_INNERHTML_NAME, RawSet.DR_INNERTEXT_NAME, RawSet.DR_REPEAT_NAME, RawSet.DR_DETECT_NAME];

    constructor(
        public uuid: string,
        public point: { start: Comment, end: Comment, thisVariableName?: string | null },
        public fragment: DocumentFragment, public detect?:{action: Function}, public data: any = {}) {
    }

    get isConnected() {
        return this.point.start.isConnected && this.point.end.isConnected;
    }

    getUsingTriggerVariables(config?: Config): Set<string> {
        const usingTriggerVariables = new Set<string>();
        this.fragment.childNodes.forEach((cNode, key) => {
            let script = '';
            if (cNode.nodeType === Node.TEXT_NODE) {
                script = `\`${(cNode as Text).textContent ?? ''}\``;
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                const targetAttrNames = (config?.targetAttrs?.map(it => it.name) ?? []).concat(RawSet.DR_ATTRIBUTES)
                script = targetAttrNames.map(it => (element.getAttribute(it))).filter(it => it).join(';');
            }
            if (script) {
                // script = script.replace('}$','}');
                // console.log('----------->', script)
                EventManager.VARNAMES.forEach(it => {
                    // script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), `this?.___${it}`);
                    // script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), `this.___${it}`);
                    script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), `this.___${it}`);
                })
                // console.log('----------', script);
                Array.from(ScriptUtils.getVariablePaths(script)).filter(it => !it.startsWith(`___${EventManager.SCRIPTS_VARNAME}`)).forEach(it => usingTriggerVariables.add(it));
            }
        })
        // console.log('usingTriggerVariable----------->', usingTriggerVariables)
        return usingTriggerVariables;
    }

    public render(obj: any, config: Config): RawSet[] {
        const genNode = config.window.document.importNode(this.fragment, true);
        const raws: RawSet[] = [];
        const onAttrInitCallBack: { attrName: string, attrValue: string, obj: any }[] = [];
        const onElementInitCallBack: { name: string, obj: any, targetElement: TargetElement, creatorMetaData: CreatorMetaData }[] = [];
        const drAttrs: Attrs[] = [];

        for (const cNode of Array.from(genNode.childNodes.values())) {
            const __render = Object.freeze({
                rawset: this,
                scripts: EventManager.setBindProperty(config?.scripts, obj),
                range: Range.range,
                element: cNode,
                bindScript: `
                    const ${EventManager.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${EventManager.RAWSET_VARNAME} = this.__render.rawset;
                    const ${EventManager.ELEMENT_VARNAME} = this.__render.element;
                    const ${EventManager.RANGE_VARNAME} = this.__render.range;
            `
                // eslint-disable-next-line no-use-before-define
            }) as unknown as Render;

            const fag = config.window.document.createDocumentFragment();
            if (cNode.nodeType === Node.TEXT_NODE && cNode.textContent) {
                const textContent = cNode.textContent;
                const runText = RawSet.exporesionGrouops(textContent)[0][1];
                // console.log('--->', textContent,runText, runText[0][1])
                let n: Node;
                if (textContent?.startsWith('#')) {
                    const r = ScriptUtils.eval(`${__render.bindScript} return ${runText}`, Object.assign(obj, {__render}));
                    const template = config.window.document.createElement('template') as HTMLTemplateElement;
                    template.innerHTML = r;
                    n = template.content;
                } else {
                    const r = ScriptUtils.eval(`${__render.bindScript}  return ${runText}`, Object.assign(obj, {__render}));
                    n = config.window.document.createTextNode(r);
                }
                cNode.parentNode?.replaceChild(n, cNode)
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                const drAttr = {
                    dr: this.getAttributeAndDelete(element, RawSet.DR),
                    drIf: this.getAttributeAndDelete(element, RawSet.DR_IF_NAME),
                    drFor: this.getAttributeAndDelete(element, RawSet.DR_FOR_NAME),
                    drForOf: this.getAttributeAndDelete(element, RawSet.DR_FOR_OF_NAME),
                    drRepeat: this.getAttributeAndDelete(element, RawSet.DR_REPEAT_NAME),
                    drThis: this.getAttributeAndDelete(element, RawSet.DR_THIS_NAME),
                    drForm: this.getAttributeAndDelete(element, RawSet.DR_FORM_NAME),
                    drPre: this.getAttributeAndDelete(element, RawSet.DR_PRE_NAME),
                    drInnerHTML: this.getAttributeAndDelete(element, RawSet.DR_INNERHTML_NAME),
                    drInnerText: this.getAttributeAndDelete(element, RawSet.DR_INNERTEXT_NAME),
                    drItOption: this.getAttributeAndDelete(element, RawSet.DR_IT_OPTIONNAME),
                    drVarOption: this.getAttributeAndDelete(element, RawSet.DR_VAR_OPTIONNAME),
                    drAfterOption: this.getAttributeAndDelete(element, RawSet.DR_AFTER_OPTIONNAME),
                    drBeforeOption: this.getAttributeAndDelete(element, RawSet.DR_BEFORE_OPTIONNAME),
                    drCompleteOption: this.getAttributeAndDelete(element, RawSet.DR_COMPLETE_OPTIONNAME),
                    drStripOption: this.getAttributeAndDelete(element, RawSet.DR_STRIP_OPTIONNAME)
                } as Attrs;
                drAttrs.push(drAttr);

                if (drAttr.drPre != null) {
                    break;
                }
                if (drAttr.dr !== null && drAttr.dr.length >= 0) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval(`
                        ${__render.bindScript}
                        const n = $element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
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
                        }`, Object.assign(obj, {
                        __render: Object.freeze({
                            fag: newTemp,
                            drStripOption: drAttr.drStripOption,
                            ...__render
                        } as Render)
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                else if (drAttr.drIf) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = config.window.document.createElement('temp');
                    // Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v)); <-- 이부분은 다른 attr에도 적용을 할지말지 생각해야됨  엘리먼트 존재유무에 따라서 적용을 할지말지 결정해야됨
                    const keepgoing = ScriptUtils.eval(`
                    ${__render.bindScript}
                    ${drAttr.drBeforeOption ?? ''}
                    if ($rawset.data === (${drAttr.drIf})) {
                        return false;
                    } 
                    $rawset.data = ${drAttr.drIf} 
                    if($rawset.data) {
                        const n = $element.cloneNode(true);
                        Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drIf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));
                        var destIt = ${drAttr.drItOption};
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
                    ${drAttr.drAfterOption ?? ''};
                    return true;
                    `, Object.assign(obj,
                        {
                            __render: Object.freeze({
                                fag: newTemp,
                                drAttr: drAttr,
                                drAttrsOriginName: RawSet.drAttrsOriginName,
                                drStripOption: drAttr.drStripOption,
                                ...__render
                            } as Render)
                        }
                    ));
                    // console.log('keepgoing', keepgoing);
                    if (keepgoing === false) {
                        return raws;
                    }
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const bypass = (newTemp.innerHTML ?? '').trim().length <= 0;
                    const tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    // console.log(tempalte.innerHTML)
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr);
                    if (bypass) {
                        continue;
                    }
                }
                else if (drAttr.drThis) {
                    const r = ScriptUtils.evalReturn(drAttr.drThis, obj);
                    if (r) {
                        fag.append(RawSet.drThisCreate(element, drAttr.drThis, drAttr.drVarOption ?? '', drAttr.drStripOption, obj, config))
                        const rr = RawSet.checkPointCreates(fag, config)
                        element.parentNode?.replaceChild(fag, element);
                        raws.push(...rr);
                    } else {
                        cNode.remove();
                    }
                }

                else if (drAttr.drForm) {
                    RawSet.drFormOtherMoveAttr(element, 'name', 'temp-name', config);
                    const data = ScriptUtils.evalReturn(`${drAttr.drForm}`, obj);

                    const childs = Array.from(element.querySelectorAll('[name]'));

                    const fromName = ScriptUtils.evalReturn(element.getAttribute('dr-form:name') ?? '', obj);
                    const thisName = fromName ?? element.getAttribute('name');
                    // console.log('dr-form:name', thisName, element.getAttribute('dr-form:name'), obj, element);
                    // // 자기자신이 Input 대상일때
                    if (childs.length <= 0 && thisName) {
                        childs.push(element);
                    } else {
                        if (data instanceof Validator) {
                            data.setTarget(element);
                        }
                    }
                    childs.forEach(it => {
                        const eventName = it.getAttribute('dr-form:event') ?? 'change'
                        const validatorName = it.getAttribute('dr-form:validator');
                        const attrEventName = EventManager.attrPrefix + 'event-' + eventName;
                        let varpath = ScriptUtils.evalReturn(element.getAttribute('dr-form:name') ?? '', obj) ?? it.getAttribute('name');
                        if (varpath != null) {
                            if (validatorName) {
                                ScriptUtils.eval(`
                                    ${__render.bindScript}
                                    const validator = typeof ${validatorName} ==='function' ?  new  ${validatorName}() : ${validatorName};
                                    ${drAttr.drForm}['${varpath}'] = validator;
                                `,
                                Object.assign(obj, {
                                    __render: Object.freeze({
                                        drStripOption: drAttr.drStripOption,
                                        ...__render
                                    } as Render)
                                }
                                ));
                            }
                            varpath = `${drAttr.drForm}['${varpath}']`;
                            const data = ScriptUtils.evalReturn(`${varpath}`, obj);
                            if (data instanceof ValidatorArray) {
                                it.setAttribute(attrEventName, `${varpath}.setArrayValue($target, $target.value, $event); ${it.getAttribute(attrEventName) ?? ''};`);
                                data.addValidator((it as any).value, it);
                            } else if (data instanceof Validator) {
                                // varpath += (varpath ? '.value' : 'value');
                                // varpath = drAttr.drForm + '.' + varpath;
                                // it.setAttribute(attrEventName, `${varpath} = $target.value; ${target}=$target; ${event}=$event;`);
                                it.setAttribute(attrEventName, `${varpath}.set($target.value, $target, $event); ${it.getAttribute(attrEventName) ?? ''};`);
                                data.setTarget(it);
                                data.value = (it as any).value;
                            } else {
                                it.setAttribute(attrEventName, `${varpath} = $target.value;`);
                            }
                        }
                    })
                    RawSet.drFormOtherMoveAttr(element, 'temp-name', 'name', config);
                    raws.push(...RawSet.checkPointCreates(element, config));
                }

                else if (drAttr.drInnerText) {
                    const newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval(` 
                        ${__render.bindScript}
                        const n = $element.cloneNode(true);  
                        ${drAttr.drBeforeOption ?? ''}
                        n.innerText = ${drAttr.drInnerText};
                        if (this.__render.drStripOption === 'true') {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                        ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            drStripOption: drAttr.drStripOption,
                            fag: newTemp,
                            ...__render
                        } as Render)
                    }));
                    const tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    const rr = RawSet.checkPointCreates(fag, config);
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr);
                }

                else if (drAttr.drInnerHTML) {
                    const newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval(`
                        ${__render.bindScript}
                        const n = $element.cloneNode(true);
                        ${drAttr.drBeforeOption ?? ''}
                        n.innerHTML = ${drAttr.drInnerHTML};
                        if (this.__render.drStripOption === 'true') {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                        ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            drStripOption: drAttr.drStripOption,
                            fag: newTemp,
                            ...__render
                            // eslint-disable-next-line no-use-before-define
                        } as Render)
                    }));
                    const tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    const rr = RawSet.checkPointCreates(fag, config);
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr);
                }

                else if (drAttr.drFor) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval(`
                    ${__render.bindScript}
                    ${drAttr.drBeforeOption ?? ''}
                    for(${drAttr.drFor}) {
                        const n = this.__render.element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForIt\\#/g, destIt).replace(/\\#nearForIndex\\#/g, destIt))) 
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, destIt);
                        }
                        if (this.__render.drStripOption === 'true') {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                    }
                    ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            fag: newTemp,
                            drStripOption: drAttr.drStripOption,
                            ...__render
                        })
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                else if (drAttr.drForOf) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval(`
                    ${__render.bindScript}
                    ${drAttr.drBeforeOption ?? ''}
                    var i = 0; 
                    const forOf = ${drAttr.drForOf};
                    const forOfStr = \`${drAttr.drForOf}\`.trim();
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
                            Object.entries(this.__render.drAttr).filter(([k,v]) => k !== 'drForOf' && v).forEach(([k, v]) => n.setAttribute(this.__render.drAttrsOriginName[k], v));
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIt\\#/g, destIt).replace(/\\#it\\#/g, destIt).replace(/\\#nearForOfIndex\\#/g, i)))
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt).replace(/\\#index\\#/g, i);
                            if (this.__render.drStripOption === 'true') {
                                Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                            } else {
                                this.__render.fag.append(n);
                            }
                            i++;
                        }
                    }
                    ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            drStripOption: drAttr.drStripOption,
                            drAttr: drAttr,
                            drAttrsOriginName: RawSet.drAttrsOriginName,
                            fag: newTemp,
                            ...__render
                            // eslint-disable-next-line no-use-before-define
                        } as Render)
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config);
                    element.parentNode?.replaceChild(fag, element);
                    // const rrr = rr.flatMap(it => it.render(obj, config));// .flat();
                    raws.push(...rr)
                }

                else if (drAttr.drRepeat) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = config.window.document.createElement('temp');
                    ScriptUtils.eval(`
                    ${__render.bindScript}
                    ${drAttr.drBeforeOption ?? ''}
                    var i = 0; 
                    const repeat = ${drAttr.drRepeat};
                    const repeatStr = \`${drAttr.drRepeat}\`;
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
                    ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            fag: newTemp,
                            drStripOption: drAttr.drStripOption,
                            ...__render
                        })
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = config.window.document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                else {
                    // config detecting
                    // console.log('config targetElement-->', config?.targetElements)
                    // const targetElement = config?.targetElements?.find(it => (!drAttr.drIf && !drAttr.drForOf && !drAttr.drFor && !drAttr.drRepeat) && it.name.toLowerCase() === element.tagName.toLowerCase());
                    const targetElement = config?.targetElements?.find(it => it.name.toLowerCase() === element.tagName.toLowerCase());
                    if (targetElement) {
                        const documentFragment = targetElement.callBack(element, obj, this);
                        // console.log('target-->',name, documentFragment)
                        if (documentFragment) {
                            const detectAction = element.getAttribute(RawSet.DR_DETECT_NAME);
                            if (detectAction && (documentFragment as any).render) {
                                this.detect = {
                                    action: () => {
                                        const script = `var $component = this.__render.component; var $element = this.__render.element; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute;  ${detectAction} `;
                                        ScriptUtils.eval(script, Object.assign(obj, {
                                            __render: (documentFragment as any).render
                                        }))
                                    }
                                };
                            }
                            // fag.append(documentFragment)
                            const rr = RawSet.checkPointCreates(documentFragment, config)
                            element.parentNode?.replaceChild(documentFragment, element);
                            raws.push(...rr);
                            onElementInitCallBack.push({
                                name: targetElement.name.toLowerCase(),
                                obj,
                                targetElement,
                                creatorMetaData: targetElement.__creatorMetaData as CreatorMetaData
                            });
                            targetElement?.complete?.(element, obj, this);
                        }
                    }
                    const attributeNames = this.getAttributeNames(element);
                    // const targetAttr = config?.targetAttrs?.find(it => (!drAttr.drForOf && !drAttr.drFor && !drAttr.drRepeat) && attributeNames.includes(it.name));
                    const targetAttr = config?.targetAttrs?.find(it => attributeNames.includes(it.name));
                    if (targetAttr) {
                        const attrName = targetAttr.name;
                        const attrValue = this.getAttributeAndDelete(element, attrName)
                        if (attrValue && attrName && (!drAttr.drForOf && !drAttr.drFor && !drAttr.drRepeat)) {
                            const documentFragment = targetAttr.callBack(element, attrValue, obj, this);
                            if (documentFragment) {
                                const rr = RawSet.checkPointCreates(documentFragment, config)
                                element.parentNode?.replaceChild(documentFragment, element);
                                raws.push(...rr);
                                onAttrInitCallBack.push({
                                    attrName,
                                    attrValue,
                                    obj
                                });
                                targetAttr?.complete?.(element, attrValue, obj, this);
                            }
                        }
                    }
                }
            }
        }

        this.applyEvent(obj, genNode, config);
        this.replaceBody(genNode);
        drAttrs.forEach(it => {
            if (it.drCompleteOption) {
                // genNode.childNodes
                ScriptUtils.eval(`
                const ${EventManager.FAG_VARNAME} = this.__render.fag;
                const ${EventManager.SCRIPTS_VARNAME} = this.__render.scripts;
                const ${EventManager.RAWSET_VARNAME} = this.__render.rawset;
                ${it.drCompleteOption}
                `, Object.assign(obj, {
                    __render: Object.freeze({
                        rawset: this,
                        fag: genNode,
                        scripts: EventManager.setBindProperty(config?.scripts, obj)
                    } as Render)
                }
                ));
            }
        })
        for (const it of onElementInitCallBack) {
            it.targetElement?.__render?.component?.onInitRender?.({render: it.targetElement?.__render, creatorMetaData: it.targetElement?.__creatorMetaData});
            const r = config?.onElementInit?.(it.name, obj, this, it.targetElement);
        }
        for (const it of onAttrInitCallBack) {
            const r = config?.onAttrInit?.(it.attrName, it.attrValue, obj, this);
        }
        return raws;
    }

    public applyEvent(obj: any, fragment = this.fragment, config?: Config) {
        eventManager.applyEvent(obj, eventManager.findAttrElements(fragment, config), config)
    }

    public getAttributeNames(element: Element) {
        return element.getAttributeNames();
    }

    public getAttribute(element: Element, attr: string) {
        const data = element.getAttribute(attr)
        return data;
    }

    public getAttributeAndDelete(element: Element, attr: string) {
        const data = element.getAttribute(attr)
        element.removeAttribute(attr);
        return data;
    }

    public replaceBody(genNode: Node) {
        this.childAllRemove();
        this.point.start.parentNode?.insertBefore(genNode, this.point.start.nextSibling);
    }

    public static checkPointCreates(element: Node, config: Config): RawSet[] {
        const thisVariableName = (element as any).__domrender_this_variable_name;
        // console.log('checkPointCreates thisVariableName', thisVariableName);
        const nodeIterator = config.window.document.createNodeIterator(element, NodeFilter.SHOW_ALL, {
            acceptNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // console.log('????????', node.parentElement, node.parentElement?.getAttribute('dr-pre'));
                    // console.log('???????/',node.textContent, node.parentElement?.getAttribute('dr-pre'))
                    // 나중에
                    // const between = StringUtils.betweenRegexpStr('[$#]\\{', '\\}', StringUtils.deleteEnter((node as Text).data ?? ''))
                    const between = RawSet.exporesionGrouops(StringUtils.deleteEnter((node as Text).data ?? ''))
                    // console.log('bbbb', between)
                    return between?.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    // return /\$\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    // return /[$#]\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    const isElement = (config.targetElements?.map(it => it.name.toLowerCase()) ?? []).includes(element.tagName.toLowerCase());
                    const targetAttrNames = (config.targetAttrs?.map(it => it.name) ?? []).concat(RawSet.DR_ATTRIBUTES);
                    const isAttr = element.getAttributeNames().filter(it => targetAttrNames.includes(it.toLowerCase())).length > 0;
                    return (isAttr || isElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });
        const pars: RawSet[] = [];
        let currentNode;
        // eslint-disable-next-line no-cond-assign
        while (currentNode = nodeIterator.nextNode()) {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                const text = (currentNode as Text).textContent ?? '';
                const template = config.window.document.createElement('template');
                // const a = StringUtils.regexExec(/\$\{.*?\}/g, text);
                // const a = StringUtils.regexExec(/[$#]\{.*?\}/g, text);
                // const a = StringUtils.betweenRegexpStr('[$#]\\{', '\\}', text); // <--나중에..
                const a = RawSet.exporesionGrouops(text); // <--나중에..
                const map = a.map(it => {
                    return {
                        uuid: RandomUtils.uuid(),
                        content: it[0],
                        regexArr: it
                    }
                });
                let lasterIndex = 0;
                map.forEach(it => {
                    const regexArr = it.regexArr;
                    const preparedText = regexArr.input.substring(lasterIndex, regexArr.index);
                    const start = config.window.document.createComment(`start text ${it.uuid}`);
                    const end = config.window.document.createComment(`end text ${it.uuid}`);
                    // layout setting
                    template.content.append(document.createTextNode(preparedText)); // 사이사이값.
                    template.content.append(start);
                    template.content.append(end);

                    // content
                    const fragment = config.window.document.createDocumentFragment();
                    fragment.append(config.window.document.createTextNode(it.content))
                    pars.push(new RawSet(it.uuid, {
                        start,
                        end,
                        thisVariableName
                    }, fragment));
                    lasterIndex = regexArr.index + it.content.length;
                })
                template.content.append(config.window.document.createTextNode(text.substring(lasterIndex, text.length)));
                currentNode?.parentNode?.replaceChild(template.content, currentNode);
            } else {
                // console.log('------------->', currentNode)
                const uuid = RandomUtils.uuid()
                const fragment = config.window.document.createDocumentFragment();
                const start = config.window.document.createComment(`start ${uuid}`)
                const end = config.window.document.createComment(`end ${uuid}`)
                // console.log('start--', uuid)
                currentNode?.parentNode?.insertBefore(start, currentNode);
                currentNode?.parentNode?.insertBefore(end, currentNode.nextSibling);
                fragment.append(currentNode);
                pars.push(new RawSet(uuid, {
                    start,
                    end,
                    thisVariableName
                }, fragment))
            }
        }
        // console.log('check-->', pars)
        return pars;
    }

    public childAllRemove() {
        let next = this.point.start.nextSibling;
        while (next) {
            if (next === this.point.end) {
                break;
            }
            next.remove();
            next = this.point.start.nextSibling;
        }
    }

    public static drItOtherEncoding(element: Element | DocumentFragment) {
        const random = RandomUtils.uuid();
        const regex = /#it#/g;
        element.querySelectorAll(`[${RawSet.DR_IT_OPTIONNAME}], [${RawSet.DR_FOR_OF_NAME}], [${RawSet.DR_REPEAT_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(regex, random);
        });
        return random;
    }

    public static drItOtherDecoding(element: Element | DocumentFragment, random: string) {
        element.querySelectorAll(`[${RawSet.DR_IT_OPTIONNAME}], [${RawSet.DR_FOR_OF_NAME}], [${RawSet.DR_REPEAT_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(RegExp(random, 'g'), '#it#');
        });
    }

    // public static drDVarEncoding(element: Element, drVarOption: string) {
    //     const vars = (drVarOption?.split(',') ?? []).map(it => {
    //         const s = it.trim().split('=');
    //         return {
    //             name: s[0],
    //             value: s[1],
    //             regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
    //             random: RandomUtils.uuid()
    //         }
    //     })
    //     element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
    //         vars.filter(vit => vit.value && vit.name).forEach(vit => {
    //             it.innerHTML = it.innerHTML.replace(vit.regex, vit.random);
    //         })
    //     });
    //     vars.filter(vit => vit.value && vit.name).forEach(vit => {
    //         element.innerHTML = element.innerHTML.replace(vit.regex, vit.value);
    //     })
    //     return vars;
    // }
    //
    // public static drDVarDecoding(element: Element, vars: { name: string, value: string, regex: RegExp, random: string }[]) {
    //     element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
    //         vars.filter(vit => vit.value && vit.name).forEach(vit => {
    //             it.innerHTML = it.innerHTML.replace(RegExp(vit.random, 'g'), vit.value);
    //         })
    //     });
    // }

    public static drThisEncoding(element: Element, drThis: string): string {
        const thisRandom = RandomUtils.uuid()
        // const thisRegex = /(?<!(dr-|\.))this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this\./g;
        // safari 때문에 전위 검색 regex가 안됨 아 짜증나서 이걸로함.

        // element.querySelectorAll(`[${RawSet.DR_PRE_NAME}]`).forEach(it => {
        //     let message = it.innerHTML;
        // })

        // console.log('-----?', `[${RawSet.DR_THIS_NAME}], :not([${RawSet.DR_PRE_NAME}])`)
        element.querySelectorAll(`[${RawSet.DR_PRE_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(/this/g, thisRandom);
        })
        element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
            let message = it.innerHTML;
            StringUtils.regexExec(/([^(dr\-)])?this(?=.?)/g, message).reverse().forEach(it => {
                message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], `${it[1] ?? ''}${drThis}`);
            })
            it.innerHTML = message;
        })

        let message = element.innerHTML;
        StringUtils.regexExec(/([^(dr\-)])?this(?=.?)/g, message).reverse().forEach(it => {
            message = message.substr(0, it.index) + message.substr(it.index).replace(it[0], `${it[1] ?? ''}${drThis}`);
        })
        element.innerHTML = message;
        return thisRandom;
    }

    public static drThisDecoding(element: Element, thisRandom: string) {
        element.querySelectorAll(`[${RawSet.DR_PRE_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(RegExp(thisRandom, 'g'), 'this');
        })
        element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(RegExp(thisRandom, 'g'), 'this');
        });
    }

    public static drFormOtherMoveAttr(element: Element, as: string, to: string, config: Config) {
        element.querySelectorAll(`[${RawSet.DR_FORM_NAME}]`).forEach(subElement => {
            const nodeIterator = config.window.document.createNodeIterator(subElement, NodeFilter.SHOW_ELEMENT, {
                acceptNode(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        return element.hasAttribute(as) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
                    } else {
                        return NodeFilter.FILTER_REJECT;
                    }
                }
            })

            let node;
            // eslint-disable-next-line no-cond-assign
            while (node = nodeIterator.nextNode()) {
                const element = node as Element;
                element.setAttribute(to, element.getAttribute(as) ?? '')
                element.removeAttribute(as)
            }
        })
    }

    public static drVarEncoding(element: Element, drVarOption: string) {
        const vars = (drVarOption?.split(',') ?? []).map(it => {
            const s = it.trim().split('=');
            const name = s[0]?.trim();
            const value = s[1]?.trim();
            return {
                name,
                value,
                // regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
                regex: RegExp('\\$var\\.' + name + '(?=.?)', 'g'),
                random: RandomUtils.uuid()
            }
        })
        // element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
        element.querySelectorAll(`[${RawSet.DR_VAR_OPTIONNAME}]`).forEach(it => {
            vars.filter(vit => vit.value && vit.name).forEach(vit => {
                it.innerHTML = it.innerHTML.replace(vit.regex, vit.random);
            })
        });
        vars.filter(vit => vit.value && vit.name).forEach(vit => {
            element.innerHTML = element.innerHTML.replace(vit.regex, vit.value);
        })
        return vars;
    }

    public static drVarDecoding(element: Element, vars: { name: string, value: string, regex: RegExp, random: string }[]) {
        element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
            vars.filter(vit => vit.value && vit.name).forEach(vit => {
                it.innerHTML = it.innerHTML.replace(RegExp(vit.random, 'g'), vit.value);
            })
        });
    }

    public static drThisCreate(element: Element, drThis: string, drVarOption: string, drStripOption: boolean | string | null, obj: any, config: Config) {
        const fag = config.window.document.createDocumentFragment();
        const n = element.cloneNode(true) as Element;
        n.querySelectorAll(eventManager.attrNames.map(it => `[${it}]`).join(',')).forEach(it => {
            it.setAttribute(EventManager.ownerVariablePathAttrName, 'this');
        })
        const thisRandom = this.drThisEncoding(n, drThis)
        const vars = this.drVarEncoding(n, drVarOption)
        this.drVarDecoding(n, vars)
        this.drThisDecoding(n, thisRandom);
        if (drStripOption && (drStripOption === true || drStripOption === 'true')) {
            Array.from(n.childNodes).forEach(it => fag.append(it));
        } else {
            fag.append(n)
        }
        (fag as any).__domrender_this_variable_name = drThis;
        // console.log('set __domrender_this_variable_name', (fag as any).__domrender_this_variable_name)
        return fag;
    }

    public static createComponentTargetAttribute(name: string, getThisObj: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => any, factory: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment) {
        const targetAttribute: TargetAttr = {
            name,
            callBack(element: Element, attrValue: string, obj: any, rawSet: RawSet): DocumentFragment {
                const thisObj = getThisObj(element, attrValue, obj, rawSet);
                const data = factory(element, attrValue, obj, rawSet);
                rawSet.point.thisVariableName = (data as any).__domrender_this_variable_name;
                if (thisObj) {
                    const i = thisObj.__domrender_component_new = (thisObj.__domrender_component_new ?? new Proxy({}, new DomRenderFinalProxy())) as CreatorMetaData;
                    i.thisVariableName = rawSet.point.thisVariableName;
                    i.rawSet = rawSet;
                    i.innerHTML = element.innerHTML;
                    i.rootCreator = new Proxy(obj, new DomRenderFinalProxy());
                    i.creator = new Proxy(rawSet.point.thisVariableName ? ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj) : obj, new DomRenderFinalProxy());
                }
                return data;
            }

        }
        return targetAttribute;
    }

    public static createComponentTargetElement(name: string,
        objFactory: (element: Element, obj: any, rawSet: RawSet) => any,
        template: string = '',
        styles: string[] = [],
        // scripts: { [n: string]: any } | undefined,
        // complete: (element: Element, obj: any, rawSet: RawSet) => void  | undefined,
        config: Config
    ): TargetElement {
        const targetElement: TargetElement = {
            name,
            styles,
            template,
            callBack(element: Element, obj: any, rawSet: RawSet): DocumentFragment {
                // console.log('callback------->')
                if (!obj.__domrender_components) {
                    obj.__domrender_components = {};
                }
                const domrenderComponents = obj.__domrender_components;
                const componentKey = '_' + RandomUtils.getRandomString(20);
                // console.log('callback settttt---a-->', componentKey, objFactory, objFactory(element, obj, rawSet))
                domrenderComponents[componentKey] = objFactory(element, obj, rawSet);
                const instance = domrenderComponents[componentKey];
                const onCreate = element.getAttribute('dr-on-create')
                let createParam;
                if (onCreate) {
                    //     const script = `var $component = this.__render.component; var $element = this.__render.element; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute;  ${onCreate} `;
                    //     const script = `${onCreate} `;
                    createParam = ScriptUtils.evalReturn(onCreate, obj);
                }
                instance?.onCreateRender?.(createParam);
                const attribute = {} as any;
                element.getAttributeNames().forEach(it => {
                    attribute[it] = element.getAttribute(it);
                });
                const render = Object.freeze({
                    component: instance,
                    element: element,
                    innerHTML: element.innerHTML,
                    attribute: attribute,
                    rawset: rawSet,
                    componentKey,
                    scripts: EventManager.setBindProperty(config.scripts ?? {}, obj)
                    // eslint-disable-next-line no-use-before-define
                } as Render);
                this.__render = render;

                const i = instance.__domrender_component_new = (instance.__domrender_component_new ?? new Proxy({}, new DomRenderFinalProxy())) as CreatorMetaData;
                i.thisVariableName = rawSet.point.thisVariableName;
                i.thisFullVariableName = `this.__domrender_components.${componentKey}`;
                i.rawSet = rawSet;
                i.innerHTML = element.innerHTML;
                i.rootCreator = new Proxy(obj, new DomRenderFinalProxy());
                i.creator = new Proxy(rawSet.point.thisVariableName ? ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj) : obj, new DomRenderFinalProxy());
                this.__creatorMetaData = i;
                let applayTemplate = element.innerHTML;
                let innerHTMLThisRandom;
                if (applayTemplate) {
                    // if (rawSet.point.thisVariableName) {
                    // 넘어온 innerHTML에 this가 있으면 해당안되게 우선 치환.
                    innerHTMLThisRandom = RandomUtils.uuid();
                    applayTemplate = applayTemplate.replace(/this\./g, innerHTMLThisRandom);
                    // }
                    applayTemplate = applayTemplate.replace(/#component#/g, 'this');
                }
                applayTemplate = template.replace(/#innerHTML#/g, applayTemplate);

                const oninit = element.getAttribute(EventManager.onInitAttrName); // dr-on-init
                if (oninit) {
                    const script = `var $component = this.__render.component; var $element = this.__render.element; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute;  ${oninit} `;
                    ScriptUtils.eval(script, Object.assign(obj, {
                        __render: render
                    }))
                }
                const innerHTML = (styles?.map(it => `<style>${it}</style>`) ?? []).join(' ') + (applayTemplate ?? '');
                element.innerHTML = innerHTML;
                // console.log('------>', element.innerHTML, obj)
                let data = RawSet.drThisCreate(element, `this.__domrender_components.${componentKey}`, '', true, obj, config);

                // 넘어온 innerHTML에 this가 있는걸 다시 복호화해서 제대로 작동하도록한다.
                if (innerHTMLThisRandom) {
                    const template = config.window.document.createElement('template') as HTMLTemplateElement;
                    template.content.append(data)
                    template.innerHTML = template.innerHTML.replace(RegExp(innerHTMLThisRandom, 'g'), 'this.');
                    data = template.content;
                }
                (data as any).render = render;
                return data;
            }
            // complete
        }
        return targetElement;
    }

    public static exporesionGrouops(data: string) {
        // const reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]*?)\}[$#]))/g;
        const reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]?[^{]*?)\}[$#]))/g;
        return StringUtils.regexExec(reg, data);
    }
}

export type Render = {
    rawset?: RawSet;
    scripts?: { [n: string]: any };
    bindScript?: string;
    element?: any;
    range?: any;
    value?: any;
    [n: string]: any

    // component?: any;
    // componentKey?: string;
    // component
    // element
    // innerHTML
    // attribute
    // rawset
    // componentKey
    // scripts
}

export type CreatorMetaData = {
    thisVariableName?: string | null;
    thisFullVariableName?: string | null;
    rawSet: RawSet;
    innerHTML: string;
    rootCreator: any;
    creator: any;
    // render?: Render;
}