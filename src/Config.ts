// import {Scope} from './Scope';
// import {ScopeObject} from './ScopeObject';
//
// export type ScopeObjectFactory = (scope: Scope) => ScopeObject;
// export interface ConfigParam {
//     factoryScopeObject?: ScopeObjectFactory;
//     applyEvent?: (obj: any, elements: Element[]) => void
//     changeVar?: (obj: any, elements: Element[], varName: string) => void
//     targetAttributeNames?: string[]
// }

//fragment: DocumentFragment
import { ConstructorType } from 'types/Types';

export interface Config {
    targets?:  {attrName: string, callBack:(target: Element, attrValue: string, obj: any) => DocumentFragment}[];
    proxyExcludeTyps? : ConstructorType<any>[];
    applyEvents?: {attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void}[];
    // public start = '<!--%';
    // public end = '%-->';
    // public factoryScopeObject?: ScopeObjectFactory;
    // public changeVar?: (obj: any, elements: Element[], varName: string) => void;
    // targetAttributeNames?: string[];
    // // public itPath?: string;
    // constructor(configPram?: ConfigParam) {
    //     this.factoryScopeObject = configPram?.factoryScopeObject;
    //     this.applyEvent = configPram?.applyEvent;
    //     this.changeVar = configPram?.changeVar;
    //     this.targetAttributeNames = configPram?.targetAttributeNames;
    // }
}
