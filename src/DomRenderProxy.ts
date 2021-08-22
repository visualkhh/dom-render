import {RawSet} from './RawSet';

export type RefType = { obj: object };

export class DomRenderProxy<T extends object> implements ProxyHandler<T> {
    public _domRender_ref = new Map<object, Set<string>>()
    public _rawSets = new Map<string, Set<RawSet>>()
    public _domRender_proxy?: T;

    // public _rawsSetAll: RawSet[] = [];
    constructor(public _domRender_origin: T, public target?: Node) {

    }

    public run(objProxy: T) {
        this._domRender_proxy = objProxy;
        const obj = (objProxy as any)._DomRender_origin;
        if (obj) {
            Object.keys(obj).forEach(it => {
                // console.log(obj, it, (obj as any)[it]);
                const proxyAfter = this.proxy(objProxy, (obj as any)[it], it);
                (obj as any)[it] = proxyAfter;
            })
        }

        if (this.target) {
            // RawSet.targetPintCheckNodes(this.target);
            // const nodeIterator = RawSet.targetNodeIterator(this.target);
            // let currentNode;
            // // eslint-disable-next-line no-cond-assign
            // while (currentNode = nodeIterator.nextNode()) {
            //     console.log('--->', currentNode, nodeIterator.pointerBeforeReferenceNode)
            // }

            const rawSets = RawSet.checkPointCreates(this.target);
            console.log('domRender start run -> ', rawSets)
            rawSets.forEach(it => {
                const strings = it.usingTriggerVariables;
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
            // this._rawsSetAll.push()
            //     console.log('fragment->', rawSets);
            //     console.log('---**-->', raws)
        }
    }

    public render(raws: RawSet[]) {
        raws.forEach(it => {
            console.log('render--->', raws, it.point.start.isConnected, it.point.start.isConnected)
            it.usingTriggerVariables.forEach(path => this.addRawSet(path, it))
            if (it.point.start.isConnected && it.point.start.isConnected) {
                const rawSets = it.render(this._domRender_proxy);
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
            for (let i = strings.length; i >= 0; i--) {
                const pathString = strings.slice(0, i).join('.');
                // const pathString = strings.join('.');
                console.log('change var path', value, pathString, this._rawSets.get(pathString))

                const iterable = this._rawSets.get(pathString);
                if (iterable) {
                    this.render(Array.from(iterable));
                    break;
                }
            }
        }
    }

    // public createAddTemplate(target: Element) {
    //     const point = document.createComment('');
    //     target.before(point)
    //     this.replaceTemplate(point, this.createTemplate(target));
    // }
    //
    // public createTemplate(target: Element): HTMLTemplateElement {
    //     const template = document.createElement('template')
    //     template.content.append(target);
    //     return template;
    // }
    //
    // public replaceTemplate(target: Node, template: HTMLTemplateElement) {
    //     // console.log(template.innerHTML)
    //     target.parentNode?.replaceChild(template, target);
    // }

    public set(target: T, p: string | symbol, value: any, receiver: T): boolean {
        // console.log('set-->', target, p, value, receiver);
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
        } else
            // if (p === '_DomRender_selector') {
            //     return this.selector;
            // }
        if (p === '_DomRender_ref') {
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
        // console.log('proxy-->', p)
        // const ignoreFields = ['_domRender_ref'];
        // if (ignoreFields.includes(p)) {
        //     return obj;
        // }
        if (obj !== undefined && obj !== null && typeof obj === 'object' && !('_DomRender_isProxy' in obj)) {
            const domRender = new DomRenderProxy(obj);
            domRender.addRef(parentProxy, p);
            const proxy = new Proxy(obj, domRender);
            domRender.run(proxy);
            return proxy
            // } else if (obj !== undefined && obj !== null && typeof obj === 'object' && ('_DomRender_isProxy' in obj)) {
            //     const d = (obj as any)._DomRender_proxy as DomRender<T>
            //     d.addRef(parent, p);
            //     return obj;
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
    }
}
