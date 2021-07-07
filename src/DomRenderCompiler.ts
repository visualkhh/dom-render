import {RootScope, TargetNode} from './RootScope';
import {ScopeRawSet} from './ScopeRawSet';
import {RandomUtils} from './utils/random/RandomUtils';

export class DomRenderCompiler {
    public root: RootScope | undefined;
    constructor(public raws: ScopeRawSet, private obj: any, private rootUUID = RandomUtils.uuid(), public config = {start: '<!--%', end: '%-->'}) {
    }

    run(targetNode?: TargetNode): DomRenderCompiler {
        this.root = new RootScope(this.raws, this.obj, this.rootUUID, this.config);
        if (targetNode) {
            this.root.targetNode = targetNode;
        }
        return this;
    }

    // executeFragment(option?: {head?: Node, tail?: Node, childElementAttr?: Map<string, string>}) {
    //     this.root?.executeFragment(option)
    // }
}
