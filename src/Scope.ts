import {ScopeObject} from './ScopeObject';
import {ScopePosition} from './ScopePosition';
import {ScopeResultSet} from './ScopeResultSet';
import {RandomUtils} from './utils/random/RandomUtils';
import {Config} from './Config';
import {ScopeOpjectProxy} from './proxys/ScopeOpjectProxy';

export class Scope {
    public childs: Scope[] = [];
    public usingVars: string[] = [];
    public scopeResult?: ScopeResultSet;

    constructor(public raws: string, public obj: any, public uuid = RandomUtils.uuid(), public config = new Config(), private position = new ScopePosition(0, raws.length)) {
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
        let scopeObject = this.config.factoryScopeObject ? this.config.factoryScopeObject(this) : new ScopeObject(this.config);
        scopeObject = (scopeObject ?? new ScopeObject(this.config));
        // scopeObject.eval(this.raws, obj);
        // console.log('objjjjjjj->', obj)
        // debugger;
        // console.log('------>', Object.create(scopeObject, obj))

        scopeObject._originObj = obj;
        // let object = Object.assign(scopeObject, obj) as ScopeObject
        const object = new Proxy(scopeObject, new ScopeOpjectProxy(obj))
        // console.log('exe', obj, object)
        // console.log('exe - test', obj.test, object.test)
        this.scopeResult = object.executeResultSet(this.raws); // , this.uuid
        if (obj.onScopeMaked) {
            obj.onScopeMaked(this);
        }
        return {object, result: this.scopeResult!};
    }

    private run(): Scope {
        const targetRaws = this.raws;
        this.usingVars = Scope.usingThisVar(targetRaws);
        let i = this.indexOf(targetRaws, this.config.start);
        while (i !== -1) {
            const startIdx = i;
            let endIdx = this.tailIndexOf(targetRaws, this.config.end, i);
            while (endIdx !== -1) {
                const sub = targetRaws.substring(startIdx, endIdx);
                const matchStart = sub.match(RegExp(this.config.start, 'gm')) || [];
                const matchEnd = sub.match(RegExp(this.config.end, 'gm')) || [];
                if (matchStart.length === matchEnd.length) {
                    const scope = new Scope(sub.substring(this.config.start.length, sub.length - this.config.end.length), this.obj, RandomUtils.uuid(), this.config, new ScopePosition(startIdx, endIdx));
                    this.childs.push(scope);
                    break;
                }
                endIdx = this.tailIndexOf(targetRaws, this.config.end, endIdx);
            }

            if (endIdx !== -1) {
                i = this.indexOf(targetRaws, this.config.start, endIdx)
            } else {
                break;
            }
        }
        return this;
    }

    public indexOf(data: string, searchString: string, position?: number): number {
        return data.indexOf(searchString, position);
    }

    public tailIndexOf(data: string, searchString: string, position?: number): number {
        const number = data.indexOf(searchString, position);
        return number !== -1 ? number + searchString.length : number;
    }

    public static usingThisVar(raws: string): string[] {
        const regex = /["'].*["']/gm;
        raws = raws.replace(regex, '');
        const varRegexStr = 'this\\.([a-zA-Z_$][a-zA-Z_.$0-9]*)';
        const varRegex = RegExp(varRegexStr, 'gm');
        let varExec = varRegex.exec(raws)
        const usingVars = [];
        while (varExec) {
            usingVars.push(varExec[1]);
            varExec = varRegex.exec(varExec.input)
        }
        return usingVars;
    }
}
