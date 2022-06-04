import {Config} from '../Config';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {DomUtils} from '../utils/dom/DomUtils';
import {Range} from '../iterators/Range';
import { DomRenderFinalProxy } from '../types/Types';

export class EventManager {
    public static ownerVariablePathAttrName = 'dr-owner-variable-path';
    public static readonly attrPrefix = 'dr-';
    public readonly eventNames = [
        'click', 'mousedown', 'mouseup', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'contextmenu',
        'keyup', 'keydown', 'keypress',
        'change', 'input', 'submit', 'resize', 'focus', 'blur'];

    public readonly eventParam = EventManager.attrPrefix + 'event';
    public static readonly onInitAttrName = EventManager.attrPrefix + 'on-init';
    // public static readonly onComponentInitAttrName = EventManager.attrPrefix + 'on-component-init';
    public static readonly valueAttrName = EventManager.attrPrefix + 'value';
    public static readonly valueLinkAttrName = EventManager.attrPrefix + 'value-link';
    public static readonly attrAttrName = EventManager.attrPrefix + 'attr';
    public static readonly styleAttrName = EventManager.attrPrefix + 'style';
    public static readonly classAttrName = EventManager.attrPrefix + 'class';
    public readonly attrNames = [
        EventManager.valueAttrName,
        EventManager.valueLinkAttrName,
        EventManager.attrAttrName,
        EventManager.styleAttrName,
        EventManager.classAttrName,
        EventManager.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_POPSTATE,
        EventManager.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_RESIZE,
        EventManager.onInitAttrName,
        this.eventParam
    ];

    public static readonly VALUE_VARNAME = '$value';
    public static readonly SCRIPTS_VARNAME = '$scripts';
    public static readonly FAG_VARNAME = '$fag';
    public static readonly RAWSET_VARNAME = '$rawset';
    public static readonly RANGE_VARNAME = '$range';
    public static readonly ROUTER_VARNAME = '$router';
    public static readonly ELEMENT_VARNAME = '$element';
    public static readonly TARGET_VARNAME = '$target';
    public static readonly EVENT_VARNAME = '$event';
    public static readonly COMPONENT_VARNAME = '$component';
    public static readonly INNERHTML_VARNAME = '$innerHTML';
    public static readonly ATTRIBUTE_VARNAME = '$attribute';
    public static readonly VARNAMES = [EventManager.SCRIPTS_VARNAME, EventManager.FAG_VARNAME, EventManager.RAWSET_VARNAME, EventManager.RANGE_VARNAME, EventManager.ROUTER_VARNAME, EventManager.ELEMENT_VARNAME, EventManager.TARGET_VARNAME, EventManager.EVENT_VARNAME, EventManager.COMPONENT_VARNAME, EventManager.INNERHTML_VARNAME, EventManager.ATTRIBUTE_VARNAME];

    public static readonly WINDOW_EVENT_POPSTATE = 'popstate';
    public static readonly WINDOW_EVENT_RESIZE = 'resize';
    public static readonly WINDOW_EVENTS = [EventManager.WINDOW_EVENT_POPSTATE, EventManager.WINDOW_EVENT_RESIZE];

    readonly bindScript = `
        const ${EventManager.VALUE_VARNAME} = this.__render.value;
        const ${EventManager.SCRIPTS_VARNAME} = this.__render.scripts;
        const ${EventManager.RANGE_VARNAME} = this.__render.range;
        const ${EventManager.ROUTER_VARNAME} = this.__render.router;
        const ${EventManager.ATTRIBUTE_VARNAME} = this.__render.attribute;
        const ${EventManager.ELEMENT_VARNAME} = this.__render.element;
        const ${EventManager.TARGET_VARNAME} = this.__render.target;
        const ${EventManager.EVENT_VARNAME} = this.__render.event;
    `

