import {RawSet} from '../rawsets/RawSet';
import {Config} from './Config';
import {Attrs} from '../rawsets/Attrs';
import {CreatorMetaData} from '../rawsets/CreatorMetaData';
import {Render} from '../rawsets/Render';

export type TargetElement = {
    name: string;
    template?: string;
    styles?: string[];
    callBack: (target: Element, obj: any, rawSet: RawSet, attrs: Attrs, config: Config) => Promise<DocumentFragment>;
    complete?: (target: Element, obj: any, rawSet: RawSet) => void;
    __render?: Render;
    __creatorMetaData?: CreatorMetaData;
};
