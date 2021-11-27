import {Config} from '../Config';
import {ScriptUtils} from '../utils/script/ScriptUtils';
import {DomUtils} from '../utils/dom/DomUtils';
import {Range} from '../iterators/Range';
import {DomRenderProxy} from '../DomRenderProxy';

export class EventManager {
    public readonly attrPrefix = 'dr-';
    public readonly eventNames = [
        'click', 'mousedown', 'mouseup', 'dblclick', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'contextmenu',
        'keyup', 'keydown', 'keypress',
        'change', 'input', 'submit', 'resize', 'focus', 'blur'];

    public readonly eventParam = this.attrPrefix + 'event';

    public readonly attrNames = [
        this.attrPrefix + 'value',
        this.attrPrefix + 'value-link',
        this.attrPrefix + 'attr',
        this.attrPrefix + 'style',
        this.attrPrefix + 'class',
        this.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_POPSTATE,
        this.attrPrefix + 'window-event-' + EventManager.WINDOW_EVENT_RESIZE,
        this.attrPrefix + 'on-init',
        this.eventParam
    ];

    public static readonly SCRIPTS_VARNAME = '$scripts';
    public static readonly FAG_VARNAME = '$fag';
    public static readonly RAWSET_VARNAME = '$rawset';
    public static readonly RANGE_VARNAME = '$range';
    public static readonly ELEMENT_VARNAME = '$element';
    public static readonly TARGET_VARNAME = '$target';
    public static readonly EVENT_VARNAME = '$event';
    public static readonly VARNAMES = [EventManager.SCRIPTS_VARNAME, EventManager.FAG_VARNAME, EventManager.RAWSET_VARNAME, EventManager.RANGE_VARNAME, EventManager.ELEMENT_VARNAME, EventManager.TARGET_VARNAME, EventManager.EVENT_VARNAME];

    public static readonly WINDOW_EVENT_POPSTATE = 'popstate';
    public static readonly WINDOW_EVENT_RESIZE = 'resize';
    public static readonly WINDOW_EVENTS = [EventManager.WINDOW_EVENT_POPSTATE, EventManager.WINDOW_EVENT_RESIZE];

    readonly bindScript = `
        const ${EventManager.SCRIPTS_VARNAME} = this.__render.scripts;
        const ${EventManager.RANGE_VARNAME} = this.__render.range;
        const ${EventManager.ELEMENT_VARNAME} = this.__render.element;
        const ${EventManager.TARGET_VARNAME} = this.__render.target;
        const ${EventManager.EVENT_VARNAME} = this.__render.event;
    `

    constructor() {
        this.eventNames.forEach(it => {
            this.attrNames.push(this.attrPrefix + 'event-' + it);
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
                                    target: this.DomrenderProxyFinal(event.target),
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
    // 순환참조때문에 우선 여기에 뺴놓는다.
    public DomrenderProxyFinal(obj: any) {
        (obj as any)._DomRender_isFinal = true;
        return obj;
    }

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
        this.eventNames.forEach(it => {
            this.addDrEvents(obj, it, childNodes, config);
        });
        this.addDrEventPram(obj, this.eventParam, childNodes, config);

        // value
        this.procAttr<HTMLInputElement>(childNodes, this.attrPrefix + 'value', (it, attribute) => {
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
            this.procAttr<HTMLInputElement>(childNodes, this.attrPrefix + 'window-event-' + it, (it, attribute) => {
                (it as any).obj = obj;
            })
        })

        // on-init event
        this.procAttr<HTMLInputElement>(childNodes, this.attrPrefix + 'on-init', (it, varName) => {
            if (varName) {
                if (typeof this.getValue(obj, varName) === 'function') {
                    this.getValue(obj, varName)(it)
                } else {
                    this.setValue(obj, varName, it)
                }
            }
        })

        // value-link event
        this.procAttr<HTMLInputElement>(childNodes, this.attrPrefix + 'value-link', (it, varName) => {
            if (varName) {
                const value = this.getValue(obj, varName);
                if (typeof value === 'function' && value) {
                    value(it.value)
                } else {
                    if (value) {
                        this.setValue(obj, varName, value)
                    } else {
                        this.setValue(obj, varName, it.value)
                    }
                }
                it.addEventListener('input', (eit) => {
                    if (typeof this.getValue(obj, varName) === 'function') {
                        this.getValue(obj, varName)(it.value, eit)
                    } else {
                        this.setValue(obj, varName, it.value)
                    }
                })
            }
        })

        this.changeVar(obj, childNodes, undefined);
        // console.log('eventManager-applyEvent-->', config?.applyEvents)
        const elements = Array.from(childNodes).filter(it => it.nodeType === 1).map(it => it as Element);
        elements.forEach(it => {
            config?.applyEvents?.filter(ta => it.getAttribute(ta.attrName)).forEach(ta => ta.callBack(it, it.getAttribute(ta.attrName)!, obj))
        });
    }

    // eslint-disable-next-line no-undef
    public changeVar(obj: any, elements: Set<Element> | Set<ChildNode>, varName?: string) { // , config?: Config
        // console.log('-changeVar-->', obj, elements, varName)
        // value-link event
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'value-link', (it, attribute) => {
            // console.log('-------?')
            if (attribute && attribute === varName) {
                if (typeof this.getValue(obj, attribute) === 'function') {
                    this.getValue(obj, attribute)(it.value);
                } else {
                    const value = this.getValue(obj, attribute);
                    if (value !== undefined && value !== null) {
                        it.value = value;
                    }
                }
            }
        })

        // attribute
        this.procAttr(elements, this.attrPrefix + 'attr', (it, attribute) => {
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
        this.procAttr(elements, this.attrPrefix + 'style', (it, attribute) => {
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
        this.procAttr(elements, this.attrPrefix + 'class', (it, attribute) => {
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
        const attr = this.attrPrefix + 'event-' + eventName
        this.procAttr<HTMLInputElement>(elements, attr, (it, attribute) => {
            const script = attribute;
            it.addEventListener(eventName, (event) => {
                ScriptUtils.eval(`${this.bindScript} ${script} `, Object.assign(obj, {
                    __render: Object.freeze({
                        event,
                        element: it,
                        target: event.target,
                        range: Range.range,
                        scripts: EventManager.setBindProperty(config?.scripts, obj)
                    })
                }))
            })
        })
    }

    // eslint-disable-next-line no-undef
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

    public getValue<T = any>(obj: any, name: string, value?: any): T {
        // let r = obj[name];
        let r = ScriptUtils.evalReturn(name, obj);
        if (typeof r === 'function') {
            r = r.bind(obj);
        }
        return r;
    }

    public setValue(obj: any, name: string, value?: any) {
        ScriptUtils.eval(`this.${name} = this.value`, {
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
                raws = raws!.replace(RegExp(it.replace('$', '\\$'), 'g'), `this?.___${it}`);
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
