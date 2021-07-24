import {RootScope, TargetNode, TargetNodeMode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeObjectProxyHandler} from './proxys/ScopeObjectProxyHandler';

export type RawSet = {template: string, styles?: string[]}
export class DomRender {
    public static compileSet<T>(document: Document, target: T, raws: RawSet, config?: Config, targetNode?: TargetNode, uuid = RandomUtils.uuid()): {target: T, rootScope: RootScope} {
        const proxy = DomRender.proxy(target, raws) as any;
        const scopeRaws = new ScopeRawSet(document, raws.template, raws.styles);
        const root = new RootScope(scopeRaws, proxy, uuid, config, targetNode);
        proxy?._ScopeObjectProxyHandler?.run(proxy, target, root);
        return {target: proxy, rootScope: root};
    }

    public static compileRootScope<T>(document: Document, target: T, raws: RawSet, config: Config, targetNode?: TargetNode, uuid?: string): RootScope {
        return DomRender.compileSet(document, target, raws, config, targetNode, uuid).rootScope;
    }

    public static proxy<T>(target: T, raws: RawSet): T {
        let proxy;
        if ('_ScopeObjectProxyHandler_isProxy' in target) {
            proxy = target;
        } else {
            proxy = new Proxy(target, new ScopeObjectProxyHandler(raws));
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
