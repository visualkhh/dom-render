export class ScopeOpjectProxy implements ProxyHandler<any> {
    constructor(public _origin: any) {
    }

    apply(target: any, thisArg: any, argArray?: any): any {
        return target.apply(thisArg, argArray);
    }

    has(target: any, key: PropertyKey): boolean {
        return key in target
    }

    set(target: any, p: string | symbol, value: any, receiver: any): boolean {
        // console.log('set--->', target, p, value, receiver)
        this._origin[p] = value;
        target[p] = value;
        return true;
    }

    get(target: any, name: string | symbol, receiver: any): any {
        // console.log('get--->', target, p, receiver)
        if (name === '_ScopeOpjectProxy_targetOrigin') {
            return this._origin;
        } else {
            return target[name] ?? this._origin[name];
        }
    }
}
