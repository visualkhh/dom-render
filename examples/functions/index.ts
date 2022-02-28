import {DomRender} from 'dom-render';
import {FormValidator} from 'dom-render/validators/FormValidator';
import {NotEmptyValidator} from 'dom-render/validators/NotEmptyValidator';

class PageForm extends FormValidator {
    name = new NotEmptyValidator();
    addr = new NotEmptyValidator();
}

class User {
    constructor(public name: string, public age: number) {
    }
}

class Data {
    drIf = true;
    users = [new User('John', 25), new User('Jane', 30), new User('Jack', 35)];
    name = 'dom-render';
    age = 20;
    tagStr = '<i>dom-render</i>';
    value = '';

    form = new PageForm();
    submit(evet: Event) {
        evet.preventDefault();
        console.log('submit -> ', this.form.valid());
    }
}

const data = DomRender.run(new Data(), document.querySelector('#app')!);