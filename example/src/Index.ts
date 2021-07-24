import {TargetNode, TargetNodeMode} from 'dom-render/RootScope';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {DomRender} from 'dom-render/DomRender';
import html from './index.html'

class User {
    friends?;
    color?;
    selectValue?;
    textValue?;
    e1?: Element;
    e2?: Element;
    name: string;
    cnt: number;

    constructor(cnt) {
        this.name = 'zz'
        this.cnt = cnt;
        this.color = RandomUtils.getRandomColor();
    }

    cc($event) {
        // console.log('-->', $event, this.selectValue, this.textValue)
        console.log('-->', this.e1, this.e2)
        // this.textValue = RandomUtils.getRandomColor();
    }

    makeRandomColor() {
        return RandomUtils.getRandomColor();
    }

    element($element: any) {
        $element.value = RandomUtils.getRandomColor();
        console.log('ele', $element);
    }
}

const config = new Config();

let user = new User(1);
const body = document.querySelector('#app');
const targetNode = new TargetNode(body, TargetNodeMode.replace)
const raw = {template: html};

user = DomRender.render(document, user, raw, config, targetNode);

setTimeout(() => {
    // user.friends.push(2)
    user.cnt = 2;
    // console.log('-->user.cnt', user, user.cnt)
    // user.friends = [2,3,4];
}, 3000)
// setTimeout(() => {
//     console.log('iii-->', user);
//     user.childs = ['1', '2', '3']
// }, 3000)
