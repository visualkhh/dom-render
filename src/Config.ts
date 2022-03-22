import {ConstructorType} from './types/Types';
import {Attrs, CreatorMetaData, RawSet, Render} from './RawSet';
import {Router} from './routers/Router';
import {Messenger} from './messenger/Messenger';

export type TargetElement = {
    name: string;
    template?: string;
    styles?: string[];
    callBack: (target: Element, obj: any, rawSet: RawSet, attrs?: Attrs) => DocumentFragment;
    complete?: (target: Element, obj: any, rawSet: RawSet) => void;
    __render?: Render;
    __creatorMetaData?: CreatorMetaData;
};

export type TargetAttr = {
    name: string;
    callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment;
    complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void;
};

export type Config = {
    window: Window;
    targetElements?: TargetElement[];
    targetAttrs?: TargetAttr[];
    onElementInit?: (name: string, obj: any, rawSet: RawSet, targetElement: TargetElement) => any;
    onAttrInit?: (name: string, attrValue: string, obj: any, rawSet: RawSet) => any;
    proxyExcludeTyps?: ConstructorType<any>[];
    proxyExcludeOnBeforeReturnSets?: string[];
    proxyExcludeOnBeforeReturnGets?: string[];
    scripts?: { [n: string]: any };
    routerType?: 'hash' | 'path' | 'none';
    router?: Router;
    messenger?: Messenger;
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
