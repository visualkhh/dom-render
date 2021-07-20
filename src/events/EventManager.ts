import {Scope} from '../Scope';

export const eventManager = new class {
    public applyEvent(obj: any, templateElement: HTMLTemplateElement) {
        // event
        ['click', 'change', 'keyup', 'keydown', 'input'].forEach(it => {
            this.setEvent(obj, it, templateElement);
        });

        // value
        this.procAttr<HTMLInputElement>(templateElement.content, 'rd-value', (it, attribute) => {
            if (attribute && this.getValue(obj, attribute)) {
                if (typeof this.getValue(obj, attribute) === 'function') {
                    it.value = this.getValue(obj, attribute)()
                } else {
                    it.value = this.getValue(obj, attribute)
                }
            }
        })

        // link
        this.procAttr<HTMLInputElement>(templateElement.content, 'rd-value-link', (it, varName) => {
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
        this.changeVar(obj, templateElement.content);
    }

    public changeVar(obj: any, templateElement: HTMLElement | DocumentFragment, varName?: string) {
        // attribute
        this.procAttr(templateElement, 'rd-attr', (it, attribute) => {
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
        // style
        this.procAttr(templateElement, 'rd-style', (it, attribute) => {
            const varNames = new Set(Scope.usingThisVar(attribute ?? ''));
            const script = attribute;
            if ((varName && varNames.has(varName)) || varName === undefined) {
                // eslint-disable-next-line no-new-func
                const data = Function(`"use strict"; ${script} `).bind(obj)() ?? {};
                for (const [key, value] of Object.entries(data)) {
                    if (typeof value === 'string') {
                        (it.style as any)[key] = value;
                    }
                }
            }
        })
    }

    public setEvent(obj: any, eventName: string, template: HTMLTemplateElement) {
        const attr = 'dr-event-' + eventName
        this.procAttr<HTMLInputElement>(template.content, attr, (it, attribute) => {
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

    public procAttr<T extends HTMLElement>(element: DocumentFragment | HTMLElement, attrName: string, f: (h: T, value: string | null) => void) {
        element.querySelectorAll<T>(`[${attrName}]`).forEach(it => {
            f(it, it.getAttribute(attrName));
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
