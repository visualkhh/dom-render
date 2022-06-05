import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {OnChangeAttrRender} from 'dom-render/lifecycle/OnChangeAttrRender';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';

export class Home implements OnCreateRender, OnChangeAttrRender  {
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

    onChangeAttrRender(name: string, newVal: any): void {
        console.log(' onChangeAttrRender->', name, newVal);
        if (name === 'value') {
            this.homeName = newVal + '-' + RandomUtils.getRandomColor();
        }
    }
}