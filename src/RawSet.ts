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
    public static readonly DR_ATTRIBUTES = [RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_FOR_NAME, RawSet.DR_THIS_NAME, RawSet.DR];

    constructor(public point: { start: Comment, end: Comment }, public fragment: DocumentFragment) { // , public thisObjPath?: string
    }

    get isConnected() {
        return this.point.start.isConnected && this.point.end.isConnected;
    }

    getUsingTriggerVariables(config?: Config): Set<string> {
        const usingTriggerVariables = new Set<string>();
        this.fragment.childNodes.forEach((cNode, key) => {
            if (cNode.nodeType === Node.TEXT_NODE) {
                ScriptUtils.getVariablePaths(`\`${(cNode as Text).textContent ?? ''}\``).forEach(it => usingTriggerVariables.add(it));
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                const targetAttrNames = (config?.targets?.map(it => it.attrName) ?? []).concat(RawSet.DR_ATTRIBUTES)
                ScriptUtils.getVariablePaths(targetAttrNames.map(it => (element.getAttribute(it))).filter(it => it).join(';')).forEach(it => usingTriggerVariables.add(it));
            }
        })
        return usingTriggerVariables;
    }

    public render(obj: any, config?: Config): RawSet[] {
        const genNode = document.importNode(this.fragment, true);
        const raws: RawSet[] = [];
        genNode.childNodes.forEach((cNode, key) => {
            const fag = document.createDocumentFragment()
            if (cNode.nodeType === Node.TEXT_NODE) {
                const textContent = cNode.textContent;
                // console.log('---log--->', obj, obj?._DomRender_origin??  obj)
                const n = document.createTextNode(ScriptUtils.eval(`return \`${textContent}\``, obj))
                // const n = document.createTextNode(ScriptUtils.eval(`return \`${textContent}\``, obj?._DomRender_origin ?? obj))
                // console.log('------>', n)
                cNode.parentNode?.replaceChild(n, cNode)
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                const drAttr = {
                    dr: this.getAttributeAndDelete(element, RawSet.DR),
                    drIf: this.getAttributeAndDelete(element, RawSet.DR_IF_NAME),
                    drFor: this.getAttributeAndDelete(element, RawSet.DR_FOR_NAME),
                    drForOf: this.getAttributeAndDelete(element, RawSet.DR_FOR_OF_NAME),
                    drThis: this.getAttributeAndDelete(element, RawSet.DR_THIS_NAME),
                    drItOption: this.getAttributeAndDelete(element, RawSet.DR_IT_OPTIONNAME),
                    drVarOption: this.getAttributeAndDelete(element, RawSet.DR_VAR_OPTIONNAME),
                    drStripOption: this.getAttributeAndDelete(element, RawSet.DR_STRIP_OPTIONNAME) === 'true'
                }
                if (drAttr.dr !== null && drAttr.dr.length >= 0) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                        const n = this.__element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }`, Object.assign({
                        __fag: newTemp, __drStripOption: drAttr.drStripOption, __element: element
                    }, obj));
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
                    if(${drAttr.drIf}) {
                        const n = this.__element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }
                    }`, Object.assign({
                        __fag: newTemp, __drStripOption: drAttr.drStripOption, __element: element
                    }, obj));
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
                if (drAttr.drFor) {
                    const itRandom = RawSet.drItOtherEncoding(element);
                    const vars = RawSet.drVarEncoding(element, drAttr.drVarOption ?? '');
                    const newTemp = document.createElement('temp');
                    ScriptUtils.eval(`
                    for(${drAttr.drFor}) {
                        const n = this.__element.cloneNode(true);
                        var destIt = ${drAttr.drItOption};
                        if (destIt !== undefined) {
                            n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        }
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }
                    }`, Object.assign({
                        __fag: newTemp, __drStripOption: drAttr.drStripOption, __element: element
                    }, obj));
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
                    ScriptUtils.eval(`var i = 0; for(const it of ${drAttr.drForOf}) {
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
                        
                        const n = this.__element.cloneNode(true);
                        n.innerHTML = n.innerHTML.replace(/\\#it\\#/g, destIt);
                        
                        if (this.__drStripOption) {
                            Array.from(n.childNodes).forEach(it => this.__fag.append(it));
                        } else {
                            this.__fag.append(n);
                        }
                        i++;
                    }`, Object.assign({
                        __drStripOption: drAttr.drStripOption,
                        __fag: newTemp,
                        __element: element
                    }, obj));
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
                config?.targets?.forEach(it => {
                    const attrValue = this.getAttributeAndDelete(element, it.attrName)
                    if (attrValue) {
                        const documentFragment = it.callBack(element, attrValue, obj);
                        if (documentFragment) {
                            fag.append(documentFragment)
                            const rr = RawSet.checkPointCreates(fag, config)
                            element.parentNode?.replaceChild(fag, element);
                            raws.push(...rr);
                            it?.complete?.(element, attrValue, obj);
                        }
                    }
                })
            }
        })

        this.applyEvent(obj, genNode, config);
        this.replaceBody(genNode);
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
                // console.log('node type-->', node.nodeType)
                if (node.nodeType === Node.TEXT_NODE) {
                    return /\$\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    // const targetTagNames = (config?.targets?.map(it => it.tagName) ?? []).concat(RawSet.DR_TAGS);
                    const targetAttrNames = (config?.targets?.map(it => it.attrName) ?? []).concat(RawSet.DR_ATTRIBUTES);
                    const isAttr = element.getAttributeNames().filter(it => targetAttrNames.includes(it.toLowerCase())).length > 0;
                    // const isTag = targetTagNames.includes(element.tagName.toLowerCase()); // || isTag
                    // console.log('--->', element, element.getAttributeNames(), targetAttrNames)
                    return (isAttr) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });
        const pars: RawSet[] = [];
        let currentNode;
        // eslint-disable-next-line no-cond-assign
        while (currentNode = nodeIterator.nextNode()) {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                let text = (currentNode as Text).textContent ?? '';
                const template = document.createElement('template');
                const a = StringUtils.regexExec(/\$\{.*?\}/g, text);
                const map = a.reverse().map(it => { return {uuid: '', content: '', regexArr: it} });
                map.forEach(it => {
                    const uuid = RandomUtils.uuid()
                    it.uuid = uuid
                    it.content = it.regexArr[0]
                    text = text.substr(0, it.regexArr.index) + text.substr(it.regexArr.index).replace(it.regexArr[0], `<!--start text ${uuid}--><!--end text ${uuid}-->`);
                })
                template.innerHTML = text;

                map.forEach(it => {
                    const subNodeIterator = document.createNodeIterator(template.content, NodeFilter.SHOW_COMMENT, {
                        acceptNode(node) {
                            const text = (node as Text).textContent;
                            return (text === `start text ${it.uuid}` || text === `end text ${it.uuid}`) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                        }
                    })
                    let start: Comment | undefined;
                    let end: Comment | undefined;
                    let subNode;
                    // eslint-disable-next-line no-cond-assign
                    while (subNode = subNodeIterator.nextNode()) {
                        if ((subNode.textContent ?? '').startsWith('start')) {
                            start = subNode as Comment;
                        }
                        if ((subNode.textContent ?? '').startsWith('end')) {
                            end = subNode as Comment;
                        }
                    }
                    if (start && end) {
                        const fragment = document.createDocumentFragment();
                        fragment.append(document.createTextNode(it.content))
                        pars.push(new RawSet({
                            start,
                            end
                        }, fragment))
                    }
                })
                currentNode?.parentNode?.replaceChild(template.content, currentNode);
            } else {
                const uuid = RandomUtils.uuid()
                const fragment = document.createDocumentFragment();
                const start = document.createComment(`start ${uuid}`)
                const end = document.createComment(`end ${uuid}`)
                currentNode?.parentNode?.insertBefore(start, currentNode);
                currentNode?.parentNode?.insertBefore(end, currentNode.nextSibling);
                fragment.append(currentNode);
                pars.push(new RawSet({
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
        element.querySelectorAll(`[${RawSet.DR_IT_OPTIONNAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(regex, random);
        });
        return random;
    }

    public static drItOtherDecoding(element: Element | DocumentFragment, random: string) {
        element.querySelectorAll(`[${RawSet.DR_IT_OPTIONNAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(RegExp(random, 'g'), '#it#');
        });
    }

    public static drDVarEncoding(element: Element, drVarOption: string) {
        const vars = (drVarOption?.split(',') ?? []).map(it => {
            const s = it.trim().split('=');
            return {
                name: s[0],
                value: s[1],
                regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
                random: RandomUtils.uuid()
            }
        })
        element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
            vars.filter(vit => vit.value && vit.name).forEach(vit => {
                it.innerHTML = it.innerHTML.replace(vit.regex, vit.random);
            })
        });
        vars.filter(vit => vit.value && vit.name).forEach(vit => {
            element.innerHTML = element.innerHTML.replace(vit.regex, vit.value);
        })
        return vars;
    }

    public static drDVarDecoding(element: Element, vars: { name: string, value: string, regex: RegExp, random: string }[]) {
        element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
            vars.filter(vit => vit.value && vit.name).forEach(vit => {
                it.innerHTML = it.innerHTML.replace(RegExp(vit.random, 'g'), vit.value);
            })
        });
    }

    public static drThisEncoding(element: Element, drThis: string) {
        const thisRandom = RandomUtils.uuid()
        const thisRegex = /(?<!(dr-|\.))this(?=.?)/g;
        element.querySelectorAll(`[${RawSet.DR_THIS_NAME}]`).forEach(it => {
            it.innerHTML = it.innerHTML.replace(thisRegex, thisRandom);
        })
        element.innerHTML = element.innerHTML.replace(thisRegex, drThis);
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
                regex: RegExp('(?<!(dr-|\\.))var\\.' + s[0] + '(?=.?)', 'g'),
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
}
