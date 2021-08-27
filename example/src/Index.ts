import {DomRender} from 'dom-render/DomRender';

class User {
    name: string;
    age: number;
    gender: string;
    friends: User[];
    office = {
        name: 'guro',
        addr: {
            first: 'guro',
            last: ' digital',
            street: ' complex'
        }
    }

    constructor(name: string, age: number, gender: string, friends: User[] = []) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.friends = friends;
    }

    onInitElement(e: HTMLInputElement) {
        console.log('inputElement onInit', e.value)
    }

    getOfficeFullAddr() {
        return `${this.office.addr.first}, ${this.office.addr.last}, ${this.office.addr.street} (${this.office.name})`
    }

    sayName() {
        console.log(this.name)
    }
}
const friends = [new User('friend1', 15, 'M'), new User('friend2', 16, 'F')]
const target = document.querySelector('#app');
if (target) {
    const user = DomRender.run(new User('parent', 10, 'M', friends), target);
}
