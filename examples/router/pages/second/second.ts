import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {CreatorMetaData} from '../../../../src/rawsets/CreatorMetaData';

export class Second implements OnCreateRender {
    name = 'Second'

    onCreateRender(data: CreatorMetaData): void {
        console.log('----->', data?.router);
        // console.log('----->', param[0].getData())
    }
}
