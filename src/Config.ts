import {ConstructorType} from './types/Types';
import {RawSet, Render} from './RawSet';

export type TargetElement = {
    name: string,
    template?: string,
    styles?: string[],
    callBack: (target: Element, obj: any, rawSet: RawSet) => DocumentFragment,
    complete?: (target: Element, obj: any, rawSet: RawSet) => void
    __render?: Render
};

export type TargetAttr = {
    name: string,
    callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment,
    complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void
};

export interface Config {
    window: Window;
    targetElements?: TargetElement[];
    targetAttrs?: TargetAttr[];
    onElementInit?: (name: string, obj: any, rawSet: RawSet, targetElement: TargetElement) => void;
    onAttrInit?: (name: string, attrValue: string, obj: any, rawSet: RawSet) => void;
    proxyExcludeTyps?: ConstructorType<any>[];
    proxyExcludeOnBeforeReturnSets?: string[];
    proxyExcludeOnBeforeReturnGets?: string[];
    scripts?: { [n: string]: any };
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
