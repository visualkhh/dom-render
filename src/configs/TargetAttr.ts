import {RawSet} from '../rawsets/RawSet';

export type TargetAttr = {
    name: string;
    callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment;
    complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void;
};