import { OnInitRender } from 'dom-render/lifecycle/OnInitRender';
import { OnCreateRender } from 'dom-render/lifecycle/OnCreateRender';
export class Main implements OnInitRender, OnCreateRender {
    name = 'Main';
    constructor() {
        console.log('constructor home')
    }

    onCreateRender(...param: any[]): void {
        console.log('!')
    }

    onInitRender(...param: any[]): void {
        console.log('--------------')
    }
}