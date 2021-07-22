import {Config} from '../Config';
import {ScopeRawSet} from '../ScopeRawSet';
import {DomRender} from '../DomRender';
import {ScopeObjectProxyHandler} from '../proxys/ScopeObjectProxyHandler';
import {RootScope, TargetNode} from '../RootScope';

export class ScopeFectory {
    constructor(public obj: any, public raws: ScopeRawSet, public config: Config) {
        this.obj = new Proxy(obj, new ScopeObjectProxyHandler())
    }

    createRootScopeRun(uuid: string, tartNode?: TargetNode): RootScope | undefined {
        const domRender = new DomRender(this.raws, this.config, uuid);
        return domRender.runToRootScope(this.obj, tartNode)
    }

    // containUUID(uuid: string) {
    //     const rootScope = this.obj?._ScopeObjectProxyHandler_rootScopes.filter((it: RootScope) => it.uuid === uuid);
    //     return rootScope;
    // }

    executeFragment(uuid: string) {
        const rootScope = this.obj?._ScopeObjectProxyHandler_rootScopes.filter((it: RootScope) => it.uuid === uuid)[0]
        // console.log('--------------fectory', uuid, rootScope, this.obj)
        const rootScope1 = rootScope as RootScope;
        console.log(rootScope1, this.obj);
        return rootScope1?.executeFragment();
    }
}
