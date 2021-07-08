import {RootScope} from './RootScope';
import {NodeUtils} from './utils/node/NodeUtils';

export type DepthType = { rootScope: RootScope | undefined, rootTargetOrigin?: any, depths: string[] };

export class ScopeObjectProxyHandler implements ProxyHandler<any> {
    // public _SimObjectProxyHandler_ref = new Map<string, any>();
    public _refs: any[] = [];
    private _rootScope?: RootScope;
    private _targetProxy?: any;
    private _targetOrigin?: any;

    constructor() {
    }

    run(_targetProxy: any, _targetOrigin: any, _rootScope?: RootScope) {
        this._targetProxy = _targetProxy;
        this._targetOrigin = _targetOrigin;
        this._rootScope = _rootScope;
        // console.log('proxy>', _target, typeof _target, this._refs)
        const data = Object.keys(_targetOrigin) || [];
        data.forEach(it => {
            this._targetOrigin[it] = this.proxy(this._targetOrigin[it])
        })
        // const proto = Object.getPrototypeOf(target);
        // data = Object.keys(target) || [];
        // console.log('0---startproxy', target,  proto, data);
    }

    public proxy(target: any) {
        if (typeof target === 'object' && !('_ScopeObjectProxyHandler_isProxy' in target)) {
            const scopeObjectProxyHandler = new ScopeObjectProxyHandler();
            scopeObjectProxyHandler._refs.push(this._targetProxy);
            const targetProxy = new Proxy(target, scopeObjectProxyHandler);
            targetProxy?._ScopeObjectProxyHandler?.run(targetProxy, target)
            return targetProxy;
        }
        return target;
    }

    public get(target: any, name: string, receiver: any): any {
        if (name === '_ScopeObjectProxyHandler') {
            return this;
        } else if (name === '_ScopeObjectProxyHandler_refs') {
            return this._refs;
        } else if (name === '_ScopeObjectProxyHandler_targetProxy') {
            return this._targetProxy;
        } else if (name === '_ScopeObjectProxyHandler_targetOrigin') {
            return this._targetOrigin;
        } else if (name === '_ScopeObjectProxyHandler_rootScope') {
            return this._rootScope;
        } else {
            return target[name]
        }
    }

    public depth(depths: string[], obj: any) {

    }

    public getRefsProxyProp(obj: any) {
        const fields: { parent: any, name: string, fieldValue: any }[] = [];
        this._refs.forEach((it: any) => {
            const data = Object.keys(it) || [];
            data.filter(sit => typeof it[sit] === 'object' && ('_ScopeObjectProxyHandler_isProxy' in it[sit]) && obj === it[sit]._ScopeObjectProxyHandler_targetOrigin).forEach(sit => {
                fields.push({
                    parent: it,
                    name: sit,
                    fieldValue: it[sit]
                });
            })
        });
        return fields;
    }

    public goRoot(depths: string[], obj: any): DepthType[] {
        const arr: DepthType[] = [];
        // console.log('goRoot-->', depths, 'target: ', obj, 'target: ', this._targetProxy, 'ref-->', this._refs)
        const refsProxyProp = this.getRefsProxyProp(obj);
        if (refsProxyProp.length > 0) {
            refsProxyProp.forEach(it => {
                const newDepths = depths.slice();
                newDepths.unshift(it.name)
                // console.log('getRefsProxyProp------->', it)
                const patharray = (it.parent._ScopeObjectProxyHandler as ScopeObjectProxyHandler).goRoot(newDepths, it.parent._ScopeObjectProxyHandler_targetOrigin);
                patharray.forEach(it => arr.push(it))
            });
        } else {
            const item = {
                rootScope: this._rootScope,
                rootTargetOrigin: this._targetOrigin,
                depths: depths
            } as DepthType
            arr.push(item);
        }
        return arr;
    }

    public set(obj: any, prop: string, value: any): boolean {
        // console.log('set-->', obj, ' prop:', prop, value, this._refs);
        obj[prop] = value

        const depths = [prop];
        const parentDepths = this.goRoot(depths, obj);
        // console.log('depths==>', parentDepths)

        parentDepths.filter(it => it.rootScope).forEach(it => {
            const fullDepth = it.depths.join('.');
            it.rootScope?.childs.filter(sit => sit.scopeResult && sit.usingVars.includes(fullDepth)).forEach(sit => {
                if (sit.scopeResult) {
                    sit.scopeResult.childAllRemove();
                    const startComment = sit.scopeResult.startComment;
                    const endComment = sit.scopeResult.endComment;
                    sit.exec(it.rootTargetOrigin)
                    // module.addEvent(it.scopeResult.fragment);
                    sit.scopeResult.childNodes.forEach(cit => NodeUtils.addNode(startComment, cit));
                    NodeUtils.replaceNode(startComment, sit.scopeResult.startComment);
                    NodeUtils.replaceNode(endComment, sit.scopeResult.endComment);
                }
            })
        })
        return true
    }

    has(target: any, key: PropertyKey): boolean {
        return key === '_ScopeObjectProxyHandler_isProxy' || key in target;
    }
}
