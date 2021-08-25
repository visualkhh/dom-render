import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {DomRenderProxy} from 'dom-render/DomRenderProxy';
import {DomRender} from 'dom-render/DomRender';

class User {
    // color?;
    // selectValue?;
    // textValue?;
    // e1?: Element;
    // e2?: Element;
    // name: string;
    cnt: number = 0;
    cnt1 = 0;
    dan = 1;
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
    friends?: User[];

    constructor(cnt: number, name: string, friends?: User[], public parent?: User) {
        // this.name = name;
        this.cnt = cnt;
        // this.color = RandomUtils.getRandomColor();
        this.friends = friends;
    }
}
const friends = [new User(2, '22'), new User(5, '55')]
const user = new User(255, 'parent', friends);
const target = document.querySelector('#app')
if (target) {
    const dest = DomRender.run(user, target);
    console.log('destUser', dest)
    // setTimeout(() => {
    // //     // destUser.data.name = '55';
    // //     dest.cnt = 55
    //     dest.cnt = 4
    //     dest.cnt1 = 44
    //     dest.friends[0].cnt = 66
    //     dest.friends[1].cnt = 646
    //     dest.friends.push(new User(7, '77'))
    //     // dest.cnt1 = 55
    // //     // destUser.data = {name: 'vvvv', addr: {first: 'z', last: 'vv', street: 'aa'}}
    // //     console.log('pp', dest)
    // //     // destUser.data.addr.last = '55';
    // //     // destUser.data1.addr.first = '5255';
    // }, 3000);

    // setTimeout(() => {
    //     console.log('----dest', dest)
    // //     dest.cnt = 10
    // //     dest.cnt1 = 50
    // }, 6000);
    // setTimeout(() => {
    //     // destUser.data.name = '55';
    //     dest.cnt1 = 15
    //     // destUser.data = {name: 'vvvv', addr: {first: 'z', last: 'vv', street: 'aa'}}
    //     console.log('pp', dest)
    //     // destUser.data.addr.last = '55';
    //     // destUser.data1.addr.first = '5255';
    // }, 2000);
}
