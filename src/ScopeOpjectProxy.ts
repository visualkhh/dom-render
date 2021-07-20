export class ScopeOpjectProxy implements ProxyHandler<any> {
    constructor(public origin: any) {
    }

    apply(target: any, thisArg: any, argArray?: any): any {
        return target.apply(thisArg, argArray);
    }

    has(target: any, key: PropertyKey): boolean {
        return key in target
    }

    get(target: any, p: string | symbol, receiver: any): any {
        return target[p] ?? this.origin[p];
    }
}
