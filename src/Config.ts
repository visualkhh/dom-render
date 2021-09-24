import {ConstructorType} from './types/Types';
import { RawSet } from './RawSet';

export type TargetElement = { name: string, callBack: (target: Element, obj: any, rawSet: RawSet) => DocumentFragment, complete?: (target: Element, obj: any, rawSet: RawSet) => void };
export type TargetAttr = { name: string, callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment, complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void };

export interface Config {
    targetElements?: TargetElement[];
    targetAttrs?: TargetAttr[];
    onElementInit?:(name: string, obj: any, rawSet: RawSet) => void;
    onAttrInit?:(name: string, attrValue: string, obj: any, rawSet: RawSet) => void;
    proxyExcludeTyps?: ConstructorType<any>[];
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
