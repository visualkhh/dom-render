import {JSDOM} from 'jsdom';
import {TargetNode, TargetNodeMode} from 'dom-render/RootScope';
import {ScopeRawSet} from 'dom-render/ScopeRawSet';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {DomRender} from 'dom-render/DomRender';
import {ScopeObject} from 'dom-render/ScopeObject';

const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div id="body">
    <div>
        <!--%
        for(var i = 0 ; i < this.cnt; i++) {
            write(this.name + '--' + i)
        }
        %-->
    </div>

    <div>
        <!--% write(this.car.name + '  --' + this.car.model)%-->
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
    childs: string[];
    constructor(name: string, height: number, width: number) {
        super();
        this.cnt = 10;
        this.name = name;
        this.color = RandomUtils.getRandomColor();
        this.height = height;
        this.width = width;
        this.car = new Car();
        this.childs = ['one', 'tow', 'three', 'four'];
    }
}

let user = new User('visualkhh', 55, 22);
// const config = new Config(document);=
const config = new Config(document, (it) => new Test(it.config));
console.log(user)
const domRender = new DomRender(raw, config, 'zzzzzzzz');
user = domRender.runRender(user, targetNode);
console.log('------------------------------')
// const regex = new RegExp('<!--(.*?)-->', 'gm');
console.log(document.body.innerHTML.replace(/<!--(.*?)-->/gm, ''))
console.log('------------------------------')
// setTimeout(() => {
//     user.car.name = 'zzzzzzzzzzzzzzzzzzzzz';
//     console.log(document.body.innerHTML)
// }, 5000)
setTimeout(() => {
    user.cnt = 100;
    console.log(document.body.innerHTML)
}, 2000)
//
// setInterval(() => {
//     user.color = RandomUtils.getRandomColor();
//     console.log(document.body.innerHTML)
// }, 1500)
// console.log(user, user.width)

// console.log(dom.window.document.body.children.length)
// import {DomRenderCompiler} from 'dom-render/DomRenderCompiler';
// import {ScopeRawSet} from 'dom-render/ScopeRawSet';
//
// export class MyUser {
//     name: 'aaa'
//     age: 55
// }
// const raw = new ScopeRawSet(`
// <html>
// <body>
// <body>
// <div><!--% write(this.name); %--></div>
// </body>
// </body>
// </html>
// `);
//
// const compiler = new DomRenderCompiler(raw, new MyUser());
// compiler.run();
// let documentFragment = compiler.root.executeFragment();
//
// console.log('-------->', documentFragment)
