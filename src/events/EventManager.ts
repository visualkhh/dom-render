import { Config } from 'Config';
import {ScriptUtils} from '../utils/script/ScriptUtils';

export const eventManager = new class {
    public readonly attrPrefix = 'dr-';
    public readonly eventNames = ['click', 'change', 'keyup', 'keydown', 'input'];
    public readonly attrNames = [
        this.attrPrefix + 'value',
        this.attrPrefix + 'value-link',
        this.attrPrefix + 'attr',
        this.attrPrefix + 'style',
        this.attrPrefix + 'on-init'
    ];

    constructor() {
        this.eventNames.forEach(it => {
            this.attrNames.push(this.attrPrefix + 'event-' + it);
        });
    }

    public findAttrElements(fragment: DocumentFragment | Element, config?: Config) {
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
            this.addDrEvent(obj, it, childNodes);
        });

        // value
        this.procAttr<HTMLInputElement>(childNodes, this.attrPrefix + 'value', (it, attribute) => {
            const script = attribute;
            // eslint-disable-next-line no-new-func
            const data = Function(`"use strict"; ${script} `).bind(Object.assign(obj))() ?? {};
            if (it.value !== data) {
                it.value = data;
            }
        })

        // on-init event
        this.procAttr<HTMLInputElement>(childNodes, this.attrPrefix + 'on-init', (it, varName) => {
            if (varName) {
                if (typeof this.getValue(obj, varName) === 'function') {
                    this.getValue(obj, varName)(it)
                } else {
                    obj[varName] = it;
                }
            }
        })

        // value-link event
        this.procAttr<HTMLInputElement>(childNodes, this.attrPrefix + 'value-link', (it, varName) => {
            if (varName) {
                if (typeof this.getValue(obj, varName) === 'function') {
                    this.getValue(obj, varName)(it.value)
                } else {
                    this.setValue(obj, varName, it.value)
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
            const script = attribute;
            if (this.isUsingThisVar(attribute, varName) || varName === undefined) {
                // eslint-disable-next-line no-new-func
                const data = Function(`"use strict"; const $target=this.$target; ${script} `).bind(Object.assign({$target: it}, obj))() ?? {};
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'string') {
                        it.setAttribute(key, value);
                    }
                }
            }
        })
        // style
        this.procAttr(elements, this.attrPrefix + 'style', (it, attribute) => {
            const script = attribute;
            if (this.isUsingThisVar(attribute, varName) || varName === undefined) {
                // eslint-disable-next-line no-new-func
                const data = Function(`"use strict"; const $target = this.$target;  ${script} `).bind(Object.assign({$target: it}, obj))() ?? {};
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'string' && it instanceof HTMLElement) {
                        (it.style as any)[key] = value;
                    }
                }
            }
        })
    }

    // eslint-disable-next-line no-undef
    public addDrEvent(obj: any, eventName: string, elements: Set<Element> | Set<ChildNode>) {
        const attr = this.attrPrefix + 'event-' + eventName
        this.procAttr<HTMLInputElement>(elements, attr, (it, attribute) => {
            const script = attribute;
            it.addEventListener(eventName, (event) => {
                // eslint-disable-next-line no-new-func
                const f = Function(`"use strict"; const $target=event.target; const $event=event; ${script} `);
                // eslint-disable-next-line no-unused-vars
                const data = f.bind(Object.assign(obj))() ?? {};
            })
        })
    }

    // eslint-disable-next-line no-undef
    public procAttr<T extends Element>(elements: Set<Element> | Set<ChildNode> = new Set(), attrName: string, f: (h: T, value: string | null) => void) {
        elements.forEach(it => {
            // console.log('--->type', it, it.nodeType)
            if (!it) {
                return;
            }
            // Node.ELEMENT_NODE = 1
            if (it.nodeType === 1) {
                const e = it as Element;
                if (e.getAttribute(attrName)) {
                    f(it as T, e.getAttribute(attrName));
                }
                e.querySelectorAll<T>(`[${attrName}]`).forEach(it => {
                    f(it, it.getAttribute(attrName));
                })
            }
        });
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
        ScriptUtils.eval(`this.${name} = this.value`, {this: obj, value})
    }

    /**
     * @deprecated
     */
    public isUsingThisVar(raws: string | null | undefined, varName: string | null | undefined): boolean {
        // console.log('isUsingV', raws, varName)
        if (varName && raws) {
            for (const raw of this.usingThisVar(raws)) {
                if (raw.startsWith(varName)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @deprecated
     */
    public usingThisVar(raws: string): string[] {
        let regex = /include\(.*\)/gm;
        // raws = raws.replace(regex, '');
        regex = /["'].*?["']/gm;
        raws = raws.replace(regex, '');
        const varRegexStr = 'this\\.([a-zA-Z_$][?a-zA-Z_.$0-9]*)';
        // const varRegexStr = '(?:this|it)\\.([a-zA-Z_$][?a-zA-Z_.$0-9]*)';
        // const varRegexStr = 'this\\.([a-zA-Z_$][?\\[\\]a-zA-Z_.$0-9]*)';
        const varRegex = RegExp(varRegexStr, 'gm');
        let varExec = varRegex.exec(raws)
        const usingVars = new Set<string>();
        // const usingVars = [];
        while (varExec) {
            const value = varExec[1].replace(/\?/g, '');
            usingVars.add(value);
            value.split('.').forEach(it => usingVars.add(it))
            varExec = varRegex.exec(varExec.input)
        }
        const strings = Array.from(usingVars);
        return strings;
    }
}();
