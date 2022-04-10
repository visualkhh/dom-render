import {RandomUtils} from './utils/random/RandomUtils';
import {StringUtils} from './utils/string/StringUtils';
import {ScriptUtils} from './utils/script/ScriptUtils';
import {EventManager, eventManager} from './events/EventManager';
import {Config, TargetAttr, TargetElement} from './Config';
import {Range} from './iterators/Range';
import {Validator} from './validators/Validator';
import {ValidatorArray} from './validators/ValidatorArray';
import {DomRenderFinalProxy} from './types/Types';
import {DomUtils} from './utils/dom/DomUtils';
import {ComponentSet} from './components/ComponentSet';
import {DrPre} from './operators/DrPre';
import {Dr} from './operators/Dr';
import {DrIf} from './operators/DrIf';
import {ExecuteState} from './operators/OperatorRender';
import {DrThis} from './operators/DrThis';
import {DrForm} from './operators/DrForm';
import {DrInnerText} from './operators/DrInnerText';
import {DrInnerHTML} from './operators/DrInnerHTML';
import {DrFor} from './operators/DrFor';
import {DrForOf} from './operators/DrForOf';
import {DrAppender} from './operators/DrAppender';
import {DrRepeat} from './operators/DrRepeat';
import {DrTargetElement} from './operators/DrTargetElement';
import {DrTargetAttr} from './operators/DrTargetAttr';
export enum DestroyOptionType {
    NO_DESTROY = 'NO_DESTROY',
    NO_MESSENGER_DESTROY = 'NO_MESSENGER_DESTROY'
}
export type Attrs = {
    dr: string | null;
    drIf: string | null;
    drAppender: string | null;
    drFor: string | null;
    drForOf: string | null;
    drRepeat: string | null;
    drThis: string | null;
    drForm: string | null;
    drPre: string | null;
    drInnerHTML: string | null;
    drInnerText: string | null;
    drItOption: string | null;
    drVarOption: string | null;
    drAfterOption: string | null;
    drNextOption: string | null;
    drBeforeOption: string | null;
    drCompleteOption: string | null;
    drStripOption: string | null;
    drDestroyOption: string | null;
}
export type CreatorMetaData = {
    thisVariableName?: string | null;
    thisFullVariableName?: string | null;
    componentKey?: string | null;
    rawSet: RawSet;
    innerHTML: string;
    drAttrs?: Attrs;
    rootCreator: any;
    attribute: any;
    creator: any;
    // render?: Render;
}
export type AttrInitCallBack = { attrName: string, attrValue: string, obj: any };
export type ElementInitCallBack = { name: string, obj: any, targetElement: TargetElement, creatorMetaData: CreatorMetaData };

