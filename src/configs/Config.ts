import {ConstructorType} from '../types/Types';
import {RawSet} from '../rawsets/RawSet';
import {Router} from '../routers/Router';
import {Messenger} from '../messenger/Messenger';
import {TargetElement} from './TargetElement';
import {TargetAttr} from './TargetAttr';

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
