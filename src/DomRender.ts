import {RootScope, TargetNode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeObjectProxyHandler} from './ScopeObjectProxyHandler';

export class DomRender {
    public root: RootScope | undefined;
    private config: Config;
    private rootUUID: string;

    constructor(raws: ScopeRawSet, uuid?: string);
    constructor(raws: ScopeRawSet, config?: Config);
    constructor(raws: ScopeRawSet, config?: Config, uuid?: string);
    constructor(public raws: ScopeRawSet, private uuidAndConfig?: string | Config, uuid?: string) {
        if (typeof uuidAndConfig === 'string') {
            this.config = new Config(document);
            this.rootUUID = uuidAndConfig;
        } else if (uuidAndConfig instanceof Config) {
            this.config = uuidAndConfig;
            this.rootUUID = uuid ?? RandomUtils.uuid();
        } else {
            this.config = new Config(document);
            this.rootUUID = RandomUtils.uuid();
        }
    }

    compile(target: any, targetNode?: TargetNode): RootScope {
        this.root = new RootScope(this.raws, target, this.rootUUID, this.config, targetNode);
        return this.root;
    }

    run<T>(target: T, targetNode?: TargetNode): T {
        this.root = new RootScope(this.raws, target, this.rootUUID, this.config, targetNode);

        const proxy = new Proxy(target, new ScopeObjectProxyHandler());
        proxy?._ScopeObjectProxyHandler?.run(proxy, target, this.root);
        return proxy;
    }

    runRender<T>(target: T, targetNode?: TargetNode, option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}): T {
        const t = this.run(target, targetNode);
        this.root?.executeRender(option);
        return t;
    }

    // runFragment<T>(target: T, targetNode?: TargetNode, option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}): T {
    //     const t = this.run(target, targetNode);
    //     this.root?.executeFragment(option);
    //     return t;
    // }
    // executeFragment(option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}) {
    //     this.root?.executeFragment(option)
    // }
}
