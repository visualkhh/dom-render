import {JSDOM} from 'jsdom';
import {TargetNode, TargetNodeMode} from 'dom-render/RootScope';
import {ScopeRawSet} from 'dom-render/ScopeRawSet';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {DomRender} from 'dom-render/DomRender';
import {ScopeObject} from 'dom-render/ScopeObject';
import {ScopeFectory} from 'dom-render/fectorys/ScopeFectory';

const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="../dist/dist/dom-render.js"></script>
</head>
<body>
<div id="body">

    <div>
        <!--%
        for(var i = 0; i < this.cnt; i++) {
            createScope(this.friend);
            write('11');
        }
        %-->
    </div>

    <div>
        <!--%createScope(this.friend); %-->
    </div>

</div>
</body>
</html>
`)
const document = dom.window.document;
const body = document.querySelector('#body');
const targetNode = new TargetNode(body, TargetNodeMode.replace)
const raw = new ScopeRawSet(body.innerHTML, ['div {color: <!--%write(this.color)%-->}'])

class Test extends ScopeObject {
    constructor(public config: Config) {
        super(config);
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
    friend: ScopeFectory;
    childs: string[];
    constructor(name: string, height: number, width: number, friend?: ScopeFectory) {
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
}

const config = new Config(document, (it) => new Test(it.config));

const userFriend = new User('visualkhh-friend', 515, 122);
const fectory = new ScopeFectory(userFriend, new ScopeRawSet('<div>friend<!--%write(this.name)%--></div>', []), config);
// .runSet(userFriend);
// console.log('-->frindRootScope', frindRootScope)
let user = new User('visualkhh', 55, 22, fectory);
// console.log('origin user', user)
// for (const key in user) {
//     console.log('target->',  key)
// }
// console.log('user-->', user)
const domRender = new DomRender(raw, config, 'zzzzzzzz');
user = domRender.runRender(user, targetNode);

setTimeout(() => {
    user.cnt = 5;
    // fectory.obj.name = 'zzzzzzzzzzzzzzzzzzzzz';
}, 3000)
setTimeout(() => {
    fectory.obj.name = 'zzzzzzzzzzzzzzzzzzzzz';
}, 10000)
