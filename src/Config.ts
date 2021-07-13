import {Scope} from './Scope';
import {ScopeObject} from './ScopeObject';

export class Config {
    public start = '<!--%';
    public end = '%-->';
    // public document = document;
    constructor(private _document?: Document, public factoryScopeObject?: (scope: Scope) => ScopeObject | undefined) {
    }

    get document() {
        return this._document ?? document;
    }
}
