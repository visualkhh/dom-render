import {ConstructorType} from './types/Types';
import { RawSet } from 'RawSet';

export type TargetElement = { name: string, callBack: (target: Element, obj: any, rawSet: RawSet) => DocumentFragment, complete?: (target: Element, obj: any) => void };
export type TargetAttr = { name: string, callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment, complete?: (target: Element, attrValue: string, obj: any) => void };

export interface Config {
    targetElements?: TargetElement[];
    targetAttrs?: TargetAttr[];
    onElementInit?:(name: string, obj: any) => void;
    onAttrInit?:(name: string, attrValue: string, obj: any) => void;
    proxyExcludeTyps?: ConstructorType<any>[];
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
