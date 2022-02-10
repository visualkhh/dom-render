import {ConstructorType} from './types/Types';
import { CreatorMetaData, RawSet, Render } from './RawSet';

export type TargetElement = {
    name: string;
    template?: string;
    styles?: string[];
    callBack: (target: Element, obj: any, rawSet: RawSet) => DocumentFragment;
    complete?: (target: Element, obj: any, rawSet: RawSet) => void;
    __render?: Render;
    __creatorMetaData?: CreatorMetaData;
};

export type TargetAttr = {
    name: string;
    callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment;
    complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void;
};

export interface Config {
    window: Window;
    targetElements?: TargetElement[];
    targetAttrs?: TargetAttr[];
    onElementInit?: (name: string, obj: any, rawSet: RawSet, targetElement: TargetElement) => any;
    onAttrInit?: (name: string, attrValue: string, obj: any, rawSet: RawSet) => any;
    proxyExcludeTyps?: ConstructorType<any>[];
    proxyExcludeOnBeforeReturnSets?: string[];
    proxyExcludeOnBeforeReturnGets?: string[];
    scripts?: { [n: string]: any };
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
