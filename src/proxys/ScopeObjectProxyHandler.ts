import {RootScope} from '../RootScope';
import {NodeUtils} from '../utils/node/NodeUtils';
import {Scope} from '../Scope';
import {ScopeFectory} from '../fectorys/ScopeFectory';
import {ScopeRawSet} from '../ScopeRawSet';

export type DepthType = { rootScopes: RootScope[], rootTargetOrigin?: any, rootTargetProxy?: any, depths: string[] };

export class ScopeObjectProxyHandler implements ProxyHandler<any> {
    // public _SimObjectProxyHandler_ref = new Map<string, any>();
    public _refs: any[] = [];
    private _rootScopes: RootScope[] = [];
    private _targetProxy?: any;
    private _targetOrigin?: any;

    constructor(public _rawSet: ScopeRawSet) {
    }

    run(_targetProxy: any, _targetOrigin: any, _rootScope?: RootScope) {
        this._targetProxy = _targetProxy;
        this._targetOrigin = _targetOrigin;
        if (_rootScope) {
            this._rootScopes.push(_rootScope);
        }
        // console.log('proxy>', _target, typeof _target, this._refs)
        if (!('_ScopeObjectProxyHandler_isProxy' in _targetProxy)) {
            const data = Object.keys(_targetOrigin) || [];
            data.forEach(it => {
                this._targetOrigin[it] = this.proxy(this._targetOrigin[it])
            })
        }
        // const proto = Object.getPrototypeOf(target);
        // data = Object.keys(target) || [];
        // console.log('0---startproxy', target,  proto, data);
    }

    public proxy(target: any) {
        if (typeof target === 'object' && !('_ScopeObjectProxyHandler_isProxy' in target) && !(target instanceof Scope) && !(target instanceof ScopeFectory)) {
            const scopeObjectProxyHandler = new ScopeObjectProxyHandler(this._rawSet);
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
            this._rootScopes.filter(it => it.changeField).forEach(it => {
                it.changeField(depths.join('.'))
            })
            const item = {
                rootScopes: this._rootScopes,
                rootTargetOrigin: this._targetOrigin,
                rootTargetProxy: this._targetProxy,
                depths: depths
            } as DepthType
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
        parentDepths.filter(it => it.rootScopes.length > 0).forEach(it => {
            const fullDepth = it.depths.join('.');
            it.rootScopes.forEach(rit => {
                console.log('>> ', fullDepth, rit)
                rit.childs.filter(sit => sit.scopeResult && sit.raws.usingVars.includes(fullDepth)).forEach(sit => {
                    console.log('----> ', fullDepth, sit)
                    // sit.exec(this._targetOrigin)
                    if (sit.scopeResult) {
                        sit.scopeResult.childAllRemove();
                        const startComment = sit.scopeResult.startComment;
                        const endComment = sit.scopeResult.endComment;
                        // sit.exec(it.rootTargetOrigin)
                        sit.exec(it.rootTargetProxy)
                        // module.addEvent(it.scopeResult.fragment);
                        // sit.scopeResult.childNodes.forEach(cit => NodeUtils.addNode(startComment, cit));
                        sit.scopeResult.childNodes.reduce((it, current) => {
                            NodeUtils.addNode(it, current);
                            return current;
                        }, startComment);
                        NodeUtils.replaceNode(startComment, sit.scopeResult.startComment);
                        NodeUtils.replaceNode(endComment, sit.scopeResult.endComment);
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
