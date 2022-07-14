import {CreatorMetaData} from '../rawsets/CreatorMetaData';

export interface OnDestroyRender {
    onDestroyRender(metaData?: CreatorMetaData): void;
}
