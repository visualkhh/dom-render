import {CreatorMetaData} from '../rawsets/CreatorMetaData';
import {Render} from '../rawsets/Render';

export interface OnInitRender {
    onInitRender(data?: {render?: Render, creatorMetaData?: CreatorMetaData}): void;
}
