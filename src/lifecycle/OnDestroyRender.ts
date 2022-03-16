import {CreatorMetaData} from '../RawSet';

export interface OnDestroyRender {
    onDestroyRender(metaData: CreatorMetaData): void;
}
