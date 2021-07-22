import {Scope} from './Scope';
import {ScopeObject} from './ScopeObject';

export class Config {
    public start = '<!--%';
    public end = '%-->';
    // public document = document;
    constructor(public factoryScopeObject?: (scope: Scope) => ScopeObject | undefined) {
    }
}
