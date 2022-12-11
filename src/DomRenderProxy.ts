import {RawSet} from './rawsets/RawSet';
import {EventManager, eventManager} from './events/EventManager';
import {Config} from './configs/Config';
import {ScriptUtils} from './utils/script/ScriptUtils';
import {DomRenderFinalProxy, Shield} from './types/Types';
import {RawSetType} from './rawsets/RawSetType';
import {DrDictionary} from './operators/DrDictionary';

const excludeGetSetPropertys = ['onBeforeReturnGet', 'onBeforeReturnSet', '__domrender_components', '__render', '_DomRender_isFinal', '_domRender_ref', '_rawSets', '_domRender_proxy', '_targets', '_DomRender_origin', '_DomRender_ref', '_DomRender_proxy'];
export class DomRenderProxy<T extends object> implements ProxyHandler<T> {
    public _domRender_ref = new Map<object, Set<string>>()
    public _rawSets = new Map<string, Set<RawSet>>()
    public _domRender_proxy?: T;
    public _targets = new Set<Node>();

    constructor(public _domRender_origin: T, target: Node | null | undefined, public config: Config) {
        if (target) {
            this._targets.add(target);
        }
    }

    public static unFinal<T = any> (obj: T): T {
        return DomRenderFinalProxy.unFinal(obj)
    }

    public static final<T = any> (obj: T): T {
        return DomRenderFinalProxy.final(obj)
    }

    public static isFinal<T = any> (obj: T) {
        return DomRenderFinalProxy.isFinal(obj);
    }

