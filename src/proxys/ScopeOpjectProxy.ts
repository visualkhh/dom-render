export class ScopeOpjectProxy implements ProxyHandler<any> {
    constructor(public origin: any) {
    }

    apply(target: any, thisArg: any, argArray?: any): any {
        return target.apply(thisArg, argArray);
    }

    has(target: any, key: PropertyKey): boolean {
        return key in target
    }

    set(target: any, p: string | symbol, value: any, receiver: any): boolean {
        // console.log('set--->', target, p, value, receiver)
        this.origin[p] = value;
        target[p] = value;
        return true;
    }

    get(target: any, p: string | symbol, receiver: any): any {
        // console.log('get--->', target, p, receiver)
        return target[p] ?? this.origin[p];
    }
}
