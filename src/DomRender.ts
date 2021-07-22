import {RootScope, TargetNode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeObjectProxyHandler} from './proxys/ScopeObjectProxyHandler';

export class DomRender {
    // public root: RootScope | undefined;
    // private config: Config;
    // private rootUUID: string;
    //
    // constructor(raws: ScopeRawSet, uuid?: string);
    // constructor(raws: ScopeRawSet, config?: Config);
    // constructor(raws: ScopeRawSet, config?: Config, uuid?: string);
    // constructor(public raws: ScopeRawSet, private uuidAndConfig?: string | Config, uuid?: string) {
    //     if (typeof uuidAndConfig === 'string') {
    //         this.config = new Config();
    //         this.rootUUID = uuidAndConfig;
    //     } else if (uuidAndConfig instanceof Config) {
    //         this.config = uuidAndConfig;
    //         this.rootUUID = uuid ?? RandomUtils.uuid();
    //     } else {
    //         this.config = new Config();
    //         this.rootUUID = RandomUtils.uuid();
    //     }
    // }

    // compile(target: any, targetNode?: TargetNode): RootScope {
    //     this.root = new RootScope(this.raws, target, this.rootUUID, this.config, targetNode);
    //     return this.root;
    // }

    public static compileSet<T>(target: T, raws: ScopeRawSet, config?: Config, targetNode?: TargetNode, uuid = RandomUtils.uuid()): {target: T, rootScope: RootScope} {
        const proxy = DomRender.proxy(target, raws) as any;
        const root = new RootScope(raws, proxy, uuid, config, targetNode);
        proxy?._ScopeObjectProxyHandler?.run(proxy, target, root);
        return {target: proxy, rootScope: root};
    }

    public static compile<T>(target: T, raws: ScopeRawSet, config?: Config, targetNode?: TargetNode): T {
        return DomRender.compileSet(target, raws, config, targetNode).target;
    }

    public static compileRootScope<T>(target: T, raws: ScopeRawSet, config: Config, targetNode?: TargetNode, uuid?: string): RootScope {
        return DomRender.compileSet(target, raws, config, targetNode, uuid).rootScope;
    }

    public static proxy<T>(target: T, raws: ScopeRawSet): T {
        let proxy;
        if ('_ScopeObjectProxyHandler_isProxy' in target) {
            proxy = target;
        } else {
            proxy = new Proxy(target, new ScopeObjectProxyHandler(raws));
        }
        return proxy;
    }

    public static render<T>(target: T, raws: ScopeRawSet, config: Config, targetNode?: TargetNode): T {
        const dest = DomRender.compileSet(target, raws, config, targetNode);
        dest.rootScope.executeRender();
        return dest.target;
    }

    // run<T>(target: T, targetNode?: TargetNode): T {
    //     let proxy;
    //     if ('_ScopeObjectProxyHandler_isProxy' in target) {
    //         proxy = target;
    //     } else {
    //         proxy = new Proxy(target, new ScopeObjectProxyHandler());
    //     }
    //     this.root = this.compile(proxy, targetNode);
    //     // this.root = new RootScope(this.raws, proxy, this.rootUUID, this.config, targetNode);
    //     proxy?._ScopeObjectProxyHandler?.run(proxy, target, this.root);
    //
    //     return proxy;
    // }
    //
    // runToRootScope(target: any, targetNode?: TargetNode): RootScope | undefined {
    //     this.run(target, targetNode);
    //     return this.root;
    // }
    //
    // runSet(target: any, targetNode?: TargetNode) {
    //     const proxyTarget = this.run(target, targetNode);
    //     return {rootScope: this.root, obj: proxyTarget}
    // }
    //
    // runRender<T>(target: T, targetNode?: TargetNode, option?: ScopeOption): T {
    //     const t = this.run(target, targetNode);
    //     this.root?.executeRender(option);
    //     // console.log('runRender-->rootScope', this.root?.scopeResult)
    //     return t;
    // }

    // runFragment<T>(target: T, targetNode?: TargetNode, option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}): T {
    //     const t = this.run(target, targetNode);
    //     this.root?.executeFragment(option);
    //     return t;
    // }
    // executeFragment(option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}) {
    //     this.root?.executeFragment(option)
    // }
}
