import {RandomUtils} from '../utils/random/RandomUtils';
import {StringUtils} from '../utils/string/StringUtils';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {EventManager, eventManager} from '../events/EventManager';
import {Config} from '../configs/Config';
import {Range} from '../iterators/Range';
import {DomRenderFinalProxy} from '../types/Types';
import {DomUtils} from '../utils/dom/DomUtils';
import {ComponentSet} from '../components/ComponentSet';
import {DrPre} from '../operators/DrPre';
import {Dr} from '../operators/Dr';
import {DrIf} from '../operators/DrIf';
import {ExecuteState} from '../operators/OperatorRender';
import {DrThis} from '../operators/DrThis';
import {DrForm} from '../operators/DrForm';
import {DrInnerText} from '../operators/DrInnerText';
import {DrInnerHTML} from '../operators/DrInnerHTML';
import {DrFor} from '../operators/DrFor';
import {DrForOf} from '../operators/DrForOf';
import {DrAppender} from '../operators/DrAppender';
import {DrRepeat} from '../operators/DrRepeat';
import {DrTargetElement} from '../operators/DrTargetElement';
import {DrTargetAttr} from '../operators/DrTargetAttr';
import {TargetElement} from '../configs/TargetElement';
import {TargetAttr} from '../configs/TargetAttr';
import {DestroyOptionType} from './DestroyOptionType';
import {Attrs} from './Attrs';
import {CreatorMetaData} from './CreatorMetaData';
import {AttrInitCallBack} from './AttrInitCallBack';
import {ElementInitCallBack} from './ElementInitCallBack';
import {RawSetType} from './RawSetType';
import {Render} from './Render';

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
        public type: RawSetType,
        public point: { start: Comment | Text | HTMLMetaElement, node: Node, end: Comment | Text | HTMLMetaElement, thisVariableName?: string | null, parent?: Node | null },
        public fragment: DocumentFragment, public detect?: { action: Function }, public data?: any) {
        // console.log('rawset constructor->', (this.point.node as Element).getAttributeNames());
    }

    get isConnected() {
        return this.point.start.isConnected && this.point.end.isConnected;
    }

    // 중요
    getUsingTriggerVariables(config?: Config): Set<string> {
        const usingTriggerVariables = new Set<string>();
        this.fragment.childNodes.forEach((cNode, key) => {
            let script = '';
            if (cNode.nodeType === Node.TEXT_NODE) {
                script = `\`${(cNode as Text).textContent ?? ''}\``;
                // console.log('???????', script)
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                const targetAttrNames = (config?.targetAttrs?.map(it => it.name) ?? []).concat(RawSet.DR_ATTRIBUTES); // .concat(EventManager.normalAttrMapAttrName);
                const targetScripts = targetAttrNames.map(it => element.getAttribute(it)).filter(it => it);
                const targetAttrMap = element.getAttribute(EventManager.normalAttrMapAttrName);
                if (targetAttrMap) {
                    // console.log('----->', targetAttr);
                    new Map<string, string>(JSON.parse(targetAttrMap)).forEach((v, k) => {
                        targetScripts.push(v);
                    });
                }
                script = targetScripts.join(';');

                // attribute쪽 체크하는거 추가
                // console.log('----!!!!!-->', targetAttrNames)
                // const otherAttrs = element.getAttributeNames()
                //     .filter(it => !targetAttrNames.includes(it.toLowerCase()) && RawSet.isExporesion(element.getAttribute(it)))
                //     .map(it => {
                //         return `\`${element.getAttribute(it) ?? ''}\``;
                //     }).join(';');
                // script += ';' + otherAttrs
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

    // 중요 render 처리 부분
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
                // console.log('text-->', this, obj, config)
                // console.log('text-->', Array.from(this.fragment.childNodes))
                const textContent = cNode.textContent;
                const runText = RawSet.exporesionGrouops(textContent)[0][1];
                // console.log('--->', RawSet.exporesionGrouops(textContent), textContent,runText, runText[0][1])
                let newNode: Node;
                if (textContent?.startsWith('#')) {
                    const r = ScriptUtils.eval(`${__render.bindScript} return ${runText}`, Object.assign(obj, {__render}));
                    const template = config.window.document.createElement('template') as HTMLTemplateElement;
                    template.innerHTML = r;
                    newNode = template.content;
                } else {
                    const r = ScriptUtils.eval(`${__render.bindScript}  return ${runText}`, Object.assign(obj, {__render}));
                    newNode = config.window.document.createTextNode(r);
                }
                cNode.parentNode?.replaceChild(newNode, cNode);
                // console.log('-------', this.point.start.parentNode.nodeName)
                // 중요 style value change 됐을때 다시 처리해야되기떄문에: 마지막에 completed 없는 attr 가지고 판단 하니깐
                if (this.type === RawSetType.STYLE_TEXT && this.point.parent) {
                    (this.point.parent as Element).removeAttribute('completed');
                }
            } else if (cNode.nodeType === Node.ELEMENT_NODE) {
                const element = cNode as Element;
                // console.log('target-->', element)
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
        this.replaceBody(genNode); // 중요 여기서 마지막에 연션된 값을 그려준다.
        drAttrs.forEach(it => {
            if (it.drCompleteOption) {
                // genNode.childNodes
                const render = Object.freeze({
                    rawset: this,
                    fag: genNode,
                    scripts: EventManager.setBindProperty(config?.scripts, obj)
                } as Render);
                ScriptUtils.eval(`
                const ${EventManager.FAG_VARNAME} = this.__render.fag;
                const ${EventManager.SCRIPTS_VARNAME} = this.__render.scripts;
                const ${EventManager.RAWSET_VARNAME} = this.__render.rawset;
                ${it.drCompleteOption}`, Object.assign(obj, {__render: render}));
            }
        })

        // 중요 style isolation 나중에 :scope로 대체 가능할듯.
        RawSet.generateStyleSheetsLocal();
        // console.log('-22222-')
        // alert(1);

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
                    // const domrenderComponent = obj.__domrender_components[key];
                    // console.log('component destroy--->', key, rawSet, rawSet.isConnected, domrenderComponent.name, domrenderComponent);
                    const destroyOptions = drAttrs?.drDestroyOption?.split(',') ?? [];
                    RawSet.destroy(obj.__domrender_components[key], [domrenderComponentNew], config, destroyOptions)
                    delete obj.__domrender_components[key];
                }
            })
        }
        return raws;
    }

    public static generateStyleSheetsLocal() {
        Array.from(window.document.styleSheets).filter(it => it.ownerNode && it.ownerNode instanceof Element && it.ownerNode.hasAttribute('domstyle') && it.ownerNode.getAttribute('id') && !it.ownerNode.getAttribute('completed')).forEach(it => {
            const styleElement = (it.ownerNode as Element);
            const split = styleElement.getAttribute('id')?.split('-');
            split?.pop();
            const id = split?.join('-');
            if (id) {
                // console.log('------->', id)
                Array.from(it.cssRules).forEach((it) => {
                    RawSet.generateCSS(id, it);
                });
            }
            (it.ownerNode as Element).setAttribute('completed', 'true');
        })
    }

    public static generateCSS(id: string, cssRule: CSSRule) {
        const start = `#${id}-start`;
        const end = `#${id}-end`;
        if (cssRule.constructor.name === 'CSSStyleRule') {
            const rule = cssRule as CSSStyleRule;
            // rule.selectorText = `${start} ~ *:not(${start} ~ ${end} ~ *) ${rule.selectorText}`;
            // rule.selectorText = `${start} ~ *:not(${start} ~ ${end} ~ ${rule.selectorText})`;
            // console.log('-----', rule, rule.selectorText)
            if (!rule.selectorText.startsWith(':root')) {
                // rule.selectorText = `${start} ~ ${rule.selectorText}:not(${start} ~ ${end} ~ *)`;
                // rule.selectorText = `${start} ~ ${rule.selectorText}:not(${start} ~ ${end} ~ *)`;
                const selectorText = `:is(${start} ~ *:not(${start} ~ ${end} ~ *))`;
                if (rule.selectorText.startsWith('.')) {
                    rule.selectorText = `${selectorText}${rule.selectorText}, ${selectorText} ${rule.selectorText}`;
                    //     rule.selectorText = `${start} ~ *:not(${start} ~ ${end} ~ *)${rule.selectorText}`;
                } else {
                    const divText = `${start} ~ ${rule.selectorText}:not(${start} ~ ${end} ~ *)`;
                    rule.selectorText = `${selectorText} ${rule.selectorText}, ${divText}`;
                    // rule.selectorText = `${selectorText} ${rule.selectorText}`;
                    //     rule.selectorText = `${rule.selectorText} ~ ${start} ~ *:not(${start} ~ ${end} ~ *)`;
                }
            }
            // console.log(rule.selectorText);
        } else if (cssRule.constructor.name === 'CSSMediaRule') {
            const rule = cssRule as CSSMediaRule;
            Array.from(rule.cssRules).forEach((it) => {
                this.generateCSS(id, it);
            })
        }
    }

    // 중요 스타일 적용 부분
    public static generateStyleTransform(styleBody: string | string[], id: string, styleTagWrap = true) {
        if (Array.isArray(styleBody)) {
            styleBody = styleBody.join('\n');
        }
        if (styleTagWrap) {
            styleBody = `<style id='${id}-style' domstyle>${styleBody}</style>`
        }

        return styleBody;
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
        this.point.start.parentNode?.insertBefore(genNode, this.point.start.nextSibling); // 중요 start checkpoint 다음인 end checkpoint 앞에 넣는다. 즉 중간 껴넣기 (나중에 meta tag로 변경을 해도될듯하긴한데..)
    }

    // 중요 important
    public static checkPointCreates(element: Node, obj: any, config: Config): RawSet[] {
        // console.log('start==========')
        const thisVariableName = (element as any).__domrender_this_variable_name;
        // console.log('checkPointCreates thisVariableName', thisVariableName);
        const nodeIterator = config.window.document.createNodeIterator(element, NodeFilter.SHOW_ALL, {
            acceptNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    // console.log('text--->', node.textContent)
                    // console.log('????????', node.parentElement, node.parentElement?.getAttribute('dr-pre'));
                    // console.log('???????/',node.textContent, node.parentElement?.getAttribute('dr-pre'))
                    // TODO: 나중에
                    // const between = StringUtils.betweenRegexpStr('[$#]\\{', '\\}', StringUtils.deleteEnter((node as Text).data ?? ''))
                    const between = RawSet.exporesionGrouops(StringUtils.deleteEnter((node as Text).data ?? ''))
                    // console.log('bbbb', between)
                    return between?.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    // return /\$\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    // return /[$#]\{.*?\}/g.test(StringUtils.deleteEnter((node as Text).data ?? '')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    // console.log('------>', element);
                    const isElement = (config.targetElements?.map(it => it.name.toLowerCase()) ?? []).includes(element.tagName.toLowerCase());
                    const targetAttrNames = (config.targetAttrs?.map(it => it.name) ?? []).concat(RawSet.DR_ATTRIBUTES);
                    const normalAttrs = new Map<string, string>();
                    const isAttr = element.getAttributeNames().filter(it => {
                        const value = element.getAttribute(it);
                        if (value && RawSet.isExporesion(value)) {
                            normalAttrs.set(it, RawSet.exporesionGrouops(value)[0][1]);
                        }
                        // console.log(element.getAttribute(it), attrExpresion);
                        const isTargetAttr = targetAttrNames.includes(it.toLowerCase());
                        return isTargetAttr;
                    }).length > 0;
                    // 기본 attribute를 처리하기위해
                    if (normalAttrs.size) {
                        element.setAttribute(EventManager.normalAttrMapAttrName, JSON.stringify(Array.from(normalAttrs.entries())));
                    }

                    return (isAttr || isElement) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        });
        const pars: RawSet[] = [];
        let currentNode: Node | null;
        // eslint-disable-next-line no-cond-assign
        while (currentNode = nodeIterator.nextNode()) {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                const text = (currentNode as Text).textContent ?? '';
                const template = config.window.document.createElement('template');
                // const a = StringUtils.regexExec(/\$\{.*?\}/g, text);
                // const a = StringUtils.regexExec(/[$#]\{.*?\}/g, text);
                // const a = StringUtils.betweenRegexpStr('[$#]\\{', '\\}', text); // <--TODO: 나중에..
                const groups = RawSet.exporesionGrouops(text);
                const map = groups.map(it => ({uuid: RandomUtils.getRandomString(40), content: it[0], regexArr: it}));
                let lasterIndex = 0;
                for (let i = 0; i < map.length; i++) {
                    const it = map[i];
                    const regexArr = it.regexArr;
                    const preparedText = regexArr.input.substring(lasterIndex, regexArr.index);
                    // const start = config.window.document.createElement('meta');
                    // start.setAttribute('id', `${it.uuid}-start`);
                    // const end = config.window.document.createElement('meta');
                    // end.setAttribute('id', `${it.uuid}-end`);
                    let type: RawSetType;
                    if (currentNode.parentNode && currentNode.parentNode.nodeName.toUpperCase() === 'STYLE') {
                        type = RawSetType.STYLE_TEXT;
                    } else {
                        type = RawSetType.TEXT;
                    }
                    const startEndPoint = RawSet.createStartEndPoint(it.uuid, type, config);
                    // layout setting
                    template.content.append(document.createTextNode(preparedText)); // 앞 부분 넣고
                    template.content.append(startEndPoint.start); // add start checkpoint
                    template.content.append(startEndPoint.end); // add end checkpoint

                    // content 안쪽 RawSet render 할때 start 와 end 사이에 fragment 연산해서 들어간다.
                    const fragment = config.window.document.createDocumentFragment();
                    fragment.append(config.window.document.createTextNode(it.content))
                    pars.push(new RawSet(it.uuid, type, {
                        start: startEndPoint.start,
                        node: currentNode,
                        end: startEndPoint.end,
                        parent: currentNode.parentNode,
                        thisVariableName
                    }, fragment));
                    lasterIndex = regexArr.index + it.content.length;
                }
                template.content.append(config.window.document.createTextNode(text.substring(lasterIndex, text.length)));
                currentNode?.parentNode?.replaceChild(template.content, currentNode); // <-- 여기서 text를 fragment로 replace했기때문에 추적 변경이 가능하다.
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                const uuid = RandomUtils.getRandomString(40);
                const element = currentNode as Element;
                const fragment = config.window.document.createDocumentFragment();
                const type: RawSetType = RawSetType.TARGET_ELEMENT;
                const startEndPoint = RawSet.createStartEndPoint(uuid, type, config);
                const isElement = (config.targetElements?.map(it => it.name.toLowerCase()) ?? []).includes(element.tagName.toLowerCase());
                const targetAttrNames = (config.targetAttrs?.map(it => it.name) ?? []).concat(RawSet.DR_ATTRIBUTES);
                const isAttr = element.getAttributeNames().filter(it => targetAttrNames.includes(it.toLowerCase())).length > 0;
                currentNode?.parentNode?.insertBefore(startEndPoint.start, currentNode);
                currentNode?.parentNode?.insertBefore(startEndPoint.end, currentNode.nextSibling);
                fragment.append(currentNode);
                pars.push(new RawSet(uuid, isElement ? type : (isAttr ? RawSetType.TARGET_ATTR : RawSetType.UNKOWN), {
                    start: startEndPoint.start,
                    node: currentNode,
                    end: startEndPoint.end,
                    parent: currentNode.parentNode,
                    thisVariableName
                }, fragment))
            }
        }
        // console.log('check-->', pars)
        return pars;
    }

    public static createStartEndPoint(id: string, type: RawSetType, config: Config) {
        if (type === RawSetType.TARGET_ELEMENT) {
            const start: HTMLMetaElement = config.window.document.createElement('meta');
            const end: HTMLMetaElement = config.window.document.createElement('meta');
            start.setAttribute('id', `${id}-start`);
            end.setAttribute('id', `${id}-end`);
            return {
                start,
                end
            }
        } else if (type === RawSetType.STYLE_TEXT) {
            return {
                start: config.window.document.createTextNode(`/*start text ${id}*/`),
                end: config.window.document.createTextNode(`/*end text ${id}*/`)
            }
        } else { // text
            return {
                start: config.window.document.createComment(`start text ${id}`),
                end: config.window.document.createComment(`end text ${id}`)
            }
        }
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

    public static drThisCreate(rawSet: RawSet, element: Element, drThis: string, drVarOption: string, drStripOption: boolean | string | null, obj: any, config: Config, set?: ComponentSet) {
        const fag = config.window.document.createDocumentFragment();
        const n = element.cloneNode(true) as Element;
        // console.log('--------',n, n.innerHTML)
        if (set) {
            // const id = RandomUtils.getRandomString(20);
            const style = RawSet.generateStyleTransform(set.styles ?? [], rawSet.uuid, true);
            n.innerHTML = style + (set.template ?? '');
            // const metaStart = RawSet.metaStart(id);
            // const metaEnd = RawSet.metaEnd(id);
            // n.innerHTML = metaStart + style + (set.template ?? '') + metaEnd;
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
            // console.log('------childNodes', Array.from(n.childNodes))
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

    public static createComponentTargetElement(name: string, objFactory: (element: Element, obj: any, rawSet: RawSet, counstructorParam: any[]) => any, template: string = '', styles: string[] = []): TargetElement {
        const targetElement: TargetElement = {
            name,
            styles,
            template,
            callBack(element: Element, obj: any, rawSet: RawSet, attrs: Attrs, config: Config): DocumentFragment {
                // console.log('callback------->', element)
                if (!obj.__domrender_components) {
                    obj.__domrender_components = {};
                }
                const domrenderComponents = obj.__domrender_components;
                // const componentKey = '_' + RandomUtils.getRandomString(20);
                const componentKey = rawSet.uuid;
                const attribute = DomUtils.getAttributeToObject(element);
                const renderScript = 'var $component = this.__render.component; var $element = this.__render.element; var $router = this.__render.router; var $innerHTML = this.__render.innerHTML; var $attribute = this.__render.attribute; var $creatorMetaData = this.__render.creatorMetaData;';
                let render = Object.freeze({
                    renderScript,
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
                    let param = ScriptUtils.eval(script, Object.assign(obj, {__render: render})) ?? [];
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
                i.router = config.router;
                i.scripts = render.scripts;
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

                // 중요 dr-normal-attr-map
                const normalAttrMap = element.getAttribute(EventManager.normalAttrMapAttrName);
                if (instance.onChangeAttrRender && normalAttrMap) {
                    new Map<string, string>(JSON.parse(normalAttrMap)).forEach((value, key) => {
                        const script = `${renderScript} return ${value} `;
                        const cval = ScriptUtils.eval(script, Object.assign(obj, {__render: render}));
                        // element.setAttribute(key, cval);
                        instance.onChangeAttrRender(key, cval);
                    });
                }

                // dr-on-create onCreateRender
                const onCreate = element.getAttribute(`${EventManager.attrPrefix}on-create`)
                this.__render = render;

                let createParam = [i];
                if (onCreate) {
                    const script = `${renderScript} return ${onCreate} `;
                    createParam = ScriptUtils.eval(script, Object.assign(obj, {__render: render}));
                    if (!Array.isArray(createParam)) {
                        createParam = [createParam];
                    }
                }
                instance?.onCreateRender?.(...createParam);
                let applayTemplate = element.innerHTML;
                let innerHTMLThisRandom;
                const componentName = element.getAttribute(`${EventManager.attrPrefix}component-name`) ?? 'component';
                const innerHTMLName = element.getAttribute(`${EventManager.attrPrefix}component-inner-html-name`) ?? 'innerHTML';
                if (applayTemplate) {
                    // if (rawSet.point.thisVariableName) {
                    // 넘어온 innerHTML에 this가 있으면 해당안되게 우선 치환.
                    innerHTMLThisRandom = RandomUtils.uuid();
                    applayTemplate = applayTemplate.replace(/this\./g, innerHTMLThisRandom);
                    // }
                    applayTemplate = applayTemplate.replace(RegExp(`#${componentName}#`, 'g'), 'this');
                }
                applayTemplate = template.replace(RegExp(`#${innerHTMLName}#`, 'g'), applayTemplate);
                // dr-on-component-init
                const oninit = element.getAttribute(`${EventManager.attrPrefix}on-component-init`); // dr-on-component-init
                if (oninit) {
                    const script = `${renderScript}  ${oninit} `;
                    ScriptUtils.eval(script, Object.assign(obj, {
                        __render: render
                    }))
                }

                const style = RawSet.generateStyleTransform(styles, componentKey, true);
                element.innerHTML = style + (applayTemplate ?? '');
                // const metaStart = RawSet.metaStart(componentKey);
                // const metaEnd = RawSet.metaEnd(componentKey);
                // element.innerHTML = metaStart + style + (applayTemplate ?? '') + metaEnd;
                // console.log('------>', element.innerHTML, obj)
                let data = RawSet.drThisCreate(rawSet, element, `this.__domrender_components.${componentKey}`, '', true, obj, config);

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

    public static isExporesion(data: string | null) {
        const reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]?[^{]*?)\}[$#]))/g;
        return reg.test(data ?? '');
    }

    public static exporesionGrouops(data: string | null) {
        // const reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]*?)\}[$#]))/g;
        const reg = /(?:[$#]\{(?:(([$#]\{)??[^$#]?[^{]*?)\}[$#]))/g;
        return StringUtils.regexExec(reg, data ?? '');
    }

    // public static metaStart(id: string) {
    //     return `<meta id='${id}-start' />`;
    // }
    //
    // public static metaEnd(id: string) {
    //     return `<meta id='${id}-end' />`;
    // }

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
