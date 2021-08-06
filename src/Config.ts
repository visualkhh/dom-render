import {Scope} from './Scope';
import {ScopeObject} from './ScopeObject';

export type ScopeObjectFactory = (scope: Scope) => ScopeObject;
export interface ConfigParam {
    factoryScopeObject?: ScopeObjectFactory;
    applyEvent?: (obj: any, elements: Element[]) => void
    changeVar?: (obj: any, elements: Element[], varName: string) => void
    targetAttributeNames?: string[]
}

export class Config implements ConfigParam {
    public start = '<!--%';
    public end = '%-->';
    public factoryScopeObject?: ScopeObjectFactory;
    public applyEvent?: (obj: any, elements: Element[]) => void;
    public changeVar?: (obj: any, elements: Element[], varName: string) => void;
    targetAttributeNames?: string[];
    constructor(configPram?: ConfigParam) {
        this.factoryScopeObject = configPram?.factoryScopeObject;
        this.applyEvent = configPram?.applyEvent;
        this.changeVar = configPram?.changeVar;
        this.targetAttributeNames = configPram?.targetAttributeNames;
    }
}
