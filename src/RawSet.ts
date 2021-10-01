import {RandomUtils} from './utils/random/RandomUtils';
import {StringUtils} from './utils/string/StringUtils';
import {ScriptUtils} from './utils/script/ScriptUtils';
import {eventManager} from './events/EventManager';
import {Config} from './Config';

export class RawSet {
    public static readonly DR = 'dr';
    public static readonly DR_IF_NAME = 'dr-if';
    public static readonly DR_FOR_OF_NAME = 'dr-for-of';
    public static readonly DR_FOR_NAME = 'dr-for';
    public static readonly DR_THIS_NAME = 'dr-this';
    public static readonly DR_INNERHTML_NAME = 'dr-inner-html';
    public static readonly DR_INNERTEXT_NAME = 'dr-inner-text';
    // public static readonly DR_INCLUDE_NAME = 'dr-include';
    // public static readonly DR_REPLACE_NAME = 'dr-replace';
    // public static readonly DR_STATEMENT_NAME = 'dr-statement';

    // public static readonly DR_SCRIPT_ELEMENTNAME = 'dr-script';
    public static readonly DR_TAGS = [];// RawSet.DR_SCRIPT_ELEMENTNAME

    public static readonly DR_IT_OPTIONNAME = 'dr-it';
    // public static readonly DR_SUPER_OPTIONNAME = 'dr-super';
    // public static readonly DR_DECLARATION_OPTIONNAME = 'dr-declaration';
    public static readonly DR_VAR_OPTIONNAME = 'dr-var';
    public static readonly DR_STRIP_OPTIONNAME = 'dr-strip';
    // public static readonly DR_PARAMETER_OPTIONNAME = 'dr-parameter';
    // public static readonly DR_THIS_OPTIONNAME = 'dr-this';
    // public static readonly DR_CONTENT_OPTIONNAME = 'dr-content';
    public static readonly DR_ATTRIBUTES = [RawSet.DR, RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_FOR_NAME, RawSet.DR_THIS_NAME, RawSet.DR_INNERHTML_NAME, RawSet.DR_INNERTEXT_NAME];

