import {RootScope} from '../RootScope';
import {NodeUtils} from '../utils/node/NodeUtils';
import {Scope} from '../Scope';
import {RawSet} from '../DomRender';
interface ConstructorType<T> {
    new(...args: any[]): T;
}
export type DepthType = { rootScopes: Map<string, RootScope>, rootTargetOrigin?: any, rootTargetProxy?: any, depths: string[] };

export class ScopeObjectProxyHandler implements ProxyHandler<any> {
    // public _SimObjectProxyHandler_ref = new Map<string, any>();
    public _refs: any[] = [];
    // private _rootScopes: RootScope[] = [];
    private _rootScopes = new Map<string, RootScope>()
    private _targetProxy?: any;
    // private _targetOrigin?: any;

    constructor(public _rawSet: RawSet, private _targetOrigin: any, private _excludeTyps: ConstructorType<any>[] = []) {

    }

    run(_targetProxy: any, _rootScope?: RootScope) {
        this._targetProxy = _targetProxy;
        if (_rootScope) {
            this._rootScopes.set(_rootScope.uuid, _rootScope);
        }
        const data = Object.keys(this._targetOrigin) || [];
        data.filter(it => this.isProxyTarget(this._targetOrigin[it])).forEach(it => {
            this._targetOrigin[it] = this.proxy(this._targetOrigin[it])
        })
        // console.log('proxy>', _target, typeof _target, this._refs)
        // if (!('_ScopeObjectProxyHandler_isProxy' in _targetProxy)) {
        //     const data = Object.keys(_targetOrigin) || [];
        //     data.forEach(it => {
        //         this._targetOrigin[it] = this.proxy(this._targetOrigin[it])
        //     })
        // }

        // const proto = Object.getPrototypeOf(target);
        // data = Object.keys(target) || [];
        // console.log('0---startproxy', target,  proto, data);
    }

    public isProxyTarget(target: any) {
        let sw = false;
        // try {
        if (
            typeof target === 'object' &&
                !('_ScopeObjectProxyHandler_isProxy' in target) &&
                !(target instanceof Scope) &&
                this._excludeTyps.filter(it => target instanceof it).length === 0
        ) {
            sw = true;
        }
        // } catch (e) {
        //     return false;
        // }

        // console.log('isProxyTarget--->', target, sw)
        return sw;
    }

    public proxy(target: any) {
        if (this.isProxyTarget(target)) {
            const scopeObjectProxyHandler = new ScopeObjectProxyHandler(this._rawSet, target);
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
        } else if (name === '_ScopeObjectProxyHandler_rootScopes') {
            return this._rootScopes;
        } else if (name === '_ScopeObjectProxyHandler_rawSet') {
            return this._rawSet;
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
            if (this._targetProxy?.changeField) {
                this._targetProxy?.changeField(depths.join('.'))
            }
            this._rootScopes.forEach((v, k, m) => {
                v?.changeField(depths.join('.'));
            })
            const item = {
                rootScopes: this._rootScopes,
                rootTargetOrigin: this._targetOrigin,
                rootTargetProxy: this._targetProxy,
                depths: depths
            } as DepthType;
            arr.push(item);
        }
        return arr;
    }

    public set(obj: any, prop: string, value: any): boolean {
        const ignoreFields = ['_originObj', '_calls', '_writes', '_raws', '_uuid'];
        if (ignoreFields.includes(prop)) {
            obj[prop] = value;
            return true;
        }
        console.log('set-->', obj, ' prop:', prop, value, this._refs);
        obj[prop] = this.proxy(value);
        const depths = [prop];
        const parentDepths = this.goRoot(depths, obj);
        // console.log('set--> parentDepths', parentDepths);
        // console.dir(parentDepths);
        parentDepths.filter(it => it.rootScopes.size > 0).forEach(it => {
            const fullDepth = it.depths.join('.');
            // console.log('set--> rootScopes', fullDepth);
            it.rootScopes.forEach((rit, rkey, rmap) => {
                console.log('---rootScopesrootScopesrootScopes-->', this._rootScopes, rit.isConnected())
                if (!rit.isConnected()) {
                    this._rootScopes.delete(rit.uuid);
                    return;
                }
                // console.log('>---> ', fullDepth, 'prop:' + prop, '\t\t', rit.uuid, rit.raws.node.childNodes)
                // console.log('>> ', fullDepth, rit, rit.childs)
                rit.childs.filter(sit => sit.scopeResult && sit.raws.usingVars.includes(fullDepth)).forEach(sit => {
                    if (sit.scopeResult) {
                        sit.scopeResult.childAllRemove();
                        // const startComment = sit.scopeResult.startComment;
                        // const endComment = sit.scopeResult.endComment;
                        // const result = sit.exec(it.rootTargetProxy).result
                        // if (sit.raws.node) {
                        //     sit.raws.node.parentNode?.appendChild(result.startComment);
                        //     sit.raws.node.parentNode?.appendChild(result.fragment);
                        //     sit.raws.node.parentNode?.appendChild(result.endComment);
                        // }
                        const startComment = sit.scopeResult.startComment;
                        const endComment = sit.scopeResult.endComment;
                        const result = sit.exec(it.rootTargetProxy).result
                        result.childNodes.reduce((it, current) => {
                            NodeUtils.addNode(it, current);
                            return current;
                        }, startComment);
                        NodeUtils.replaceNode(startComment, result.startComment);
                        NodeUtils.replaceNode(endComment, result.endComment);

                        result.calls.filter(it => it.name === 'include' && it.result instanceof RootScope).map(it => it.result as RootScope).forEach(it => {
                            it.executeRender();
                        })
                    }
                })
            })
        })
        return true
    }

    apply(target: Function, thisArg: any, argumentsList?: any): any {
        return target.apply(thisArg, argumentsList);
    }

    has(target: any, key: PropertyKey): boolean {
        return key === '_ScopeObjectProxyHandler_isProxy' || key in target;
    }
}
