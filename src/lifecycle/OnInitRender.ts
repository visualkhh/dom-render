// import {Scope} from './Scope';
//
import { CreatorMetaData, Render } from '../RawSet';

export interface OnInitRender {
    onInitRender(data?: {render?: Render, creatorMetaData?: CreatorMetaData}): void;
//     onRenderd(data: HTMLFrameElement): void;
//     onScopeMaked(data: Scope): void;
}