export type Render = {
    rawset?: RawSet;
    scripts?: { [n: string]: any };
    bindScript?: string;
    element?: any;
    attribute?: any;
    creatorMetaData?: CreatorMetaData;
    router?: any;
    range?: any;
    value?: any;
    [n: string]: any;
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
    public static readonly DR_APPENDER_NAME = 'dr-appender';
    public static readonly DR_INNERHTML_NAME = 'dr-inner-html';
    public static readonly DR_INNERTEXT_NAME = 'dr-inner-text';
    public static readonly DR_DETECT_NAME = 'dr-detect';

    // public static readonly DR_DETECT_ACTION_NAME = 'dr-detect-action';

    public static readonly DR_IT_OPTIONNAME = 'dr-it';
    public static readonly DR_VAR_OPTIONNAME = 'dr-var';
    public static readonly DR_AFTER_OPTIONNAME = 'dr-after';
    public static readonly DR_NEXT_OPTIONNAME = 'dr-next';
    public static readonly DR_BEFORE_OPTIONNAME = 'dr-before';
    public static readonly DR_COMPLETE_OPTIONNAME = 'dr-complete';
    public static readonly DR_STRIP_OPTIONNAME = 'dr-strip';
    public static readonly DR_DESTROY_OPTIONNAME = 'dr-destroy';

    public static readonly drAttrsOriginName: Attrs = {
        dr: RawSet.DR,
        drIf: RawSet.DR_IF_NAME,
        drFor: RawSet.DR_FOR_NAME,
        drForOf: RawSet.DR_FOR_OF_NAME,
        drAppender: RawSet.DR_APPENDER_NAME,
        drRepeat: RawSet.DR_REPEAT_NAME,
        drThis: RawSet.DR_THIS_NAME,
        drForm: RawSet.DR_FORM_NAME,
        drPre: RawSet.DR_PRE_NAME,
        drInnerHTML: RawSet.DR_INNERHTML_NAME,
        drInnerText: RawSet.DR_INNERTEXT_NAME,
        drItOption: RawSet.DR_IT_OPTIONNAME,
        drVarOption: RawSet.DR_VAR_OPTIONNAME,
        drAfterOption: RawSet.DR_AFTER_OPTIONNAME,
        drNextOption: RawSet.DR_NEXT_OPTIONNAME,
        drBeforeOption: RawSet.DR_BEFORE_OPTIONNAME,
        drCompleteOption: RawSet.DR_COMPLETE_OPTIONNAME,
        drStripOption: RawSet.DR_STRIP_OPTIONNAME,
        drDestroyOption: RawSet.DR_DESTROY_OPTIONNAME
    };

    public static readonly DR_TAGS = [];

    public static readonly DR_ATTRIBUTES = [RawSet.DR, RawSet.DR_APPENDER_NAME, RawSet.DR_IF_NAME, RawSet.DR_FOR_OF_NAME, RawSet.DR_FOR_NAME, RawSet.DR_THIS_NAME, RawSet.DR_FORM_NAME, RawSet.DR_PRE_NAME, RawSet.DR_INNERHTML_NAME, RawSet.DR_INNERTEXT_NAME, RawSet.DR_REPEAT_NAME, RawSet.DR_DETECT_NAME];

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
                    // console.log('scripts-->', script)
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
        const onAttrInitCallBacks: AttrInitCallBack[] = [];
        const onElementInitCallBacks: ElementInitCallBack[] = [];
        const onThisComponentSetCallBacks: ComponentSet[] = [];
        const drAttrs: Attrs[] = [];

        for (const cNode of Array.from(genNode.childNodes.values())) {
            let attribute = {};
            if (cNode.nodeType === Node.ELEMENT_NODE) {
                attribute = DomUtils.getAttributeToObject(cNode as Element);
            }
            const __render = Object.freeze({
                rawset: this,
                scripts: EventManager.setBindProperty(config?.scripts, obj),
                router: config?.router,
                range: Range.range,
                element: cNode,
                attribute: attribute,
                bindScript: `
                    const ${EventManager.SCRIPTS_VARNAME} = this.__render.scripts;
                    const ${EventManager.RAWSET_VARNAME} = this.__render.rawset;
                    const ${EventManager.ELEMENT_VARNAME} = this.__render.element;
                    const ${EventManager.ATTRIBUTE_VARNAME} = this.__render.attribute;
                    const ${EventManager.RANGE_VARNAME} = this.__render.range;
                    const ${EventManager.ROUTER_VARNAME} = this.__render.router;
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
                    drAppender: this.getAttributeAndDelete(element, RawSet.DR_APPENDER_NAME),
                    drRepeat: this.getAttributeAndDelete(element, RawSet.DR_REPEAT_NAME),
                    drThis: this.getAttributeAndDelete(element, RawSet.DR_THIS_NAME),
                    drForm: this.getAttributeAndDelete(element, RawSet.DR_FORM_NAME),
                    drPre: this.getAttributeAndDelete(element, RawSet.DR_PRE_NAME),
                    drInnerHTML: this.getAttributeAndDelete(element, RawSet.DR_INNERHTML_NAME),
                    drInnerText: this.getAttributeAndDelete(element, RawSet.DR_INNERTEXT_NAME),
                    drItOption: this.getAttributeAndDelete(element, RawSet.DR_IT_OPTIONNAME),
                    drVarOption: this.getAttributeAndDelete(element, RawSet.DR_VAR_OPTIONNAME),
                    drNextOption: this.getAttributeAndDelete(element, RawSet.DR_NEXT_OPTIONNAME),
                    drAfterOption: this.getAttributeAndDelete(element, RawSet.DR_AFTER_OPTIONNAME),
                    drBeforeOption: this.getAttributeAndDelete(element, RawSet.DR_BEFORE_OPTIONNAME),
                    drCompleteOption: this.getAttributeAndDelete(element, RawSet.DR_COMPLETE_OPTIONNAME),
                    drStripOption: this.getAttributeAndDelete(element, RawSet.DR_STRIP_OPTIONNAME),
                    drDestroyOption: this.getAttributeAndDelete(element, RawSet.DR_DESTROY_OPTIONNAME)
                } as Attrs;
                drAttrs.push(drAttr);
                const operators = [
                    new DrPre(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new Dr(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrIf(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrThis(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrForm(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrInnerText(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrInnerHTML(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrFor(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrForOf(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrAppender(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrRepeat(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrTargetElement(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks}),
                    new DrTargetAttr(this, __render, {raws, fag}, {element, attrs: drAttr}, {config, obj}, {onAttrInitCallBacks, onElementInitCallBacks, onThisComponentSetCallBacks})
                ]

                for (const operator of operators) {
                    const state = operator.execRender();
                    if (state === ExecuteState.EXECUTE) {
                        break;
                    } else if (state === ExecuteState.STOP) {
                        return raws;
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
        for (const it of onThisComponentSetCallBacks) {
            it.obj.onInitRender?.();
        }
        for (const it of onElementInitCallBacks) {
            it.targetElement?.__render?.component?.onInitRender?.(Object.freeze({render: it.targetElement?.__render, creatorMetaData: it.targetElement?.__creatorMetaData}));
            config?.onElementInit?.(it.name, obj, this, it.targetElement);
        }
        for (const it of onAttrInitCallBacks) {
            config?.onAttrInit?.(it.attrName, it.attrValue, obj, this);
        }
        // component destroy
        if (obj.__domrender_components) {
            Object.entries(obj.__domrender_components).forEach(([key, value]) => {
                const domrenderComponentNew = (value as any).__domrender_component_new as CreatorMetaData;
                const rawSet: RawSet | undefined = domrenderComponentNew?.rawSet;
                const drAttrs: Attrs | undefined = domrenderComponentNew?.drAttrs;
                if (rawSet && !rawSet.isConnected) {
                    let domrenderComponent = obj.__domrender_components[key];
                    console.log('component destroy--->', key, rawSet, rawSet.isConnected, domrenderComponent.name, domrenderComponent);
                    const destroyOptions = drAttrs?.drDestroyOption?.split(',') ?? [];
                    RawSet.destroy(obj.__domrender_components[key], [domrenderComponentNew], config, destroyOptions)
                    delete obj.__domrender_components[key];
                }
            })
        }
        return raws;
    }

    public applyEvent(obj: any, fragment = this.fragment, config?: Config) {
        eventManager.applyEvent(obj, eventManager.findAttrElements(fragment, config), config)
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

    public getDrAppendAttributeAndDelete(element: Element, obj: any) {
        let data = element.getAttribute(RawSet.DR_APPENDER_NAME);
        // if (data && !/\[[0-9]+\]/g.test(data)) {
        if (data && !/\[.+\]/g.test(data)) {
            const currentIndex = ScriptUtils.evalReturn(`${data}?.length -1`, obj);
            // console.log('------?', currentIndex)
            // if (currentIndex === undefined || isNaN(currentIndex)) {
            //     return undefined;
            // }
            // const currentIndex = ScriptUtils.evalReturn(`${data}.length`, obj);
            data = `${data}[${currentIndex}]`;
            element.setAttribute(RawSet.DR_APPENDER_NAME, data)
            // element.setAttribute(RawSet.DR_IF_NAME, data);
            // element.setAttribute('dr-id', data);
            // console.log('-->', element)
        }

        // if (data && !/\.childs\[[0-9]+\]/g.test(data)) {
        //     const currentIndex = ScriptUtils.evalReturn(`${data}.currentIndex`, obj);
        //     data = `${data}.childs[${currentIndex}]`;
        //     element.setAttribute(RawSet.DR_APPENDER_NAME, data)
        // }
        element.removeAttribute(RawSet.DR_APPENDER_NAME);
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

    public static drThisEncoding(element: Element, drThis: string): string {
        const thisRandom = RandomUtils.uuid()
        // const thisRegex = /(?<!(dr-|\.))this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this(?=.?)/g;
        // const thisRegex = /[^(dr\-)]this\./g;
        // safari 때문에 전위 검색 regex가 안됨 아 짜증나서 이걸로함.
        // element.querySelectorAll(`[${RawSet.DR_PRE_NAME}]`).forEach(it => {
        //     let message = it.innerHTML;
        // })
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

    public static drThisCreate(element: Element, drThis: string, drVarOption: string, drStripOption: boolean | string | null, obj: any, config: Config, set?: ComponentSet) {
        const fag = config.window.document.createDocumentFragment();
        const n = element.cloneNode(true) as Element;
        if (set) {
            const id = RandomUtils.getRandomString(20);
            n.innerHTML = RawSet.styleTransformLocal(set.styles ?? [], id) + (set.template ?? '');
            // dr-on-create onCreateRender
            const onCreate = element.getAttribute(`${EventManager.attrPrefix}on-create`)
            const renderScript = '';
            let createParam = [];
            if (onCreate) {
                const script = `${renderScript} return ${onCreate} `;
                createParam = ScriptUtils.eval(script, obj);
                if (!Array.isArray(createParam)) {
                    createParam = [createParam];
                }
            }
            set.obj?.onCreateRender?.(...createParam);

            // dr-on-component-init
            const oninit = element.getAttribute(`${EventManager.attrPrefix}on-component-init`); // dr-on-component-init
            if (oninit) {
                const script = `${renderScript}  ${oninit} `;
                ScriptUtils.eval(script, obj);
            }
        }
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
        objFactory: (element: Element, obj: any, rawSet: RawSet, counstructorParam: any[]) => any,
        template: string = '',
        styles: string[] = [],
        config: Config
    ): TargetElement {
        const targetElement: TargetElement = {
            name,
            styles,
            template,
            callBack(element: Element, obj: any, rawSet: RawSet, attrs?: Attrs): DocumentFragment {
                // console.log('callback------->')
                if (!obj.__domrender_components) {
                    obj.__domrender_components = {};
                }
                const domrenderComponents = obj.__domrender_components;
                const componentKey = '_' + RandomUtils.getRandomString(20);
                const attribute = DomUtils.getAttributeToObject(element);
                const renderScript = 'var $component = this.__render.component; var $element = this.__render.element; var $router = this.__render.router; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute; var $creatorMetaData = this.__render.creatorMetaData;';
                let render = Object.freeze({
                    element: element,
                    innerHTML: element.innerHTML,
                    attribute: attribute,
                    rawset: rawSet,
                    router: config.router,
                    componentKey,
                    scripts: EventManager.setBindProperty(config.scripts ?? {}, obj)
                    // eslint-disable-next-line no-use-before-define
                } as Render);
                const constructor = element.getAttribute(`${EventManager.attrPrefix}constructor`);
                let constructorParam = [];

                // dr-constructor
                if (constructor) {
                    const script = `${renderScript} return ${constructor} `;
                    let param = ScriptUtils.eval(script, Object.assign(obj, { __render: render })) ?? [];
                    if (!Array.isArray(param)) {
                        param = [param];
                    }
                    constructorParam = param;
                }
                // console.log('------22', attrs);
                domrenderComponents[componentKey] = objFactory(element, obj, rawSet, constructorParam);
                const instance = domrenderComponents[componentKey];
                const i = instance.__domrender_component_new = (instance.__domrender_component_new ?? new Proxy({}, new DomRenderFinalProxy())) as CreatorMetaData;
                i.thisVariableName = rawSet.point.thisVariableName;
                i.thisFullVariableName = `this.__domrender_components.${componentKey}`;
                i.componentKey = componentKey;
                i.rawSet = rawSet;
                i.attribute = attribute;
                i.drAttrs = attrs;
                i.innerHTML = element.innerHTML;
                i.rootCreator = new Proxy(obj, new DomRenderFinalProxy());
                i.creator = new Proxy(rawSet.point.thisVariableName ? ScriptUtils.evalReturn(rawSet.point.thisVariableName, obj) : obj, new DomRenderFinalProxy());
                this.__creatorMetaData = i;
                render = {
                    component: instance,
                    creatorMetaData: i,
                    ...render
                }

                // dr-on-create onCreateRender
                const onCreate = element.getAttribute(`${EventManager.attrPrefix}on-create`)
                this.__render = render;

                let createParam = [i];
                if (onCreate) {
                    const script = `${renderScript} return ${onCreate} `;
                    createParam = ScriptUtils.eval(script, Object.assign(obj, { __render: render }));
                    if (!Array.isArray(createParam)) {
                        createParam = [createParam];
                    }
                }
                instance?.onCreateRender?.(...createParam);
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

                // dr-on-component-init
                const oninit = element.getAttribute(`${EventManager.attrPrefix}on-component-init`); // dr-on-component-init
                if (oninit) {
                    const script = `${renderScript}  ${oninit} `;
                    ScriptUtils.eval(script, Object.assign(obj, {
                        __render: render
                    }))
                }

                const innerHTML = RawSet.styleTransformLocal(styles, componentKey) + (applayTemplate ?? '');
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

    public static styleTransformLocal(styleBody: string | string[], id: string, styleTagWrap = true) {
        // <style id="first">
        //     #first ~ *:not(#first ~ style[domstyle] ~ *) {
        //     font-size: 30px;
        //     color: blue;
        // }
        // </style>
        if (Array.isArray(styleBody)) {
            styleBody = styleBody.join('\n');
        }
        styleBody = styleBody.replace(/([^}]+){/gm, function(a, b) {
            if (typeof b === 'string') {
                b = b.trim();
            }
            return `#${id} ~ ${b}:not(#${id} ~ style[domstyle] ~ *) {`;
        });
        if (styleTagWrap) {
            styleBody = `<style id='${id}' domstyle>${styleBody}</style>`
        }

        return styleBody;
    }

    public static destroy(obj: any | undefined, parameter: any[], config: Config, destroyOptions: (DestroyOptionType | string)[] = []): void {
        if (!destroyOptions.some(it => it === DestroyOptionType.NO_DESTROY)) {
            if (!destroyOptions.some(it => it === DestroyOptionType.NO_MESSENGER_DESTROY)) {
                if (config.messenger && obj) {
                    config.messenger.deleteChannelFromObj(obj);
                }
            }
            if (obj) {
                obj.onDestroyRender?.(...parameter);
            }
        }
    }
}
