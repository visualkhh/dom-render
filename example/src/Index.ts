import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {DomRender} from 'dom-render/DomRender';

class User {
    // color?;
    // selectValue?;
    // textValue?;
    // e1?: Element;
    // e2?: Element;
    // name: string;
    cnt: number;
    cnt1 = 0;
    // cnt2 = 0;
    // cnt3 = 0;
    data = {
        name: 'good',
        addr: {
            first: 'ff',
            last: 'll',
            street: 'stt'
        }
    }

    data1 = this.data;
    // data2 = this.data1;
    // friends?: User[];

    constructor(cnt: number, name: string, friends?: User[], public parent?: User) {
        // this.name = name;
        // this.cnt = cnt;
        // this.color = RandomUtils.getRandomColor();
        // this.friends = friends;
    }
}

const user = new User(255, 'parent');
const domRender = new DomRender(user);
const destUser = new Proxy(user, domRender)
domRender.run(destUser);
// domRender.createAddTemplate(document.querySelector('#app'));
console.log('destUser', destUser)
console.log('destUser', destUser._DomRender_proxy)
setTimeout(() => {
    // destUser.data.name = '55';
    // destUser.cnt1 = 55
    destUser.data = {name: 'vvvv', addr: {first: 'z', last: 'vv', street: 'aa'}}
    console.log('pp', destUser)
    // destUser.data.addr.last = '55';
    // destUser.data1.addr.first = '5255';
}, 3000);

//
// const config = new Config();
//
// const parent = DomRender.create(new User(255, 'parent'), {template: '<div><!--%write(this.name)%-->, <!--%write(this.cnt)%--></div>'});
// // let user = new User(1, DomRender.create(new User(255), {template: '<div><!--%write(this.cnt)%--></div>'}));
// let user = new User(
//     1,
//     'root',
//     [new User(255, 'f1'), new User(200, 'f2')],
//     parent
// );
// user.name = 'root'
// // let user = new User(1, {} as User);
// // console.log(user)
// const body = document.querySelector('#app');
// const targetNode = new TargetNode(body, TargetNodeMode.replace)
// const raw = {template: html};
//
// user = DomRender.render(window, user, raw, config, targetNode);
// // user.friends = DomRender.create(new User(255), {template: '<div><!--%write(this.cnt)%--></div>'});
//
// setTimeout(() => {
//     user.parent = parent;
// }, 1000);
// setTimeout(() => {
//     user.parent = DomRender.create(new User(255, 'pare222nt'), {template: '<div><!--%write(this.name)%-->, <!--%write(this.cnt)%--></div>'});
//     // user.friends.push(2)
//     // user.cnt = 2;
//     // user.changeFriendName()
//     // user.friends[1].name = RandomUtils.getRandomColor();
//     // console.log('-->user.cnt', user, user.cnt)
//     // user.friends = [2,3,4];
// }, 5000)
// // setTimeout(() => {
// //     console.log('iii-->', user);
// //     user.childs = ['1', '2', '3']
// // }, 3000)
