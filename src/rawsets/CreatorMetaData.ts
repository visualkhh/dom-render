import {Router} from '../routers/Router';
import {Attrs} from './Attrs';
import {RawSet} from './RawSet';

export type CreatorMetaData = {
    thisVariableName?: string | null;
    thisFullVariableName?: string | null;
    componentKey?: string | null;
    rawSet: RawSet;
    scripts?: { [n: string]: any };
    router?: Router;
    innerHTML: string;
    drAttrs?: Attrs;
    rootCreator: any;
    attribute: any;
    creator: any;
    // render?: Render;
}