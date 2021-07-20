import {ScopeResultSet} from './ScopeResultSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {eventManager} from './events/EventManager';

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
        // console.log('ScopeObjectScopeObject', this)
        eventManager.applyEvent(this, templateElement);
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
