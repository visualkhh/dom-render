import {RootScope, TargetNode, TargetNodeMode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeObjectProxyHandler} from './proxys/ScopeObjectProxyHandler';
import { ConstructorType } from '../../simple-boot-core/dist/types/Types';

export type RawSet = {template: string, styles?: string[]}
export class DomRender {
    public static compileSet<T>(document: Document, target: T, raws: RawSet, config?: Config, targetNode?: TargetNode, uuid = RandomUtils.uuid()): {target: T, rootScope: RootScope} {
        const proxy = DomRender.proxy(target, raws) as any;
        const scopeRaws = new ScopeRawSet(document, raws.template, raws.styles);
        const root = new RootScope(scopeRaws, proxy, uuid, config, targetNode);
        proxy?._ScopeObjectProxyHandler?.run(proxy, root);
        return {target: proxy, rootScope: root};
    }

    public static compileRootScope<T>(document: Document, target: T, raws: RawSet, config: Config, targetNode?: TargetNode, uuid?: string): RootScope {
        return DomRender.compileSet(document, target, raws, config, targetNode, uuid).rootScope;
    }

    public static proxyObjectRender<T = any>(proxy: T, targetNode: TargetNode, config = new Config()) {
        if (!('_ScopeObjectProxyHandler_isProxy' in proxy)) {
            console.error('no Domrander Proxy Object -> var proxy = Domrender.proxy(target, ScopeRawSet)', proxy)
            throw new Error('no Domrander compile Object');
        }
        const raws = (proxy as any)._ScopeObjectProxyHandler_rawSet! as RawSet
        const rootScope = new RootScope(new ScopeRawSet(document, raws.template, raws.styles), proxy, RandomUtils.uuid(), config, targetNode);
        (proxy as any)?._ScopeObjectProxyHandler?.run(proxy, rootScope);
        let targetObj = (proxy as any)._ScopeObjectProxyHandler_targetOrigin ?? proxy;
        rootScope.executeRender();
    }

    public static proxy<T>(target: T, raws: RawSet, excludeTyps: ConstructorType<any>[] = []): T {
        let proxy;
        if ('_ScopeObjectProxyHandler_isProxy' in target) {
            proxy = target;
        } else {
            proxy = new Proxy(target, new ScopeObjectProxyHandler(raws, target, excludeTyps));
        }
        return proxy;
    }

    public static render<T>(document: Document, target: T, raws: RawSet, config: Config, targetNode?: TargetNode): T {
        const dest = DomRender.compileSet(document, target, raws, config, targetNode);
        dest.rootScope.executeRender();
        return dest.target;
    }

    public static renderTarget<T>(target: T, document: Document, selector: string): T {
        const app = document.querySelector(selector)!
        const raw = {template: app.innerHTML};
        app.innerHTML = '';
        const targetNode = new TargetNode(app, TargetNodeMode.appendChild)
        const dest = DomRender.compileSet(document, target, raw, new Config(), targetNode);
        dest.rootScope.executeRender();
        return dest.target;
    }
}
