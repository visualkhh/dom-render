import {ConstructorType} from './types/Types';

export interface Config {
    targetElements?: { name: string, callBack: (target: Element, obj: any) => DocumentFragment, complete?:(target: Element, obj: any) => void}[];
    targetAttrs?: { name: string, callBack: (target: Element, attrValue: string, obj: any) => DocumentFragment, complete?:(target: Element, attrValue: string, obj: any) => void}[];
    onElementInit?:(name: string, obj: any) => void;
    onAttrInit?:(name: string, attrValue: string, obj: any) => void;
    proxyExcludeTyps?: ConstructorType<any>[];
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
