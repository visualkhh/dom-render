import {ScopeObject} from './ScopeObject';
import {ScopeResultSet} from './ScopeResultSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeOpjectProxy} from './proxys/ScopeOpjectProxy';
import {ScopeRawSet} from './ScopeRawSet';

export class Scope {
    public childs: Scope[] = [];
    public scopeResult?: ScopeResultSet;

    constructor(public raws: ScopeRawSet, public obj: any, public uuid = RandomUtils.uuid(), public config = new Config()) {
        this.run();
    }

    childIsContain() {
        for (let i = 0; i < this.childs.length; i++) {
            if (this.childs[i].scopeResult?.startComment.isConnected) {
                return true;
            }
        }
        return false;
    }

    exec(obj: any = this.obj) {
        let scopeObject = this.config.factoryScopeObject ? this.config.factoryScopeObject(this) : new ScopeObject(this);
        scopeObject = (scopeObject ?? new ScopeObject(this));
        // scopeObject.eval(this.raws, obj);
        // console.log('objjjjjjj->', obj)
        // debugger;
        // console.log('------>', Object.create(scopeObject, obj))

        scopeObject._originObj = obj;
        // let object = Object.assign(scopeObject, obj) as ScopeObject
        const object = new Proxy(scopeObject, new ScopeOpjectProxy(obj))
        // console.log('exe', obj, object)
        // console.log('exe - test', obj.test, object.test)
        // console.log('--this script', this.raws.getScopeCommentData())
        this.scopeResult = object.executeResultSet(this.raws.getScopeCommentData()); // , this.uuid
        this.scopeResult?.applyEvent();
        if (obj.onScopeMaked) {
            obj.onScopeMaked(this);
        }
        return {object, result: this.scopeResult!};
    }

    private run(): Scope {
        const nodeIterator = this.raws.findScopeComment();
        let node: Node | null;
        // eslint-disable-next-line no-cond-assign
        while (node = nodeIterator.nextNode()) {
            // console.log('node Iterator-->', node, node.nodeType)
            // const targetNode = node as Comment;
            const scopeRawSet = new ScopeRawSet(this.raws.document, node)
            const scope = new Scope(scopeRawSet, this.obj, RandomUtils.uuid(), this.config);
            // const script = scope.raws.getScopeCommentScript();
            // console.log('nodeIterator-->', script, scopeRawSet.usingVars, scopeRawSet, scope)
            this.childs.push(scope);
        }
        return this;
    }

    // public indexOf(data: string, searchString: string, position?: number): number {
    //     return data.indexOf(searchString, position);
    // }
    //
    // public tailIndexOf(data: string, searchString: string, position?: number): number {
    //     const number = data.indexOf(searchString, position);
    //     return number !== -1 ? number + searchString.length : number;
    // }
}
