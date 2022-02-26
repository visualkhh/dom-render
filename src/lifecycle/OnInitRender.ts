import { CreatorMetaData, Render } from '../RawSet';

export interface OnInitRender {
    onInitRender(data?: {render?: Render, creatorMetaData?: CreatorMetaData}): void;
}
