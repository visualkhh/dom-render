import {ScopeResultSet} from './ScopeResultSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {TargetNode, TargetNodeMode} from './RootScope';
import {DomRender, RawSet} from './DomRender';
import {Scope} from './Scope';
import {ScopeRawSet} from "./ScopeRawSet";

export type ScopeObjectCall = {name: string, parameter: any[], result: any};
export class ScopeObject {
    public _originObj: any;
    public _calls: ScopeObjectCall[] = [];
    [name: string]: any;
    public _writes = '';

    constructor(public _scope: Scope, public _uuid = RandomUtils.uuid()) {
    }

    public executeResultSet(script: string): ScopeResultSet {
        this.eval(script);
        const templateElement = this._scope.raws.document.createElement('template');
        templateElement.innerHTML = this._writes;
        // console.log('-->html-', script, templateElement.innerHTML)
        // eventManager.applyEvent(this, templateElement.content);
        const startComment = this._scope.raws.document.createComment('scope start ' + this._uuid)
        const endComment = this._scope.raws.document.createComment('scope end ' + this._uuid)
        templateElement.content.childNodes.forEach(it => {
            // Node.ELEMENT_NODE = 1
            if (it.nodeType === 1) {
                (it as Element).setAttribute('scope-uuid', this._uuid);
            }
        })
        return new ScopeResultSet(this._uuid, this, templateElement.content, startComment, endComment, this._calls)
    }

    private eval(str: string): any {
        return this.scopeEval(this, str);
    }

    private scopeEval(scope: any, script: string) {
        // eslint-disable-next-line no-new-func
        return Function(`"use strict";
        const write = (str) => {
            this._writes += str;
        };
        
        const include = (target) => {
            const uuid = this._makeUUID();
            const targetNode = this.getTargetNode(uuid);
            const rootScope = this._compileRootScope(target, targetNode, uuid);
            this._calls.push({name: 'include', parameter: [target], result: rootScope})
            
            if (rootScope) {
                this._writes += ("<template include-scope-uuid='" + uuid + "'></template>");
            }
        }
        
        ${this.customScript()}
        
        ${script}
        `).bind(scope)();
    }

    private _makeUUID() {
        return RandomUtils.uuid();
    }

    private _compileRootScope(target: any, targetNode: TargetNode, uuid: string) {
        // console.log('-----> target', target)
        if (!('_ScopeObjectProxyHandler_isProxy' in target)) {
            console.error('no Domrander Proxy Object -> var proxy = Domrender.proxy(target, ScopeRawSet)', target)
            return new Error('no Domrander compile Object');
        }
        const rawSet = target._ScopeObjectProxyHandler_rawSet! as RawSet;
        return DomRender.compileRootScope(this._scope.raws.document, target, rawSet, this._scope.config, targetNode, uuid);
    }

    private getTargetNode(uuid: string) {
        return new TargetNode(`[include-scope-uuid='${uuid}']`, TargetNodeMode.replace);
    }

    protected customScript() {
        return '';
    }
}
