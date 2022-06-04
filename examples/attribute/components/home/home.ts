import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';

export class Home implements OnCreateRender {
    homeName = 'homeName';
    constructor() {
    }

    onCreateRender(data: any): void {
        console.log('onCreateRender->', data);
    }

    onInit(data: any): void {
        console.log('onInit', data);
    }

    checkName() {
        console.log(this.homeName);
    }
}