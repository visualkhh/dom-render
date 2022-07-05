import {OnInitRender} from 'dom-render/lifecycle/OnInitRender';

export class Profile implements OnInitRender {
    name = 'red'

    onInitRender(data?: any): void {
        console.log('---221s----', data)
    }
}