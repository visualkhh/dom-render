import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';

export class Home implements OnCreateRender {
    homeName = 'homeName';
    private homeColor = '#000';
    constructor() {
    }

    onCreateRender(data: any): void {
        console.log('onCreateRender->', data);
    }

    onInit(data: any): void {
        console.log('onInit', data);
    }

    checkName() {
        console.log(this.homeName, this.homeColor);
    }

    changeParam(name: string, color: string) {
        this.homeName = name;
        this.homeColor = color;
    }
}