import {Scope} from './Scope';
import {ScopeObject} from './ScopeObject';

export class Config {
    public start = '<!--%';
    public end = '%-->';
    constructor(public factoryScopeObject?: (scope: Scope) => ScopeObject | undefined) {
    }
}
