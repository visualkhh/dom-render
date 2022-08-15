import {CreatorMetaData} from './CreatorMetaData';
import {Router} from '../routers/Router';
import {RawSet} from './RawSet';

export type Render = {
    rawset?: RawSet;
    scripts?: { [n: string]: any };
    bindScript?: string;
    element?: any;
    attribute?: any;
    creatorMetaData?: CreatorMetaData;
    router?: Router;
    range?: any;
    value?: any;
    [n: string]: any; // component?: any; //component instance
}
