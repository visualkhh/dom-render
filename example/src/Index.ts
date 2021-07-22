import {TargetNode, TargetNodeMode} from 'dom-render/RootScope';
import {ScopeRawSet} from 'dom-render/ScopeRawSet';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {DomRender} from 'dom-render/DomRender';
import {ScopeObject} from 'dom-render/ScopeObject';
import {ScopeFectory} from 'dom-render/fectorys/ScopeFectory';
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
        this.cnt = 10;
        this.name = name;
        this.color = RandomUtils.getRandomColor();
        this.height = height;
        this.width = width;
        this.car = new Car();
        this.friend = friend;
        this.childs = ['one', 'tow', 'three', 'four'];
    }
    test() {
        console.log('test')
    }
}

// const config = new Config((it) => new Test(it));
const config = new Config();
let userFriend = new User('visualkhh-friend', 515, 122);
userFriend = DomRender.proxy(userFriend, new ScopeRawSet(document, '<div>friend<!--%write(this.name)%--></div>', []));
// const fectory = new ScopeFectory(userFriend, new ScopeRawSet('<div>friend<!--%write(this.name)%--></div>', []), config);
// .runSet(userFriend);
// console.log('-->frindRootScope', frindRootScope)
let user = new User('visualkhh', 55, 22, userFriend);
// console.log('origin user', user)
// for (const key in user) {
//     console.log('target->',  key)
// }
// console.log('user-->', user)
const body = document.querySelector('#app');
const targetNode = new TargetNode(body, TargetNodeMode.replace)
const raw = new ScopeRawSet(document, html, ['div {color: <!--%write(this.color)%-->}'])

user = DomRender.render(user, raw, config, targetNode);
// user = domRender.runRender(user, targetNode);
//
setTimeout(() => {
    user.cnt = 5;
    user.name = RandomUtils.getRandomColor()
    // user.friend.name = 'zzzzzzzzzzzzzzzzzzzzz';
}, 3000)
// // setTimeout(() => {
// //     fectory.obj.name = 'zzzzzzzzzzzzzzzzzzzzz';
// // }, 10000)
setTimeout(() => {
    console.log('--->', userFriend)
}, 10000)