    constructor() {
        this.eventNames.forEach(it => {
            this.attrNames.push(EventManager.attrPrefix + 'event-' + it);
        });

        if (typeof window !== 'undefined') {
            EventManager.WINDOW_EVENTS.forEach(eventName => {
                window?.addEventListener(eventName, (event) => {
                    const targetAttr = `dr-window-event-${eventName}`
                    document.querySelectorAll(`[${targetAttr}]`).forEach(it => {
                        const script = it.getAttribute(targetAttr)
                        if (script) {
                            const obj = (it as any).obj as any;
                            const config = obj?._DomRender_proxy?.config;
                            ScriptUtils.eval(`${this.bindScript} ${script} `, Object.assign(obj, {
                                __render: Object.freeze({
                                    target: DomRenderFinalProxy.final(event.target),
                                    element: it,
                                    event: event,
                                    range: Range.range,
                                    scripts: EventManager.setBindProperty(config?.scripts, obj)
                                })
                            }))
                        }
                    })
                })
            });
        }
    }
    // // 순환참조때문에 우선 여기에 뺴놓는다.
    // public DomrenderProxyFinal(obj: any) {
    //     (obj as any)._DomRender_isFinal = true;
    //     return obj;
    // }

    public findAttrElements(fragment: DocumentFragment | Element, config?: Config): Set<Element> {
        // const datas: {name: string, value: string | null, element: Element}[] = [];
        const elements = new Set<Element>();
        const addAttributes = config?.applyEvents?.map(it => it.attrName) ?? [];
        addAttributes.concat(this.attrNames).forEach(attrName => {
            fragment?.querySelectorAll(`[${attrName}]`).forEach(it => {
                elements.add(it);
            });
        })
        return elements;
    }

