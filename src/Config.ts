import {ConstructorType} from './types/Types';

export interface Config {
    targets?: { attrName: string, callBack: (target: Element, attrValue: string, obj: any) => DocumentFragment }[];
    proxyExcludeTyps?: ConstructorType<any>[];
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
