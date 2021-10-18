import {RandomUtils} from './utils/random/RandomUtils';
import {StringUtils} from './utils/string/StringUtils';
import {ScriptUtils} from './utils/script/ScriptUtils';
import {eventManager} from './events/EventManager';
import {Config, TargetElement} from './Config';
import {Range} from './iterators/Range';
import {Validation} from './validations/Validation';
import {Validations} from './validations/Validations';

type Attrs = {
    dr: string | null
    drIf: string | null
    drFor: string | null
    drForOf: string | null
    drRepeat: string | null
    drThis: string | null
    drForm: string | null
    drInnerHTML: string | null
    drInnerText: string | null
    drItOption: string | null
    drVarOption: string | null
    drAfterOption: string | null
    drBeforeOption: string | null
    drCompleteOption: string | null
    drStripOption: boolean
}

export class RawSet {
    public static readonly DR = 'dr';
    public static readonly DR_IF_NAME = 'dr-if';
    public static readonly DR_FOR_OF_NAME = 'dr-for-of';
    public static readonly DR_FOR_NAME = 'dr-for';
    public static readonly DR_REPEAT_NAME = 'dr-repeat';
    public static readonly DR_THIS_NAME = 'dr-this';
    public static readonly DR_FORM_NAME = 'dr-form';
    public static readonly DR_INNERHTML_NAME = 'dr-inner-html';
    public static readonly DR_INNERTEXT_NAME = 'dr-inner-text';

    public static readonly DR_TAGS = [];

    public static readonly DR_IT_OPTIONNAME = 'dr-it';
    public static readonly DR_AFTER_OPTIONNAME = 'dr-after';
    public static readonly DR_BEFORE_OPTIONNAME = 'dr-before';
    public static readonly DR_COMPLETE_OPTIONNAME = 'dr-complete';
    public static readonly DR_VAR_OPTIONNAME = 'dr-var';
    public static readonly DR_STRIP_OPTIONNAME = 'dr-strip';
    // public static readonly DR_PARAMETER_OPTIONNAME = 'dr-parameter';
    // public static readonly DR_THIS_OPTIONNAME = 'dr-this';
    // public static readonly DR_CONTENT_OPTIONNAME = 'dr-content';
    public static readonly DR_ATTRIBUTES = [RawSet.DR, RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_FOR_NAME, RawSet.DR_THIS_NAME, RawSet.DR_FORM_NAME, RawSet.DR_INNERHTML_NAME, RawSet.DR_INNERTEXT_NAME, RawSet.DR_REPEAT_NAME];

    public static readonly SCRIPTS_VARNAME = '$scripts';
    public static readonly FAG_VARNAME = '$fag';
    public static readonly RAWSET_VARNAME = '$rawset';
    public static readonly RANGE_VARNAME = '$range';
    public static readonly ELEMENT_VARNAME = '$element';
    public static readonly TARGET_VARNAME = '$target';
    public static readonly VARNAMES = [RawSet.SCRIPTS_VARNAME, RawSet.FAG_VARNAME, RawSet.RAWSET_VARNAME, RawSet.RANGE_VARNAME, RawSet.ELEMENT_VARNAME, RawSet.TARGET_VARNAME];

