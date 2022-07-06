import {OnInitRender} from 'dom-render/lifecycle/OnInitRender';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';

export class Profile implements OnInitRender {
    name = 'red'
    color = RandomUtils.getRandomColor();

    onInitRender(data?: any): void {
        console.log('---221s----', data)
    }

    change() {
        this.color = RandomUtils.getRandomColor();
    }
}