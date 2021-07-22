import {TargetNode, TargetNodeMode} from 'dom-render/RootScope';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {DomRender} from 'dom-render/DomRender';
import {ScopeObject} from 'dom-render/ScopeObject';
import html from './index.html'
import {Scope} from 'dom-render/Scope';

class Test extends ScopeObject {
    constructor(public scope: Scope) {
        super(scope);
        this.zz = '22'
        console.log('---')
    }

    say () {
        console.log('say~')
    }

    protected customScript(): string {
        return super.customScript();
    }
}

class Person {
    public eat: string;
    public food: string;
    constructor() {
        this.eat = 'zzz'
        this.food = 'food'
    }
}
class Wheel {
    public x: number;
    public y: number;
    constructor() {
        this.x = 100;
        this.y = 500;
    }
}

class Car {
    public name: string;
    public model: string;
    public leftWheel: Wheel;
    public rightWheel: Wheel;
    constructor() {
        this.name = 'car'
        this.model = 'tt'
        this.leftWheel = new Wheel();
        this.rightWheel = this.leftWheel;
        // this.rightWheel = new Wheel();
    }
}
class User extends Person {
    cnt: number;
    name: string;
    color: string;
    height: number;
    width: number;
    car: Car;
    friend: User;
    childs: string[];
    constructor(name: string, height: number, width: number, friend?: User) {
        super();
        this.cnt = 1;
        this.name = name;
        this.color = RandomUtils.getRandomColor();
        this.height = height;
        this.width = width;
        this.car = new Car();
        this.friend = friend;
        this.childs = ['one', 'tow', 'three', 'four'];
    }

    test() {
        console.log('test->' + this.name)
    }

    random() {
        return RandomUtils.random();
    }
    randomRgb() {
        return RandomUtils.getRandomColor();
    }

    plus(n: number) {
        user.cnt = n;
    }
}

const config = new Config();
let userFriend = new User('visualkhh-friend', 515, 122);
const fraw = {template: `
<div>friend<!--%write(this.name)%--><button dr-event-click="console.log($event)">----</button></div>
<hr>
`, styles: []};
userFriend = DomRender.proxy(userFriend, fraw);
let user = new User('visualkhh', 55, 22, userFriend);
const body = document.querySelector('#app');
const targetNode = new TargetNode(body, TargetNodeMode.replace)
const raw = {template: html, styles: ['div {color: <!--%write(this.color)%-->}']};

user = DomRender.render(document, user, raw, config, targetNode);
setTimeout(() => {
    user.name = RandomUtils.getRandomColor()
    user.color = RandomUtils.getRandomColor();
    console.log('-->', user)
}, 3000)
