import {JSDOM} from 'jsdom';
import {TargetNode, TargetNodeMode} from 'dom-render/RootScope';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {DomRender} from 'dom-render/DomRender';
import {ScopeObject} from 'dom-render/ScopeObject';
import {Scope} from 'dom-render/Scope';
const dom = new JSDOM(`
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>simple-boot-front</title>
</head>
<body>
<div id="app"></div>
</body>
</html>

`)

const html = `
<div>
    <!--%
    for(var i = 0 ; i < this.cnt; i++) {
        include(this.friend);
    }

    %-->
</div>
------------------------
<div>
    dr-attr: <input dr-attr='return {name: this.name}'>
</div>
<div>
    dr-value: <input dr-value='return this.random()'>
</div>
<div>
    dr-event-click: <button dr-event-click='this.plus(2)'>zzzzzzzzzzzzzz</button>
</div>
<div>
    dr-event-change: <input dr-event-change='console.log($event)'>
</div>
<div>
    dr-event-keyup: <input dr-event-keyup='console.log($event)'>
</div>
<div>
    dr-event-keydown: <input dr-event-keydown='console.log($event)'>
</div>
<div>
    dr-event-input: <input dr-event-input='console.log($event);this.friend.name=22'>
</div>
`

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
const document = dom.window.document;
// (global as any).document = document;
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

user = DomRender.render(window, user, raw, config, targetNode);
setTimeout(() => {
    user.name = RandomUtils.getRandomColor();
    user.color = RandomUtils.getRandomColor();
    console.log('-->', user);
    console.log('-->', document.body.innerHTML);
}, 3000)