    public run(objProxy: T) {
        this._domRender_proxy = objProxy;
        (objProxy as any)?.onProxyDomRender?.(this.config);
        const obj = (objProxy as any)._DomRender_origin;
        if (obj) {
            Object.keys(obj).forEach(it => {
                // console.log('key-------->', it)
                const target = (obj as any)[it];
                if (target !== undefined && target !== null && typeof target === 'object' && !DomRenderProxy.isFinal(target) && !Object.isFrozen(target) && !(obj instanceof Shield)) {
                    // console.log('target-------->', it, target);
                    // console.count('target')
                    // console.log('target-------->')
                    const filter = this.config.proxyExcludeTyps?.filter(it => target instanceof it) ?? []
                    if (filter.length === 0) {
                        // console.log('--------', objProxy, target, it)
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
        const onCreate = (target as any).getAttribute?.(RawSet.DR_ON_CREATE_ARGUMENTS_OPTIONNAME);
        let createParam: any[] = [];
        if (onCreate) {
            createParam = ScriptUtils.evalReturn(onCreate, this._domRender_proxy);
            if (!Array.isArray(createParam)) {
                createParam = [createParam];
            }
        }
        (this._domRender_proxy as any)?.onCreateRender?.(...createParam);

        const innerHTML = (target as any).innerHTML ?? '';
        this._targets.add(target);
        const rawSets = RawSet.checkPointCreates(target, this._domRender_proxy, this.config);
        // console.log('initRender -------rawSet', rawSets)
        // 중요 초기에 한번 튕겨줘야함.
        eventManager.applyEvent(this._domRender_proxy, eventManager.findAttrElements(target as Element, this.config), this.config);
        rawSets.forEach(it => {
            const variables = it.getUsingTriggerVariables(this.config);
            if (variables.size <= 0) {
                this.addRawSet('', it);
            } else {
                variables.forEach(sit => {
                    this.addRawSet(sit, it);
                })
            }
        })
        this.render(this.getRawSets()).then(it => {
            // const render = {target} as Render;
            // const creatorMetaData = {
            //     creator: this._domRender_proxy,
            //     rootCreator: this._domRender_proxy,
            //     innerHTML
            // } as CreatorMetaData;
            const onInit = (target as any).getAttribute?.(RawSet.DR_ON_INIT_ARGUMENTS_OPTIONNAME);
            let initParam: any[] = [];
            if (onCreate) {
                initParam = ScriptUtils.evalReturn(onCreate, this._domRender_proxy);
                if (!Array.isArray(initParam)) {
                    initParam = [initParam];
                }
            }
            (this._domRender_proxy as any)?.onInitRender?.(...initParam);
        });
    }

    public getRawSets() {
        const set = new Set<RawSet>();
        this._rawSets.forEach((v, k) => {
            v.forEach(it => set.add(it));
        });
        return Array.from(set);
    }

    // 중요 important
    public async render(raws?: RawSet[] | string, fullPathStr?: string) {
        if (typeof raws === 'string') {
            const iter = this._rawSets.get(raws);
            if (iter) {
                raws = Array.from(iter);
            } else {
                raws = undefined;
            }
        }
        const removeRawSets: RawSet[] = [];
        const rawSets = raws ?? this.getRawSets();

        for (const it of rawSets) {
            it.getUsingTriggerVariables(this.config).forEach(path => this.addRawSet(path, it))
            if (it.isConnected) {
                // 중요 render될때 targetAttribute 체크 해야함.
                const targetAttrMap = (it.point.node as Element)?.getAttribute?.(EventManager.normalAttrMapAttrName);
                if (it.detect?.action) {
                    it.detect.action();
                } else if (it.type === RawSetType.TARGET_ELEMENT && it.data && fullPathStr && targetAttrMap && (it.fragment as any).render) {
                    new Map<string, string>(JSON.parse(targetAttrMap)).forEach((v, k) => {
                        // it?.data.onChangeAttrRender(k, null, v);
                        const isUsing = EventManager.isUsingThisVar(v, `this.${fullPathStr}`);
                        if (isUsing) {
                            const render = (it.fragment as any).render as any;
                            // console.log('render-->', (it.fragment as any).render)
                            const script = `${render.renderScript} return ${v} `;
                            const cval = ScriptUtils.eval(script, Object.assign(this._domRender_proxy ?? {}, {__render: render}));
                            it.data.onChangeAttrRender(k, cval);
                        }
                        // console.log('---?', v, fullPathStr, isUsing);
                    });
                    // ------------------->
                } else {
                    const rawSets = await it.render(this._domRender_proxy, this.config);
                    // 그외 자식들 render
                    if (rawSets && rawSets.length > 0) {
                        await this.render(rawSets);
                    }
                }
            } else {
                removeRawSets.push(it);
            }
        }

        if (removeRawSets.length > 0) {
            this.removeRawSet(...removeRawSets)
        }
    }

    public root(paths: string[], value?: any, lastDoneExecute = true): string[] {
        // console.log('root--->', paths, value, this._domRender_ref, this._domRender_origin);
        const fullPaths: string[] = []
        if (this._domRender_ref.size > 0) {
            this._domRender_ref.forEach((it, key) => {
                if ('_DomRender_isProxy' in key) {
                    it.forEach(sit => {
                        try {
                            const items = (key as any)._DomRender_proxy?.root(paths.concat(sit), value, lastDoneExecute);
                            fullPaths.push(items.join(','));
                        } catch (e) {
                            // 오브젝트들 없어졌을수도있다 Destroy시점에서 오류나는경우가 있다. 따라서 참조 하는부분 없어져야한다.
                            // console.error(e)
                            // it.delete(sit);
                        }
                    })
                }
            })
        } else {
            // const firstPathStr = paths.slice(1).reverse().join('.');
            const strings = paths.reverse();
            // array같은경우도 키값으로 접근하기때문에 특정 인덱스를 찾아서 그부분만 바꿔줄수 있다.
            const fullPathStr = strings.map(it => isNaN(Number(it)) ? '.' + it : `[${it}]`).join('').slice(1);
            // console.log('-------fullPathStr', fullPathStr, lastDoneExecute);
            if (lastDoneExecute) {
                // const firstData = ScriptUtils.evalReturn('this.' + firstPathStr, this._domRender_proxy);
                // console.log('-------', firstPathStr, firstData);
                // if (firstData instanceof Dictionary) {
                // }

                const iterable = this._rawSets.get(fullPathStr);
                // array check
                const front = strings.slice(0, strings.length - 1).map(it => isNaN(Number(it)) ? '.' + it : `[${it}]`).join('');
                const last = strings[strings.length - 1];
                const data = ScriptUtils.evalReturn('this' + front, this._domRender_proxy);
                // console.log('-------!!!!!', fullPathStr, iterable, data, front, last);
                new Promise<void>(resolve => {
                    const firstPathStr = front.slice(1);
                    // console.log('-promise-------', firstPathStr, this)
                    const firstTargets = this._rawSets.get(firstPathStr);
                    const firstTargetDictionary: RawSet[] = [];
                    firstTargets?.forEach(it => {
                        // console.log('----forEach---', it);
                        const type = (it.point.start as Element).getAttribute?.('type');
                        if (type === 'dictionary') {
                            firstTargetDictionary.push(it)
                        }
                    })
                    if (firstTargetDictionary.length > 0) {
                        // console.log('ddddddddddd', firstTargetDictionary);

                        const rawSets: RawSet[] = [];
                        let skip = false;
                        firstTargetDictionary.forEach(it => {
                            const keys = (it.point.start as Element).getAttribute('dictionary-keys')?.split(',') ?? [];
                            if (!keys.includes(last)) {
                                const raws = DrDictionary.append(this._domRender_proxy, fullPathStr, last, it, this.config);
                                // console.log('----append---', raws);
                                if (raws) {
                                    rawSets.push(...raws);
                                }
                            } else {
                                skip = true;
                            }
                        });
                        if (skip === false || rawSets.length > 0) {
                            return this.render(rawSets);
                        }
                        // console.log('rawSets-->#$$$$$$$$$$$', this._rawSets);
                        // rawSets.forEach(it => this.addRawSet(fullPathStr, it));

                        // DrDictionary.append(this._domRender_proxy, fullPathStr, it, this.config);
                        // it.render(this._domRender_proxy, this.config);
                    }
                   /* if (data instanceof Dictionary) {
                        const a = this._rawSets.get(firstPathStr);
                        // a?.forEach(it => {
                        //     if (it.type === RawSetType.TARGET_ATTR)
                        // })
                        console.log('dictionary-->', data, last, value, this._rawSets, a);
                    } else */
                    if (last === 'length' && Array.isArray(data)) {
                        const aIterable = this._rawSets.get(firstPathStr);
                        if (aIterable) {
                            return this.render(Array.from(aIterable));
                        }
                    } else if (iterable) {
                        return this.render(Array.from(iterable), fullPathStr);
                    }
                }).then(it => {
                    console.log('target1------->,', it)
                    this._targets.forEach(it => {
                        console.log('target2------->,', it)
                        // return;
                        if (it.nodeType === Node.DOCUMENT_FRAGMENT_NODE || it.nodeType === Node.ELEMENT_NODE) {
                            const targets = eventManager.findAttrElements((it as DocumentFragment | Element), this.config);
                            // console.log('------>', targets);
                            eventManager.changeVar(this._domRender_proxy, targets, `this.${fullPathStr}`, this.config)
                        }
                    })
                })
            }
            fullPaths.push(fullPathStr);
        }
        return fullPaths;
    }

    public set(target: T, p: string | symbol, value: any, receiver: T): boolean {
        // console.log('set-->', p, value, target, receiver);
        if (typeof p === 'string' && p !== '__domrender_components' && excludeGetSetPropertys.includes(p)) {
            (target as any)[p] = value;
            return true;
        }
        // console.log('set proxy-->', target, p, value, this._rawSets, this._domRender_ref);
        // if (typeof p === 'string' && '__render' === p) {
        //     (target as any)[p] = value;
        //     return true;
        // }
        // console.log('set--?', p, target, value);

        if (typeof p === 'string') {
            value = this.proxy(receiver, value, p);
        }
        (target as any)[p] = value;
        let fullPath: undefined | string[];
        if (typeof p === 'string') {
            fullPath = this.root([p], value);
        }
        // console.log('full path:', fullPath);
        if (('onBeforeReturnSet' in receiver) && typeof p === 'string' && !(this.config.proxyExcludeOnBeforeReturnSets ?? []).concat(excludeGetSetPropertys).includes(p)) {
            (receiver as any)?.onBeforeReturnSet?.(p, value, fullPath);
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
            // Date라던지 이런놈들은-_-프록시가 이상하게 동작해서
            // console.log('--->', p, target, target.bind, 'bind' in target)
            // if ((p in target) && ('bind' in target)) {
            //     try{
            //     return (target as any)[p].bind(target);
            //     }catch (e) {
            //         console.error(e)
            //     }
            // } else {
            //     return (target as any)[p]
            // }
            // return (p in target) ? (target as any)[p].bind(target) : (target as any)[p]
            // console.log('-->', p, Object.prototype.toString.call((target as any)[p]), (target as any)[p])
            // return (target as any)[p]
            let it = (target as any)[p];
            if (it && typeof it === 'object' && ('_DomRender_isProxy' in it) && Object.prototype.toString.call(it._DomRender_origin) === '[object Date]') {
                it = it._DomRender_origin;
            }

            if (('onBeforeReturnGet' in receiver) && typeof p === 'string' && !(this.config.proxyExcludeOnBeforeReturnGets ?? []).concat(excludeGetSetPropertys).includes(p)) {
                (receiver as any)?.onBeforeReturnGet?.(p, it, this.root([p], it, false));
            }
            return it;
        }
    }

    deleteProperty(target: T, p: string | symbol): boolean {
        delete (target as any)[p];
        if (typeof p === 'string') {
            this.root([p]);
        }
        return true;
    }

    has(target: T, p: string | symbol): boolean {
        return p === '_DomRender_isProxy' || p in target;
    }

    proxy(parentProxy: T, obj: T | any, p: string) {
        const proxyTarget = (this.config.proxyExcludeTyps?.filter(it => obj instanceof it) ?? []).length <= 0;
        if (proxyTarget && obj !== undefined && obj !== null && typeof obj === 'object' && !('_DomRender_isProxy' in obj) && !DomRenderProxy.isFinal(obj) && !Object.isFrozen(obj) && !(obj instanceof Shield)) {
            const domRender = new DomRenderProxy(obj, undefined, this.config);
            domRender.addRef(parentProxy, p);
            const proxy = new Proxy(obj, domRender);
            domRender.run(proxy);
            return proxy
        }
        if (proxyTarget && obj !== undefined && obj !== null && typeof obj === 'object' && ('_DomRender_isProxy' in obj) && !DomRenderProxy.isFinal(obj) && !Object.isFrozen(obj) && !(obj instanceof Shield)) {
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
        // console.log('addRawSet--> path:', path, 'rawSet:', rawSet)
        if (!this._rawSets.get(path)) {
            this._rawSets.set(path, new Set<RawSet>());
        }
        this._rawSets.get(path)?.add(rawSet);
    }

    // public removeRawSet(...raws: RawSet[]) {
    //     this._rawSets.forEach(it => {
    //         raws.forEach(sit => it.delete(sit));
    //     })
    //     this.garbageRawSet();
    // }

    public removeRawSet(...raws: RawSet[]) {
        this._rawSets.forEach(it => {
            it.forEach(sit => {
                if (!sit.isConnected) {
                    it.delete(sit);
                } else if (raws.includes(sit)) {
                    it.delete(sit);
                }
            });
        })
        this.targetGarbageRawSet();
    }

    private targetGarbageRawSet() {
        this._targets.forEach(it => {
            if (!it.isConnected) {
                this._targets.delete(it);
            }
        })
    }

    private garbageRawSet() {
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
