import {RootScope, TargetNode, TargetNodeMode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeObjectProxyHandler} from './proxys/ScopeObjectProxyHandler';
import {ConstructorType} from './types/Types';

export type RawSet = {template: string, styles?: string[]}
export class DomRender {
    public static compileSet<T>(window: Window, target: T, raws: RawSet, config?: Config, targetNode?: TargetNode, uuid = RandomUtils.uuid()): {target: T, rootScope: RootScope} {
        const proxy = DomRender.proxy(target, raws) as any;
        // '<scope dr-replace="this">'+raws.template+'</scope>'
        const scopeRaws = new ScopeRawSet(window, raws.template, raws.styles);
        const root = new RootScope(scopeRaws, proxy, uuid, config, targetNode);
        proxy?._ScopeObjectProxyHandler?.run(proxy, root);
        return {target: proxy, rootScope: root};
    }

    public static compileRootScope<T>(window: Window, target: T, raws: RawSet, config: Config, targetNode?: TargetNode, uuid = RandomUtils.uuid()): RootScope {
        return DomRender.compileSet(window, target, raws, config, targetNode, uuid).rootScope;
    }

    public static proxyObjectRender<T = any>(proxy: T, targetNode: TargetNode, config = new Config()) {
        if (!('_ScopeObjectProxyHandler_isProxy' in proxy)) {
            console.error('no Domrander Proxy Object -> var proxy = Domrender.proxy(target, ScopeRawSet)', proxy)
            throw new Error('no Domrander compile Object');
        }
        const raws = (proxy as any)._ScopeObjectProxyHandler_rawSet! as RawSet
        const rootScope = new RootScope(new ScopeRawSet(window, raws.template, raws.styles), proxy, RandomUtils.uuid(), config, targetNode);
        (proxy as any)?._ScopeObjectProxyHandler?.run(proxy, rootScope);
        // const targetObj = (proxy as any)._ScopeObjectProxyHandler_targetOrigin ?? proxy;
        rootScope.executeRender();
    }

    public static create<T>(target: T, raws: RawSet, excludeTyps: ConstructorType<any>[] = []): T {
        return this.proxy(target, raws, excludeTyps);
    }

    public static proxy<T>(target: T, raws: RawSet, excludeTyps: ConstructorType<any>[] = []): T {
        let proxy;
        if ('_ScopeObjectProxyHandler_isProxy' in target) {
            proxy = target;
        } else {
            // default wrapper
            // raws.template = `<scope dr-replace="this">${raws.template}</scope>`;
            proxy = new Proxy(target, new ScopeObjectProxyHandler(raws, target, excludeTyps));
        }
        return proxy;
    }

    public static render<T>(window: Window, target: T, raws: RawSet, config: Config, targetNode?: TargetNode): T {
        const dest = DomRender.compileSet(window, target, raws, config, targetNode);
        dest.rootScope.executeRender();
        return dest.target;
    }

    public static renderTarget<T>(target: T, window: Window, selector: string): T {
        const app = document.querySelector(selector)!
        const raw = {template: app.innerHTML};
        app.innerHTML = '';
        const targetNode = new TargetNode(app, TargetNodeMode.appendChild)
        const dest = DomRender.compileSet(window, target, raw, new Config(), targetNode);
        dest.rootScope.executeRender();
        return dest.target;
    }
}
