import {Attrs, CreatorMetaData, RawSet, Render} from '../RawSet';
import {Config} from './Config';

export type TargetElement = {
    name: string;
    template?: string;
    styles?: string[];
    callBack: (target: Element, obj: any, rawSet: RawSet, attrs: Attrs, config: Config) => DocumentFragment;
    complete?: (target: Element, obj: any, rawSet: RawSet) => void;
    __render?: Render;
    __creatorMetaData?: CreatorMetaData;
};