    // eslint-disable-next-line no-undef
    public applyEvent(obj: any, childNodes: Set<ChildNode> | Set<Element>, config?: Config) {
        // console.log('eventManager applyEvent==>', obj, childNodes, config)
        // Node.ELEMENT_NODE = 1
        // event
        // childNodes.forEach(it => {
        //     if (it instanceof Element) {
        //         it.setAttribute('dr-thieVariableName', 'this')
        //     }
        // })
        this.eventNames.forEach(it => {
            this.addDrEvents(obj, it, childNodes, config);
        });
        this.addDrEventPram(obj, this.eventParam, childNodes, config);

        // value
        this.procAttr<HTMLInputElement>(childNodes, EventManager.valueAttrName, (it, attribute) => {
            const script = attribute;
            if (script) {
                const data = ScriptUtils.evalReturn(script, obj);
                if (it.value !== data) {
                    it.value = data;
                }
            }
        })

        // window event
        EventManager.WINDOW_EVENTS.forEach(it => {
            this.procAttr<HTMLInputElement>(childNodes, EventManager.attrPrefix + 'window-event-' + it, (it, attribute) => {
                (it as any).obj = obj;
            })
        })

        // on-init event
        this.procAttr<HTMLInputElement>(childNodes, EventManager.onInitAttrName, (it, attribute) => {
            let script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (script) {
                const data = ScriptUtils.eval(`${this.bindScript}; ${script} `, Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }))
                // console.log('onInit--->', obj, varName, it)
                // if (typeof this.getValue(obj, varName) === 'function') {
                //     this.getValue(obj, varName)(it);
                // } else {
                //     this.setValue(obj, varName, it);
                // }
            }
        })

        // value-link event
        this.procAttr<HTMLInputElement>(childNodes, EventManager.valueLinkAttrName, (it, varName) => {
            if (varName) {
                const ownerVariablePathName = it.getAttribute(EventManager.ownerVariablePathAttrName);
                const mapScript = it.getAttribute(`${EventManager.valueLinkAttrName}:map`);
                // const inMapScript = it.getAttribute(`${valueLinkAttrName}:in-map`);
                let bindObj = obj;
                if (ownerVariablePathName) {
                    bindObj = ScriptUtils.evalReturn(ownerVariablePathName, obj);
                }
                const getValue = this.getValue(obj, varName, bindObj);
                // 아래 나중에 리팩토링 필요함
                if (typeof getValue === 'function' && getValue) {
                    let setValue = it.value;
                    if (mapScript) {
                        setValue = ScriptUtils.eval(`${this.bindScript} return ${mapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                    }
                    getValue(setValue)
                    // 여기서 value가 먼저냐 value-link가 먼저냐 선을 정해야되는거네...
                } else if (getValue) {
                    let setValue = getValue;
                    if (mapScript) {
                        setValue = ScriptUtils.eval(`${this.bindScript} return ${mapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                    }
                    it.value = setValue;
                    // this.setValue(obj, varName, setValue)
                }
                // } else if (getValue) { // 이구분이 있어야되나?? 없어도될것같은데..
                //     let setValue = getValue;
                //     if (inMapScript) {
                //         setValue = ScriptUtils.eval(`${this.bindScript} return ${inMapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                //     }
                //     this.setValue(obj, varName, setValue)
                // } else {
                //     let setValue = it.value;
                //     if (mapScript) {
                //         setValue = ScriptUtils.eval(`${this.bindScript} return ${mapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                //     }
                //     this.setValue(obj, varName, setValue)
                // }

                it.addEventListener('input', (event) => {
                    let value = it.value;
                    if (mapScript) {
                        value = ScriptUtils.eval(`${this.bindScript} return ${mapScript}`, Object.assign(bindObj, {
                            __render: Object.freeze({
                                event,
                                element: it,
                                target: event.target,
                                range: Range.range,
                                scripts: EventManager.setBindProperty(config?.scripts, obj)
                            })
                        }));
                    }
                    if (typeof this.getValue(obj, varName, bindObj) === 'function') {
                        this.getValue(obj, varName, bindObj)(value, event)
                    } else {
                        this.setValue(obj, varName, value)
                    }
                })
            }
        })

        this.changeVar(obj, childNodes, undefined, config);
        // console.log('eventManager-applyEvent-->', config?.applyEvents)
        const elements = Array.from(childNodes).filter(it => it.nodeType === 1).map(it => it as Element);
        elements.forEach(it => {
            config?.applyEvents?.filter(ta => it.getAttribute(ta.attrName) !== null).forEach(ta => ta.callBack(it, it.getAttribute(ta.attrName)!, obj))
        });
    }

    // eslint-disable-next-line no-undef
    public changeVar(obj: any, elements: Set<Element> | Set<ChildNode>, varName?: string, config?: Config) {
        // console.log('-changeVar-->', obj, elements, varName);
        // value-link event
        this.procAttr<HTMLInputElement>(elements, EventManager.valueLinkAttrName, (it, attribute) => {
            const ownerVariablePathName = it.getAttribute(EventManager.ownerVariablePathAttrName);
            let bindObj = obj;
            if (ownerVariablePathName) {
                bindObj = ScriptUtils.evalReturn(ownerVariablePathName, obj);
            }
            const mapScript = it.getAttribute(`${EventManager.valueLinkAttrName}:map`);
            if (attribute && attribute === varName) {
                const getValue = this.getValue(obj, attribute, bindObj);
                if (typeof getValue === 'function' && getValue) {
                    let setValue = it.value;
                    if (mapScript) {
                        setValue = ScriptUtils.eval(`${this.bindScript} return ${mapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                    }
                    getValue(setValue);
                } else { //  if (getValue !== undefined && getValue !== null)
                    let setValue = getValue;
                    if (mapScript) {
                        setValue = ScriptUtils.eval(`${this.bindScript} return ${mapScript}`, Object.assign(bindObj, {__render: Object.freeze({element: it, target: bindObj, range: Range.range, value: setValue,  scripts: EventManager.setBindProperty(config?.scripts, obj)})}));
                    }
                    it.value = setValue;
                }
            }
        })

        // attribute
        this.procAttr(elements, EventManager.attrAttrName, (it, attribute) => {
            let script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (this.isUsingThisVar(script, varName) || varName === undefined) {
                const data = ScriptUtils.eval(`const $element = this.__render.element; ${script} `, Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }))
                if (typeof data === 'string') {
                    data.split(',').forEach(sit => {
                        const [key, value] = sit.split('=');
                        const s = value.trim();
                        const k = key.trim();
                        if (s === 'null') {
                            it.removeAttribute(k);
                        } else {
                            it.setAttribute(k, s);
                        }
                    })
                } else if (Array.isArray(data)) {
                    data.forEach(sit => {
                        const [key, value] = sit.split('=');
                        const s = value.trim();
                        const k = key.trim();
                        if (s === 'null') {
                            it.removeAttribute(k);
                        } else {
                            it.setAttribute(k, s);
                        }
                    })
                } else {
                    for (const [key, value] of Object.entries(data)) {
                        if (value === null) {
                            it.removeAttribute(key);
                        } else {
                            it.setAttribute(key, String(value));
                        }
                    }
                }
            }
        })
        // style
        this.procAttr(elements, EventManager.styleAttrName, (it, attribute) => {
            let script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (this.isUsingThisVar(script, varName) || varName === undefined) {
                const data = ScriptUtils.eval(`const $element = this.__render.element;  ${script} `, Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }))
                if (typeof data === 'string') {
                    it.setAttribute('style', data);
                } else if (Array.isArray(data)) {
                    it.setAttribute('style', data.join(';'));
                } else {
                    for (const [key, value] of Object.entries(data)) {
                        if (it instanceof HTMLElement) {
                            (it.style as any)[key] = String(value);
                        }
                    }
                }
            }
        })
        // class
        this.procAttr(elements, EventManager.classAttrName, (it, attribute) => {
            let script = attribute;
            if (script) {
                script = 'return ' + script;
            }
            if (this.isUsingThisVar(script, varName) || varName === undefined) {
                const data = ScriptUtils.eval(`const $element = this.element;  ${script} `, Object.assign(obj, {
                    __render: Object.freeze({
                        element: it
                    })
                }))

                if (typeof data === 'string') {
                    it.setAttribute('class', data);
                } else if (Array.isArray(data)) {
                    it.setAttribute('class', data.join(' '));
                } else {
                    for (const [key, value] of Object.entries(data)) {
                        if (it instanceof HTMLElement) {
                            if (value) {
                                it.classList.add(key);
                            } else {
                                it.classList.remove(key);
                            }
                        }
                    }
                }
            }
        })
    }

    // eslint-disable-next-line no-undef
    public addDrEvents(obj: any, eventName: string, elements: Set<Element> | Set<ChildNode>, config?: Config) {
        const attr = EventManager.attrPrefix + 'event-' + eventName
        this.procAttr<HTMLElement>(elements, attr, (it, attribute) => {
            const script = attribute;
            it.addEventListener(eventName, (event) => {
                let filter = true;
                const filterScript = it.getAttribute(`${attr}:filter`);
                const attribute = DomUtils.getAttributeToObject(it);
                const thisTarget = Object.assign(obj, {
                    __render: Object.freeze({
                        event,
                        element: it,
                        target: event.target,
                        range: Range.range,
                        attribute: attribute,
                        router: config?.router,
                        scripts: EventManager.setBindProperty(config?.scripts, obj)
                    })
                });
                if (filterScript) {
                    filter = ScriptUtils.eval(`${this.bindScript} return ${filterScript}`, thisTarget)
                }
                if (filter) {
                    ScriptUtils.eval(`${this.bindScript} ${script} `, thisTarget)
                }
            });
        })
    }

    public addDrEventPram(obj: any, attr: string, elements: Set<ChildNode> | Set<Element>, config?: Config) {
        this.procAttr<HTMLInputElement>(elements, attr, (it, attribute, attributes) => {
            const bind: string | undefined = attributes[attr + ':bind'];
            if (bind) {
                const script = attribute;
                const params = {} as any;
                const prefix = attr + ':';
                Object.entries(attributes).filter(([k, v]) => k.startsWith(prefix)).forEach(([k, v]) => {
                    params[k.slice(prefix.length)] = v;
                });
                bind.split(',').forEach(eventName => {
                    it.addEventListener(eventName.trim(), (event) => {
                        ScriptUtils.eval(`const $params = this.__render.params; ${this.bindScript}  ${script} `, Object.assign(obj, {
                            __render: Object.freeze({
                                event,
                                element: it,
                                target: event.target,
                                range: Range.range,
                                scripts: EventManager.setBindProperty(config?.scripts, obj),
                                params
                            })
                        }))
                    })
                });
            }
        })
    }

    // eslint-disable-next-line no-undef
    public procAttr<T extends Element = Element>(elements: Set<Element> | Set<ChildNode> = new Set(), attrName: string, callBack: (h: T, value: string, attributes: any) => void) {
        const sets = new Set<Element>();
        elements.forEach(it => {
            // console.log('--->type', it, it.nodeType)
            if (!it) {
                return;
            }
            // Node.ELEMENT_NODE = 1
            if (it.nodeType === 1) {
                const e = it as Element;
                sets.add(e);
                e.querySelectorAll<T>(`[${attrName}]`).forEach(it => {
                    sets.add(it);
                })
            }
        });
        sets.forEach(it => {
            const attr = it.getAttribute(attrName);
            const attrs = DomUtils.getAttributeToObject(it);
            if (attr) {
                callBack(it as T, attr, attrs);
            }
        })
    }

    public getValue<T = any>(obj: any, name: string, bindObj?: any): T {
        // let r = obj[name];
        let r = ScriptUtils.evalReturn(name, obj);
        if (typeof r === 'function') {
            r = r.bind(bindObj??obj);
        }
        return r;
    }

    public setValue(obj: any, name: string, value?: any) {
        name = name.replaceAll('this.', 'this.this.')
        ScriptUtils.eval(`${name} = this.value;`, {
            this: obj,
            value: value
        })
    }

    public isUsingThisVar(raws: string | null | undefined, varName: string | null | undefined): boolean {
        // console.log('isUsingV', raws)
        // console.log('isUsingV', raws, varName, ScriptUtils.getVariablePaths(raws ?? ''))
        if (varName && raws) {
            if (varName.startsWith('this.')) {
                varName = varName.replace(/this\./, '')
            }
            EventManager.VARNAMES.forEach(it => {
                // raws = raws!.replace(RegExp(it.replace('$', '\\$'), 'g'), `this?.___${it}`);
                raws = raws!.replace(RegExp(it.replace('$', '\\$'), 'g'), `this.___${it}`);
            })
            const variablePaths = ScriptUtils.getVariablePaths(raws ?? '');
            return variablePaths.has(varName)
        }
        return false;
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

    // public usingThisVar(raws: string): string[] {
    //     let regex = /include\(.*\)/gm;
    //     // raws = raws.replace(regex, '');
    //     regex = /["'].*?["']/gm;
    //     raws = raws.replace(regex, '');
    //     const varRegexStr = 'this\\.([a-zA-Z_$][?a-zA-Z_.$0-9]*)';
    //     // const varRegexStr = '(?:this|it)\\.([a-zA-Z_$][?a-zA-Z_.$0-9]*)';
    //     // const varRegexStr = 'this\\.([a-zA-Z_$][?\\[\\]a-zA-Z_.$0-9]*)';
    //     const varRegex = RegExp(varRegexStr, 'gm');
    //     let varExec = varRegex.exec(raws)
    //     const usingVars = new Set<string>();
    //     // const usingVars = [];
    //     while (varExec) {
    //         const value = varExec[1].replace(/\?/g, '');
    //         usingVars.add(value);
    //         value.split('.').forEach(it => usingVars.add(it))
    //         varExec = varRegex.exec(varExec.input)
    //     }
    //     const strings = Array.from(usingVars);
    //     return strings;
    // }
}

export const eventManager = new EventManager();
