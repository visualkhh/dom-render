import {TargetNode, TargetNodeMode} from 'dom-render/RootScope';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {DomRender} from 'dom-render/DomRender';
import html from './index.html'

class User {
    color?;
    selectValue?;
    textValue?;
    e1?: Element;
    e2?: Element;
    name: string;
    cnt: number;
    cnt1 = 0;
    cnt2 = 0;
    cnt3 = 0;
    friends?: User;

    constructor(cnt, friends?: User) {
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

    changeFriendName() {
        console.log(this)
        // this.cnt = RandomUtils.random(0,5);
        // this.cnt1 = RandomUtils.random(0,5);
        // this.cnt2 = RandomUtils.random(0,5);
        this.friends.name = RandomUtils.getRandomColor();
        console.log('-->', this.friends);
    }

    createFriend() {
        this.friends = DomRender.create(new User(255), {template: '<div><!--%write(this.cnt)%--></div>'});
    }
}

const config = new Config();

let user = new User(1);
// console.log(user)
const body = document.querySelector('#app');
const targetNode = new TargetNode(body, TargetNodeMode.replace)
const raw = {template: html};

user = DomRender.render(document, user, raw, config, targetNode);
// user.friends = DomRender.create(new User(255), {template: '<div><!--%write(this.cnt)%--></div>'});

// setTimeout(() => {
//     // user.friends.push(2)
//     user.cnt = 2;
//     user.changeFriendName()
//     console.log('-->user.cnt', user, user.cnt)
//     // user.friends = [2,3,4];
// }, 5000)
// setTimeout(() => {
//     console.log('iii-->', user);
//     user.childs = ['1', '2', '3']
// }, 3000)
