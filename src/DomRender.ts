import {RootScope, TargetNode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeObjectProxyHandler} from './proxys/ScopeObjectProxyHandler';

export type RawSet = {template: string, styles: string[]}
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

    public static compileSet<T>(document: Document, target: T, raws: RawSet, config?: Config, targetNode?: TargetNode, uuid = RandomUtils.uuid()): {target: T, rootScope: RootScope} {
        const proxy = DomRender.proxy(target, raws) as any;
        const scopeRaws = new ScopeRawSet(document, raws.template, raws.styles);
        const root = new RootScope(scopeRaws, proxy, uuid, config, targetNode);
        proxy?._ScopeObjectProxyHandler?.run(proxy, target, root);
        return {target: proxy, rootScope: root};
    }

    // public static compile<T>(target: T, raws: ScopeRawSet, config?: Config, targetNode?: TargetNode): T {
    //     return DomRender.compileSet(target, raws, config, targetNode).target;
    // }

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
