import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {OnDestroyRender} from 'dom-render/lifecycle/OnDestroyRender';
import {CreatorMetaData} from 'dom-render/RawSet';

export class Profile implements OnCreateRender, OnDestroyRender {
    name?: string;
    age?: number;
    details = 'details information';

    constructor() {
        console.log('User constructor');
    }

    onCreateRender(...param: any[]): void {
        // console.log('User onCreateRender');
        // setInterval(() => {
        //     console.log('profile-->', this);
        // }, 1000);
    }

    onDestroyRender(metaData: CreatorMetaData): void {
        console.log('destroy', metaData);
    }
}