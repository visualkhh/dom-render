import {ScopeResultSet} from './ScopeResultSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';

export type ScopeObjectCalls = {name: string, parameter: any[], result: any}[];
export class ScopeObject {
    public _originObj: any;
    public calls: ScopeObjectCalls = [];
    [name: string]: any;
    public writes = '';

    constructor(public config: Config, public uuid = RandomUtils.uuid()) {
    }

    public executeResultSet(code: string): ScopeResultSet {
        this.eval(code);
        const templateElement = this.config.document.createElement('template');
        templateElement.innerHTML = this.writes;
        // event?? join?
        ['click', 'change', 'keyup', 'keydown', 'input'].forEach(it => {
            this.setEvent(it, templateElement);
        });
        const startComment = this.config.document.createComment('scope start ' + this.uuid)
        const endComment = this.config.document.createComment('scope end ' + this.uuid)
        templateElement.content.childNodes.forEach(it => {
            // Node.ELEMENT_NODE = 1
            if (it.nodeType === 1) {
                (it as Element).setAttribute('scope-uuid', this.uuid);
            }
        })
        return new ScopeResultSet(this.uuid, this, templateElement.content, startComment, endComment, this.calls)
    }

    private setEvent(eventName: string, template: HTMLTemplateElement) {
        const attr = 'dr-' + eventName
        this.procAttr<HTMLInputElement>(template.content, attr, (it, attribute) => {
            // console.log('-----ttttttttttt', attribute, this[attribute!], this._originObj[attribute!])
            if (attribute && (this[attribute] || this._originObj[attribute])) {
                it.addEventListener(eventName, (event) => {
                    if (typeof this.getValue(attribute) === 'function') {
                        this.getValue(attribute)(event)
                    } else {
                        this.setValue(attribute, it.value)
                    }
                })
            }
        })
    }

    procAttr<T extends HTMLElement>(element: DocumentFragment, attrName: string, f: (h: T, value: string | null) => void) {
        element.querySelectorAll<T>(`[${attrName}]`).forEach(it => {
            f(it, it.getAttribute(attrName));
        });
    }

    public getValue<T = any>(name: string, value?: any): T {
        const thisAny = this as any;
        let r = thisAny[name] ?? this._originObj[name];
        if (typeof r === 'function') {
            r = r.bind(thisAny[name] ? thisAny : this._originObj);
        }
        return r;
    }

    public setValue(name: string, value?: any) {
        const thisAny = this as any;
        const thisAnyElement = thisAny[name] ?? this._originObj[name];
        if (typeof thisAnyElement === 'number') {
            thisAny[name] = Number(value);
            this._originObj[name] = Number(value);
        } else {
            thisAny[name] = value.toString();
            this._originObj[name] = value.toString();
        }
    }

    private eval(str: string): any {
        return this.scopeEval(this, str);
    }

    private scopeEval(scope: any, script: string) {
        // eslint-disable-next-line no-new-func
        return Function(`"use strict";
        const write = (str) => {
            this.appendWrite(str);
        }
        
        ${this.customScript()}
        
        ${script}
        `).bind(scope)();
    }

    public customScript() {
        return '';
    }

    public appendWrite(str: string) {
        this.writes += str;
    }
}
