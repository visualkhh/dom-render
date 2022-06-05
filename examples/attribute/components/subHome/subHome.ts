import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {OnChangeAttrRender} from 'dom-render/lifecycle/OnChangeAttrRender';

export class SubHome implements OnCreateRender, OnChangeAttrRender {
    subHomeName = 'SubHome';
    private subHomeColor = '#000';
    constructor() {
    }

    onCreateRender(data: any): void {
        console.log('onCreateRender->', data);
    }

    onInit(data: any): void {
        console.log('onInit', data);
    }

    checkName() {
        console.log(this.subHomeName, this.subHomeColor);
    }

    changeParam(name: string, color: string) {
        this.subHomeName = name;
        this.subHomeColor = color;
    }

    onChangeAttrRender(name: string, newVal: any): void {
        console.log(' onChangeAttrRender-subHome>', name, newVal);
        if (name === 'value') {
            this.subHomeName = newVal;
        }
    }
} 