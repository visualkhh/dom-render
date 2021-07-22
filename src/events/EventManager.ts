import {Scope} from '../Scope';

export const eventManager = new class {
    public readonly attrPrefix = 'dr-';
    public readonly eventNames = ['click', 'change', 'keyup', 'keydown', 'input'];
    public readonly attrNames = [
        this.attrPrefix + 'value-link',
        this.attrPrefix + 'value',
        this.attrPrefix + 'attr',
        this.attrPrefix + 'style'
    ];

    constructor() {
        this.eventNames.forEach(it => {
            this.attrNames.push(this.attrPrefix + 'event-' + it);
        });
        // console.log('attrname', this.attrNames)
    }

    public findAttrElements(fragment: DocumentFragment) {
        const datas: {name: string, value: string | null, element: Element}[] = [];
        this.attrNames.forEach(attrName => {
            fragment.querySelectorAll(`[${attrName}]`).forEach(it => {
                console.log('find-->', it)
                datas.push({name: attrName, value: it.getAttribute(attrName), element: it});
            });

        })
        return datas;
    }

    // eslint-disable-next-line no-undef
    public applyEvent(obj: any, childNodes: ChildNode[]) {
        const elements = childNodes.filter(it => it instanceof Element).map(it => it as Element);
        // event
        this.eventNames.forEach(it => {
            this.addDrEvent(obj, it, elements);
        });

        // value
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'value', (it, attribute) => {
            if (attribute && this.getValue(obj, attribute)) {
                if (typeof this.getValue(obj, attribute) === 'function') {
                    it.value = this.getValue(obj, attribute)()
                } else {
                    it.value = this.getValue(obj, attribute)
                }
            }
        })

        // link event
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'value-link', (it, varName) => {
            if (varName && this.getValue(obj, varName)) {
                it.addEventListener('input', (eit) => {
                    if (typeof this.getValue(obj, varName) === 'function') {
                        this.getValue(obj, varName)(eit)
                    } else {
                        this.setValue(obj, varName, it.value)
                    }
                })

                if (typeof this.getValue(obj, varName) === 'function') {
                    it.value = this.getValue(obj, varName);
                } else {
                    it.value = this.getValue(obj, varName);
                }
            }
        })
        this.changeVar(obj, elements);
    }

    public changeVar(obj: any, elements: Element[], varName?: string) {
        // link event
        this.procAttr<HTMLInputElement>(elements, this.attrPrefix + 'value-link', (it, varName) => {
            if (varName && this.getValue(obj, varName)) {
                if (typeof this.getValue(obj, varName) === 'function') {
                    it.value = this.getValue(obj, varName);
                } else {
                    it.value = this.getValue(obj, varName);
                }
            }
        })

        // attribute
        this.procAttr(elements, this.attrPrefix + 'attr', (it, attribute) => {
            const varNames = new Set(Scope.usingThisVar(attribute ?? ''));
            const script = attribute;
            if ((varName && varNames.has(varName)) || varName === undefined) {
                // eslint-disable-next-line no-new-func
                const data = Function(`"use strict"; ${script} `).bind(obj)() ?? {};
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'string') {
                        it.setAttribute(key, value);
                    }
                }
            }
        })
        // // style
        this.procAttr(elements, this.attrPrefix + 'style', (it, attribute) => {
            const varNames = new Set(Scope.usingThisVar(attribute ?? ''));
            const script = attribute;
            if ((varName && varNames.has(varName)) || varName === undefined) {
                // eslint-disable-next-line no-new-func
                const data = Function(`"use strict"; ${script} `).bind(obj)() ?? {};
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
            if (attribute && obj[attribute]) {
                it.addEventListener(eventName, (event) => {
                    if (typeof this.getValue(obj, attribute) === 'function') {
                        this.getValue(obj, attribute)(event)
                    } else {
                        this.setValue(obj, attribute, it.value)
                    }
                })
            }
        })
    }

    public procAttr<T extends Element>(elements: Element[] = [], attrName: string, f: (h: T, value: string | null) => void) {
        elements.forEach(it => {
            if (undefined !== it.getAttribute(attrName)) {
                f(it as T, it.getAttribute(attrName));
            }
            it.querySelectorAll<T>(`[${attrName}]`).forEach(it => {
                f(it, it.getAttribute(attrName));
            })
        });
    }

    public getValue<T = any>(obj: any, name: string, value?: any): T {
        // let r = thisAny[name] ?? this._originObj[name];
        let r = obj[name];
        // console.log('-------r', r, obj)
        if (typeof r === 'function') {
            // r = r.bind(thisAny[name] ? thisAny : this._originObj);
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
}();