    public static readonly SCRIPTS_VARNAME = '$scripts';
    public static readonly RAWSET_VARNAME = '$rawset';

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
                script = script.replace(RegExp(RawSet.SCRIPTS_VARNAME.replace('$', '\\$'), 'g'), `this?.___${RawSet.SCRIPTS_VARNAME}`); // .replace(/(\$scripts)/g, 'this?.___$1');
                script = script.replace(RegExp(RawSet.RAWSET_VARNAME.replace('$', '\\$'), 'g'), `this?.___${RawSet.RAWSET_VARNAME}`); // .replace(/(\$scripts)/g, 'this?.___$1');
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
                            scripts: this.setBindProperty(config?.scripts, obj)
                        })
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
                    drThis: this.getAttributeAndDelete(element, RawSet.DR_THIS_NAME),
                    drInnerHTML: this.getAttributeAndDelete(element, RawSet.DR_INNERHTML_NAME),
                    drInnerText: this.getAttributeAndDelete(element, RawSet.DR_INNERTEXT_NAME),
                    drItOption: this.getAttributeAndDelete(element, RawSet.DR_IT_OPTIONNAME),
                    drVarOption: this.getAttributeAndDelete(element, RawSet.DR_VAR_OPTIONNAME),
                    drStripOption: this.getAttributeAndDelete(element, RawSet.DR_STRIP_OPTIONNAME) === 'true'
                }
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
                            scripts: this.setBindProperty(config?.scripts, obj)
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

                if (drAttr.drIf) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                    const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${RawSet.RAWSET_VARNAME} = this.__render.rawset;
                    if(${drAttr.drIf}) {
                        const n = this.__render.element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                    }`, Object.assign(obj,
                        {
                            __render: Object.freeze({
                                fag: newTemp,
                                drStripOption: drAttr.drStripOption,
                                element: element,
                                rawset: this,
                                scripts: this.setBindProperty(config?.scripts, obj)
                            })
                        }
                    ));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    // console.log('----->if', rr, Array.from(fag.childNodes))
                    element.parentNode?.replaceChild(fag, element);
                    raws.push(...rr)
                    // console.log('----->if', raws, rr)
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

                if (drAttr.drInnerText) {
                    const data = ScriptUtils.evalReturn(drAttr.drInnerText, obj);
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                        const n = this.__element.cloneNode(true);
                        n.innerText = this.__data;
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }
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
                        n.innerHTML = this.__data;
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }
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
                    for(${drAttr.drFor}) {
                        const n = this.__render.element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                    }`, Object.assign(obj, {
                        __render: Object.freeze({
                            fag: newTemp,
                            drStripOption: drAttr.drStripOption,
                            element: element,
                            scripts: this.setBindProperty(config?.scripts, obj)
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
                    // console.log('vars-->', vars, element.innerHTML)
                    ScriptUtils.eval(`
                    const ${RawSet.SCRIPTS_VARNAME} = this.__render.scripts;
                    var i = 0; 
                    for(const it of ${drAttr.drForOf}) {
                        var destIt = it;
                        var forOfStr = \`${drAttr.drForOf}\`;
                        if (/,/g.test(forOfStr)) {
                            if (typeof it === 'string') {
                                destIt = it;
                            } else {
                                destIt = forOfStr.substring(1, forOfStr.length-1).split(',')[i];
                            }
                        } else {
                            destIt = forOfStr + '[' + i +']'
                        }
                        
                        const n = this.__render.element.cloneNode(true);
                        n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        
                        if (this.__render.drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__render.fag.append(it));
                        } else {
                            this.__render.fag.append(n);
                        }
                        i++;
                    }`, Object.assign(obj, {
                        __render: Object.freeze({
                            drStripOption: drAttr.drStripOption,
                            fag: newTemp,
                            element: element,
                            scripts: this.setBindProperty(config?.scripts, obj)
                        })
                    }));
                    RawSet.drVarDecoding(newTemp, vars);
                    RawSet.drItOtherDecoding(newTemp, itRandom);
                    const tempalte = document.createElement('template');
                    tempalte.innerHTML = newTemp.innerHTML;
                    fag.append(tempalte.content)
                    const rr = RawSet.checkPointCreates(fag, config)
                    // console.log(Array.from(fag.childNodes))
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
                    // console.log('element filter-->', isElement, element.tagName)
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
        element.querySelectorAll(`[${RawSet.DR_IT_OPTIONNAME}], [${RawSet.DR_FOR_OF_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(regex, random);
        });
        return random;
    }

    public static drItOtherDecoding(element: Element | DocumentFragment, random: string) {
        element.querySelectorAll(`[${RawSet.DR_IT_OPTIONNAME}], [${RawSet.DR_FOR_OF_NAME}]`).forEach(it => {
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
        // console.log('--->', element.innerHTML, drThis)
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

    public static drVarEncoding(element: Element, drVarOption: string) {
        const vars = (drVarOption?.split(',') ?? []).map(it => {
            const s = it.trim().split('=');
            return {
                name: s[0],
                value: s[1],
                // regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
                regex: RegExp('var\\.' + s[0] + '(?=.?)', 'g'),
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

    private setBindProperty(scripts: { [p: string]: any } | undefined, obj: any): { [p: string]: any } | undefined {
        if (scripts) {
            // const newScripts = Object.assign({}, scripts)
            const newScripts = Object.assign({}, scripts)
            for (const [key, value] of Object.entries(newScripts)) {
                // console.log(typeof value, value, value.bind(obj))
                if (typeof value === 'function') {
                    newScripts[key] = value.bind(obj);
                }
            }
            // console.log('setBind-->', newScripts, obj)
            return newScripts;
        }
    }
}