    constructor(public uuid: string, public point: { start: Comment, end: Comment }, public fragment: DocumentFragment, public data: any = {}) { // , public thisObjPath?: string
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
                RawSet.VARNAMES.forEach(it => {
                    script = script.replace(RegExp(it.replace('$', '\\$'), 'g'), `this?.___${it}`);
                })
                Array.from(ScriptUtils.getVariablePaths(script)).filter(it => !it.startsWith(`___${RawSet.SCRIPTS_VARNAME}`) && !it.startsWith(`___${RawSet.SCRIPTS_VARNAME}`)).forEach(it => usingTriggerVariables.add(it));
            }
        })
        return usingTriggerVariables;
    }

    public render(obj: any, config?: Config): RawSet[] {
        const genNode = document.importNode(this.fragment, true);
        const raws: RawSet[] = [];
        const onAttrInitCallBack: { attrName: string, attrValue: string, obj: any }[] = [];
        const onElementInitCallBack: { name: string, obj: any }[] = [];
        const drAttrs: Attrs[] = [];
        genNode.childNodes.forEach((cNode, key) => {
            const fag = document.createDocumentFragment()
            if (cNode.nodeType === Node.TEXT_NODE) {
                const textContent = cNode.textContent;
                const n = document.createTextNode(ScriptUtils.eval(
                    `
                    const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${RawSet.RAWSET_VARNAME} = this.__render.rawset;
                    return \`${textContent}\`
                    `,
                    Object.assign(obj, {
                        __render: Object.freeze({
                            rawset: this,
                            scripts: RawSet.setBindProperty(config?.scripts, obj)
                            // eslint-disable-next-line no-use-before-define
                        } as Render)
                    }))
                )
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
                    drInnerHTML: this.getAttributeAndDelete(element, RawSet.DR_INNERHTML_NAME),
                    drInnerText: this.getAttributeAndDelete(element, RawSet.DR_INNERTEXT_NAME),
                    drItOption: this.getAttributeAndDelete(element, RawSet.DR_IT_OPTIONNAME),
                    drVarOption: this.getAttributeAndDelete(element, RawSet.DR_VAR_OPTIONNAME),
                    drAfterOption: this.getAttributeAndDelete(element, RawSet.DR_AFTER_OPTIONNAME),
                    drBeforeOption: this.getAttributeAndDelete(element, RawSet.DR_BEFORE_OPTIONNAME),
                    drCompleteOption: this.getAttributeAndDelete(element, RawSet.DR_COMPLETE_OPTIONNAME),
                    drStripOption: this.getAttributeAndDelete(element, RawSet.DR_STRIP_OPTIONNAME) === 'true'
                } as Attrs;
                drAttrs.push(drAttr);
                if (drAttr.dr !== null && drAttr.dr.length >= 0) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                        const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                        const ${RawSet.RAWSET_VARNAME} = this.__render.rawset;
                        const n = this.__render.element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }`, Object.assign(obj, {
                        __render: Object.freeze({
                            fag: newTemp,
                            drStripOption: drAttr.drStripOption,
                            element: element,
                            rawset: this,
                            scripts: RawSet.setBindProperty(config?.scripts, obj)
                            // eslint-disable-next-line no-use-before-define
                        } as Render)
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                if (drAttr.drIf) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                    const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${RawSet.RAWSET_VARNAME} = this.__render.rawset;
                    ${drAttr.drBeforeOption ?? ''}
                    if(${drAttr.drIf}) {
                        const n = this.__render.element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                    }
                    ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj,
                        {
                            __render: Object.freeze({
                                fag: newTemp,
                                drStripOption: drAttr.drStripOption,
                                element: element,
                                rawset: this,
                                scripts: RawSet.setBindProperty(config?.scripts, obj)
                                // eslint-disable-next-line no-use-before-define
                            } as Render)
                        }
                    ));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                if (drAttr.drThis) {
                    const r = ScriptUtils.evalReturn(drAttr.drThis, obj);
                    if (r) {
                        fag.append(RawSet.drThisCreate(element, drAttr.drThis, drAttr.drVarOption ?? '', drAttr.drStripOption, obj))
                        const rr = RawSet.checkPointCreates(fag, config)
                        element.parentNode?.replaceChild(fag, element);
                        raws.push(...rr)
                    } else {
                        cNode.remove();
                    }
                }

                if (drAttr.drForm) {
                    RawSet.drFormOtherMoveAttr(element, 'name', 'temp-name');
                    element.querySelectorAll('[name]').forEach(it => {
                        const eventName = it.getAttribute('dr-form:event') ?? 'change'
                        const attrEventName = eventManager.attrPrefix + 'event-' + eventName;
                        let varpath = it.getAttribute('name');
                        // console.log('--varpath-->', varpath)
                        if (varpath != null) {
                            const data = ScriptUtils.evalReturn(`${drAttr.drForm}${varpath ? '.' + varpath : ''}`, obj);
                            if (data instanceof Validations) {
                                varpath = drAttr.drForm + '.' + varpath;
                                it.setAttribute(attrEventName, `${varpath}.setValue($target, $target.value, $event);`);
                                data.addValue((it as any).value, it);
                            } else if (data instanceof Validation) {
                                const target = drAttr.drForm + '.' + varpath + '.target'
                                const event = drAttr.drForm + '.' + varpath + '.event'
                                varpath += (varpath ? '.value' : 'value');
                                varpath = drAttr.drForm + '.' + varpath;
                                it.setAttribute(attrEventName, `${varpath} = $target.value; ${target}=$target; ${event}=$event;`);
                                data.target = it;
                                data.value = (it as any).value;
                            } else {
                                varpath = drAttr.drForm + '.' + varpath;
                                it.setAttribute(attrEventName, `${varpath} = $target.value;`);
                            }
                        }
                    })
                    RawSet.drFormOtherMoveAttr(element, 'temp-name', 'name');
                    raws.push(...RawSet.checkPointCreates(element, config));
                }

                if (drAttr.drInnerText) {
                    const data = ScriptUtils.evalReturn(drAttr.drInnerText, obj);
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(` 
                        const n = this.__element.cloneNode(true);  
                        ${drAttr.drBeforeOption ?? ''}
                        n.innerText = this.__data;
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }
                        ${drAttr.drAfterOption ?? ''}
                    `, Object.assign({
                        __fag: newTemp,
                        __drStripOption: drAttr.drStripOption,
                        __data: data,
                        __element: element
                    }, obj));
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    const rr = RawSet.checkPointCreates(fag, config);
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr);
                }

                if (drAttr.drInnerHTML) {
                    const data = ScriptUtils.evalReturn(drAttr.drInnerHTML, obj);
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                        const n = this.__element.cloneNode(true);
                        ${drAttr.drBeforeOption ?? ''}
                        n.innerHTML = this.__data;
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }
                        ${drAttr.drAfterOption ?? ''}
                    `, Object.assign({
                        __fag: newTemp,
                        __drStripOption: drAttr.drStripOption,
                        __data: data,
                        __element: element
                    }, obj));
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content);
                    const rr = RawSet.checkPointCreates(fag, config);
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr);
                }

                if (drAttr.drFor) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                    const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${RawSet.RANGE_VARNAME} = this.__render.range;
                    const ${RawSet.ELEMENT_VARNAME} = this.__render.element;
                    ${drAttr.drBeforeOption ?? ''}
                    for(${drAttr.drFor}) {
                        const n = this.__render.element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt))) 
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                    }
                    ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            range: Range.range,
                            fag: newTemp,
                            drStripOption: drAttr.drStripOption,
                            element: element,
                            scripts: RawSet.setBindProperty(config?.scripts, obj)
                        })
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                if (drAttr.drForOf) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                    const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${RawSet.RANGE_VARNAME} = this.__render.range;
                    const ${RawSet.ELEMENT_VARNAME} = this.__render.element;
                    ${drAttr.drBeforeOption ?? ''}
                    var i = 0; 
                    const forOf = ${drAttr.drForOf};
                    const forOfStr = \`${drAttr.drForOf}\`.trim();
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
                        n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))
                        n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                        i++;
                    }
                    ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            rawset: this,
                            range: Range.range,
                            drStripOption: drAttr.drStripOption,
                            fag: newTemp,
                            element: element,
                            scripts: RawSet.setBindProperty(config?.scripts, obj)
                            // eslint-disable-next-line no-use-before-define
                        } as Render)
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                if (drAttr.drRepeat) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                    const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${RawSet.RANGE_VARNAME} = this.__render.range;
                    const ${RawSet.ELEMENT_VARNAME} = this.__render.element;
                    ${drAttr.drBeforeOption ?? ''}
                    var i = 0; 
                    const repeat = ${drAttr.drRepeat};
                    const repeatStr = \`${drAttr.drRepeat}\`;
                    let range = repeat;
                    if (typeof repeat === 'number') {
                        range = ${RawSet.RANGE_VARNAME}(repeat);
                    } 
                    for(const it of range) {
                        var destIt = it;
                        if (range.isRange) {
                            destIt = it;
                        }  else {
                            destIt = repeatStr + '[' + i +']'
                        }
                        const n = this.__render.element.cloneNode(true);
                        n.getAttributeNames().forEach(it => n.setAttribute(it, n.getAttribute(it).replace(/\\#it\\#/g, destIt)))
                        n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                        i++;
                    }
                    ${drAttr.drAfterOption ?? ''}
                    `, Object.assign(obj, {
                        __render: Object.freeze({
                            range: Range.range,
                            fag: newTemp,
                            drStripOption: drAttr.drStripOption,
                            element: element,
                            scripts: RawSet.setBindProperty(config?.scripts, obj)
                        })
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                }

                // config detecting
                config?.targetElements?.forEach(it => {
                    const name = it.name;
                    if (name.toLowerCase() === element.tagName.toLowerCase()) {
                        const documentFragment = it.callBack(element, obj, this);
                        if (documentFragment) {
                            fag.append(documentFragment)
                            const rr = RawSet.checkPointCreates(fag, config)
                            element.parentNode?.replaceChild(fag, element);
                            const onInit = element.getAttribute('dr-on-init-component');
                            if (onInit) {
                                ScriptUtils.evalReturn(onInit, obj)(obj?.__componentInstances[this.uuid], this);
                            }
                            raws.push(...rr);
                            onElementInitCallBack.push({
                                name,
                                obj
                            });
                            it?.complete?.(element, obj, this);
                        }
                    }
                })
                config?.targetAttrs?.forEach(it => {
                    const attrName = it.name;
                    const attrValue = this.getAttributeAndDelete(element, attrName)
                    if (attrValue && attrName) {
                        const documentFragment = it.callBack(element, attrValue, obj, this);
                        if (documentFragment) {
                            fag.append(documentFragment)
                            const rr = RawSet.checkPointCreates(fag, config)
                            element.parentNode?.replaceChild(fag, element);
                            raws.push(...rr);
                            onAttrInitCallBack.push({
                                attrName,
                                attrValue,
                                obj
                            });
                            it?.complete?.(element, attrValue, obj, this);
                        }
                    }
                })
            }
        })

        this.applyEvent(obj, genNode, config);
        this.replaceBody(genNode);
        drAttrs.forEach(it => {
            if (it.drCompleteOption) {
                // genNode.childNodes
                ScriptUtils.eval(`
                const ${RawSet.FAG_VARNAME} = this.__render.fag;
                const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                const ${RawSet.RAWSET_VARNAME} = this.__render.rawset;
                ${it.drCompleteOption}
                `, Object.assign(obj, {
                    __render: Object.freeze({
                        rawset: this,
                        fag: genNode,
                        scripts: RawSet.setBindProperty(config?.scripts, obj)
                        // eslint-disable-next-line no-use-before-define
                    } as Render)
                }
                ));
            }
        })
        onElementInitCallBack.forEach(it => config?.onElementInit?.(it.name, obj, this))
        onAttrInitCallBack.forEach(it => config?.onAttrInit?.(it.attrName, it.attrValue, obj, this))
        return raws;
    }

    public applyEvent(obj: any, fragment = this.fragment, config?: Config) {
        eventManager.applyEvent(obj, eventManager.findAttrElements(fragment, config), config)
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

    public static checkPointCreates(element: Node, config?: Config): RawSet[] {
        const nodeIterator = document.createNodeIterator(element, NodeFilter.SHOW_ALL, {
            acceptNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return /\$\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    const isElement = (config?.targetElements?.map(it => it.name.toLowerCase()) ?? []).includes(element.tagName.toLowerCase());
                    const targetAttrNames = (config?.targetAttrs?.map(it => it.name) ?? []).concat(RawSet.DR_ATTRIBUTES);
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
                const template = document.createElement('template');
                const a = StringUtils.regexExec(/\$\{.*?\}/g, text);
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
                    const start = document.createComment(`start text ${it.uuid}`);
                    const end = document.createComment(`end text ${it.uuid}`);
                    // layout setting
                    template.content.append(document.createTextNode(preparedText));
                    template.content.append(start);
                    template.content.append(end);

                    // content
                    const fragment = document.createDocumentFragment();
                    fragment.append(document.createTextNode(it.content))
                    pars.push(new RawSet(it.uuid, {
                        start,
                        end
                    }, fragment))

                    lasterIndex = regexArr.index + it.content.length;
                })
                template.content.append(document.createTextNode(text.substring(lasterIndex, text.length)));
                currentNode?.parentNode?.replaceChild(template.content, currentNode);
            } else {
                const uuid = RandomUtils.uuid()
                const fragment = document.createDocumentFragment();
                const start = document.createComment(`start ${uuid}`)
                const end = document.createComment(`end ${uuid}`)
                currentNode?.parentNode?.insertBefore(start, currentNode);
                currentNode?.parentNode?.insertBefore(end, currentNode.nextSibling);
                fragment.append(currentNode);
                pars.push(new RawSet(uuid, {
                    start,
                    end
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

    public static drThisEncoding(element: Element, drThis: string) {
        const thisRandom = RandomUtils.uuid()
        // const thisRegex = /(?<!(dr-|\.))this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this\./g;
        // safari 때문에 전위 검색 regex가 안됨 아 짜증나서 이걸로함.
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
        element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(RegExp(thisRandom, 'g'), 'this');
        });
    }

    public static drFormOtherMoveAttr(element: Element, as: string, to: string) {
        element.querySelectorAll(`[${RawSet.DR_FORM_NAME}]`).forEach(subElement => {
            const nodeIterator = document.createNodeIterator(subElement, NodeFilter.SHOW_ELEMENT, {
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
            return {
                name: s[0],
                value: s[1],
                // regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
                regex: RegExp('\\$var\\.' + s[0] + '(?=.?)', 'g'),
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

    public static drThisCreate(element: Element, drThis: string, drVarOption: string, drStripOption: boolean, obj: any) {
        const fag = document.createDocumentFragment();
        const n = element.cloneNode(true) as Element;
        const thisRandom = this.drThisEncoding(n, drThis)
        const vars = this.drVarEncoding(n, drVarOption)
        this.drVarDecoding(n, vars)
        this.drThisDecoding(n, thisRandom);
        if (drStripOption) {
            Array.from(n.childNodes).forEach(it => fag.append(it));
        } else {
            fag.append(n)
        }
        return fag;
    }

    public static setBindProperty(scripts: { [p: string]: any } | undefined, obj: any): { [p: string]: any } | undefined {
        if (scripts) {
            // const newScripts = Object.assign({}, scripts)
            const newScripts = Object.assign({}, scripts)
            for (const [key, value] of Object.entries(newScripts)) {
                if (typeof value === 'function') {
                    newScripts[key] = value.bind(obj);
                }
            }
            return newScripts;
        }
    }

    public static createComponentTargetElement(name: string, objFactory: (element: Element, obj: any, rawSet: RawSet) => any, template: string = '', styles: string[] = [], scripts?: { [n: string]: any }): TargetElement {
        const targetElement: TargetElement = {
            name,
            styles,
            template,
            callBack(element: Element, obj: any, rawSet: RawSet): DocumentFragment {
                // console.log('callback------->')
                if (!obj.__domrender_components) {
                    obj.__domrender_components = {};
                }
                ;
                const domrenderComponents = obj.__domrender_components;
                const componentKey = '_' + RandomUtils.getRandomString(20)
                // console.log('callback settttt---a-->')
                domrenderComponents[componentKey] = objFactory(element, obj, rawSet);
                const instance = domrenderComponents[componentKey];
                // console.log('callback settttt---b-->', obj.__domrender_components, instance)

                const oninit = element.getAttribute('dr-on-init')
                if (oninit) {
                    // console.log('onInit------->')
                    const attribute = {} as any;
                    element.getAttributeNames().forEach(it => {
                        attribute[it] = element.getAttribute(it);
                    });
                    const script = `var $component = this.__render.component; var $element = this.__render.$element; var $innerHTML = this.__render.$innerHTML; var $attribute = this.__render.$attribute;  ${oninit} `;
                    ScriptUtils.eval(script, Object.assign(obj, {
                        __render: Object.freeze({
                            component: instance,
                            element: element,
                            innerHTML: element.innerHTML,
                            attribute: attribute,
                            rawset: rawSet,
                            scripts: RawSet.setBindProperty(scripts, obj)
                            // eslint-disable-next-line no-use-before-define
                        } as Render
                        )
                    }))
                }
                const fag = document.createDocumentFragment();
                const innerHTML = (styles?.map(it => `<style>${it}</style>`) ?? []).join(' ') + (template ?? '');
                element.innerHTML = innerHTML;
                fag.append(RawSet.drThisCreate(element, `this.__domrender_components.${componentKey}`, '', true, obj))
                return fag;
            }
        }
        return targetElement;
    }
}

export type Render = {
    rawset: RawSet;
    scripts: { [n: string]: any };
    [n: string]: any
}
