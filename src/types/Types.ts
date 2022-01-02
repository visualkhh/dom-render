import { RawSet } from '../RawSet';
import { TargetElement } from 'src/Config';

export interface ConstructorType<T> {
    new(...args: any[]): T;
}
export class Shield {
    [name: string]: any
}




export class DomRenderFinalProxy<T extends object> implements ProxyHandler<T> {
    set(target: T, p: string | symbol, value: any, receiver: any): boolean {
        (target as any)[p] = value;
        return true;
    }

    get(target: T, p: string | symbol, receiver: any): any {
        return (target as any)[p];
    }

    public static final<T = any> (obj: T): T {
        (obj as any)._DomRender_isFinal = true;
        return obj;
    }

    public static isFinal<T = any> (obj: T) {
        return '_DomRender_isFinal' in obj;
    }

    public static unFinal<T = any> (obj: T): T {
        delete (obj as any)._DomRender_isFinal;
        return obj;
    }

    has(target: T, p: string | symbol): boolean {
        return p === '_DomRender_isFinal' || p in target;
    }
}
