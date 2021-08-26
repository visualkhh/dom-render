import { RawSet } from './RawSet';
import { eventManager } from './events/EventManager';
import { Config } from 'Config';
import { ScriptUtils } from './utils/script/ScriptUtils';

export class DomRenderProxy<T extends object> implements ProxyHandler<T> {
    public _domRender_ref = new Map<object, Set<string>>()
    public _rawSets = new Map<string, Set<RawSet>>()
    public _domRender_proxy?: T;
    public _targets = new Set<Node>();
    constructor(public _domRender_origin: T, target?: Node, private config?: Config) {
        if (target) {
            this._targets.add(target);
        }
    }

    public run(objProxy: T) {
        this._domRender_proxy = objProxy;
        const obj = (objProxy as any)._DomRender_origin;
        if (obj) {
            Object.keys(obj).forEach(it => {
                const target = (obj as any)[it]
                if (target !== undefined && target !== null && typeof target === 'object') {
                    const filter = this.config?.proxyExcludeTyps?.filter(it => target instanceof it) ?? []
                    if (filter.length === 0) {
                        // console.log('proxy exclude-notAt-', target, this.config?.proxyExcludeTyps)
                        const proxyAfter = this.proxy(objProxy, target, it);
                        (obj as any)[it] = proxyAfter;
                    }
                }
            })
        }

        this._targets.forEach(target => {
            this.initRender(target);
        });
    }

    public initRender(target: Node) {
        this._targets.add(target)
        const rawSets = RawSet.checkPointCreates(target, this.config);
        // console.log('-initRender-->->', findAttrElements)
        eventManager.applyEvent(this._domRender_proxy, eventManager.findAttrElements(target as Element, this.config), this.config)
        rawSets.forEach(it => {
            const strings = it.getUsingTriggerVariables(this.config);
            if (strings.size <= 0) {
                this.addRawSet('', it)
            } else {
                strings.forEach(sit => {
                    this.addRawSet(sit, it)
                })
            }
        })
        this._rawSets.forEach((v, k) => {
            this.render(Array.from(v));
        })
    }

    public render(raws: RawSet[]) {
        raws.forEach(it => {
            // console.log('render--->', raws, it.point.start.isConnected, it.point.start.isConnected)
            it.getUsingTriggerVariables(this.config).forEach(path => this.addRawSet(path, it))
            if (it.point.start.isConnected && it.point.start.isConnected) {
                const rawSets = it.render(this._domRender_proxy, this.config);
                // const thisRawSet = rawSets.filter(it => !it.thisObjPath)
                rawSets.forEach(it => console.log('---->', it))
                // rawSets.filter(it => it.thisObjPath).forEach(it => {
                //     const childTarget = ScriptUtils.evalReturn(it.thisObjPath!, this._domRender_proxy);
                //     it.thisObjPath = undefined;
                //     console.log('objThisPath-->', it)
                //     childTarget?._DomRender_proxy?.addRawSetAndRender('', it)
                // })
                // console.log('-----', thisRawSet, this._domRender_proxy)
                // this.render(thisRawSet);
                this.render(rawSets);
            } else {
                this.removeRawSet(it)
            }
        })
    }

    public root(paths: string[], value: any) {
        if (this._domRender_ref.size > 0) {
            this._domRender_ref.forEach((it, key) => {
                if ('_DomRender_isProxy' in key) {
                    it.forEach(sit => {
                        (key as any)._DomRender_proxy?.root(paths.concat(sit), value)
                    })
                }
            })
        } else {
            const strings = paths.reverse();
            const fullPathStr = strings.join('.');
            const iterable = this._rawSets.get(fullPathStr);
            //array check
            const front = strings.slice(0, strings.length-1).join('.')
            const last = strings[strings.length-1]
            if (!isNaN(Number(last)) && Array.isArray(ScriptUtils.evalReturn(front, this._domRender_proxy))) {
                const aIterable = this._rawSets.get(front);
                if (aIterable) {
                    this.render(Array.from(aIterable));
                }
            } else if (iterable) {
                this.render(Array.from(iterable));
            }
            // console.log('---targets->', fullPathStr)
            // this._targets.forEach(it => {
            //     if (it.nodeType === Node.DOCUMENT_FRAGMENT_NODE || it.nodeType === Node.ELEMENT_NODE) {
            //         const targets = eventManager.findAttrElements((it as DocumentFragment | Element), this.config);
            //         eventManager.changeVar(this._domRender_proxy, targets, `this.${fullPathStr}`)
            //     }
            // })
        }
    }

    public set(target: T, p: string | symbol, value: any, receiver: T): boolean {
        // console.log('set-->', p, target, value, receiver);
        if (typeof p === 'string') {
            value = this.proxy(target, value, p);
        }
        (target as any)[p] = value;
        if (typeof p === 'string') {
            this.root([p], value);
        }
        return true;
    }

    get(target: T, p: string | symbol, receiver: any): any {
        // console.log('get-->', target, p, receiver);
        if (p === '_DomRender_origin') {
            return this._domRender_origin;
        } else if (p === '_DomRender_ref') {
            return this._domRender_ref;
        } else if (p === '_DomRender_proxy') {
            return this;
        } else {
            return (target as any)[p]
        }
    }

    has(target: T, p: string | symbol): boolean {
        return p === '_DomRender_isProxy' || p in target;
    }

    proxy(parentProxy: T, obj: T | any, p: string) {
        if (obj !== undefined && obj !== null && typeof obj === 'object' && !('_DomRender_isProxy' in obj)) {
            // console.log('proxyyyyyyyy->', obj)
            const domRender = new DomRenderProxy(obj, undefined, this.config);
            domRender.addRef(parentProxy, p);
            const proxy = new Proxy(obj, domRender);
            domRender.run(proxy);
            return proxy
        } if (obj !== undefined && obj !== null && typeof obj === 'object' && ('_DomRender_isProxy' in obj)) {
            const d = (obj as any)._DomRender_proxy as DomRenderProxy<T>
            d.addRef(this._domRender_proxy!, p);
            return obj;
        } else {
            return obj;
        }
    }

    public addRef(parent: object, path: string) {
        if (!this._domRender_ref.get(parent)) {
            this._domRender_ref.set(parent, new Set<string>());
        }
        this._domRender_ref.get(parent)?.add(path)
    }

    public addRawSetAndRender(path: string, rawSet: RawSet) {
        this.addRawSet(path, rawSet);
        this.render([rawSet])
    }

    public addRawSet(path: string, rawSet: RawSet) {
        if (!this._rawSets.get(path)) {
            this._rawSets.set(path, new Set<RawSet>());
        }
        this._rawSets.get(path)?.add(rawSet)
    }

    public removeRawSet(raws: RawSet) {
        this._rawSets.forEach(it => {
            it.delete(raws)
        })
        this.garbageRawSet();
    }

    public garbageRawSet() {
        this._targets.forEach(it => {
            if (!it.isConnected) {
                this._targets.delete(it);
            }
        })

        this._rawSets.forEach(it => {
            it.forEach(sit => {
                if (!sit.isConnected) {
                    it.delete(sit);
                }
            })
        })
    }
}
