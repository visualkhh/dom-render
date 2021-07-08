import {RootScope, TargetNode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeObjectProxyHandler} from './ScopeObjectProxyHandler';

export class DomRender {
    public root: RootScope | undefined;
    private rootUUID: string;
    private config: Config;

    constructor(raws: ScopeRawSet, rootUUID?: string);
    constructor(raws: ScopeRawSet, config?: Config);
    constructor(public raws: ScopeRawSet, private uuidAndConfig?: string | Config) {
        if (typeof uuidAndConfig === 'string') {
            this.rootUUID = uuidAndConfig;
            this.config = new Config();
        } else if (uuidAndConfig instanceof Config) {
            this.rootUUID = RandomUtils.uuid();
            this.config = uuidAndConfig;
        } else {
            this.rootUUID = RandomUtils.uuid();
            this.config = new Config();
        }
    }

    run<T>(target: T, targetNode?: TargetNode): T {
        this.root = new RootScope(this.raws, target, this.rootUUID, this.config);
        if (targetNode) {
            this.root.targetNode = targetNode;
        }

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
