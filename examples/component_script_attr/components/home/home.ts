import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';

export class Home implements OnCreateRender{
    constructor(public name: string, public age: number, public title: string) {
    }

    onCreateRender(data: any): void {
        console.log('onCreateRender->', data);
    }

    onInit(data: any): void {
        console.log('onInit', data);
    }
}