import { Config } from 'Config';

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
        const datas: {name: string, value: string | null, element: Element}[] = [];
        const addAttributes = config?.applyEvents?.map(it => it.attrName) ?? [];
        addAttributes.concat(this.attrNames).forEach(attrName => {
            fragment?.querySelectorAll(`[${attrName}]`).forEach(it => {
                datas.push({name: attrName, value: it.getAttribute(attrName), element: it});
            });
        })
        return datas;
    }

    // eslint-disable-next-line no-undef
    public applyEvent(obj: any, childNodes: ChildNode[], config?: Config) {
        // console.log('eventManager applyEvent==>', obj, childNodes, config)
        // Node.ELEMENT_NODE = 1
        const elements = childNodes.filter(it => it.nodeType === 1).map(it => it as Element);
        // event
        this.eventNames.forEach(it => {
            this.addDrEvent(obj, it, elements);
        });

        // value
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'value', (it, attribute) => {
            const script = attribute;
            // eslint-disable-next-line no-new-func
            const data = Function(`"use strict"; ${script} `).bind(Object.assign(obj))() ?? {};
            it.value = data;
        })

        // on-init event
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'on-init', (it, varName) => {
            if (varName) {
                if (typeof this.getValue(obj, varName) === 'function') {
                    this.getValue(obj, varName)(it)
                } else {
                    obj[varName] = it;
                }
            }
        })

        // value-link event
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'value-link', (it, varName) => {
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
        this.changeVar(obj, elements, undefined);
        // console.log('eventManager-applyEvent-->', config?.applyEvents)
        elements.forEach(it => {
            config?.applyEvents?.filter(ta => it.getAttribute(ta.attrName)).forEach(ta => ta.callBack(it, it.getAttribute(ta.attrName)!, obj))
        });
    }

    // eslint-disable-next-line no-undef
    public changeVar(obj: any, elements: Element[] | ChildNode[], varName?: string) { // , config?: Config
        // console.log('-changeVar-->', obj, elements, varName)
        // value-link event
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'value-link', (it, attribute) => {
            // const varNames = new Set(this.usingThisVar(varName ?? ''));
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
            console.log('-atttt')
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

    public addDrEvent(obj: any, eventName: string, elements: Element[]) {
        const attr = this.attrPrefix + 'event-' + eventName
        this.procAttr<HTMLInputElement>(elements, attr, (it, attribute) => {
            // console.log('-----ttttttttttt', attribute, obj[attribute!], obj)
            // console.log('-----ttttttttttt', attribute, this[attribute!], this._originObj[attribute!])
            // if (attribute && (this[attribute] || this._originObj[attribute])) {
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
    public procAttr<T extends Element>(elements: Element[] | ChildNode[] = [], attrName: string, f: (h: T, value: string | null) => void) {
        elements?.forEach(it => {
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
        let r = obj[name];
        if (typeof r === 'function') {
            r = r.bind(obj);
        }
        return r;
    }

    public setValue(obj: any, name: string, value?: any) {
        const thisAnyElement = obj[name];
        if (typeof thisAnyElement === 'number') {
            obj[name] = Number(value);
        } else {
            obj[name] = value.toString();
        }
    }

    public isUsingThisVar(raws: string | null | undefined, varName: string | null | undefined): boolean {
        if (varName && raws) {
            for (const raw of this.usingThisVar(raws)) {
                if (raw.startsWith(varName)) {
                    return true;
                }
            }
        }
        return false;
    }

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
