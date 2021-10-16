import {ConstructorType} from './types/Types';
import {RawSet} from './RawSet';
// import {CustomElementDefinitionOptions} from './utils/dom/WebComponentUtils';

export type TargetElement = {
    name: string,
    template?: string,
    styles?: string[],
    callBack: (target: Element, obj: any, rawSet: RawSet) => DocumentFragment,
    complete?: (target: Element, obj: any, rawSet: RawSet) => void
};

export type TargetAttr = {
    name: string,
    callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment,
    complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void
};

export interface Config {
    targetElements?: TargetElement[];
    targetAttrs?: TargetAttr[];
    onElementInit?: (name: string, obj: any, rawSet: RawSet) => void;
    onAttrInit?: (name: string, attrValue: string, obj: any, rawSet: RawSet) => void;
    proxyExcludeTyps?: ConstructorType<any>[];
    proxyExcludeOnBeforeReturnSets?: string[];
    proxyExcludeOnBeforeReturnGets?: string[];
    scripts?: { [n: string]: any };
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
