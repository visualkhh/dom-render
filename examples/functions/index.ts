import {DomRender} from 'dom-render';
import {FormValidator} from 'dom-render/validators/FormValidator';
import {NotEmptyValidator} from 'dom-render/validators/NotEmptyValidator';
import {AppenderContainer} from 'dom-render/operators/Appender';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';

class PageForm extends FormValidator {
    name = new NotEmptyValidator();
    addr = new NotEmptyValidator();
}

class User {
    constructor(public name: string, public age: number) {
    }
}

class Data {
    appender = new AppenderContainer();
    drIf = true;
    users = [new User('John', 25), new User('Jane', 30), new User('Jack', 35)];
    name = 'dom-render';
    age = 20;
    tagStr = '<i>dom-render</i>';
    value = '';
    form = new PageForm();

    constructor() {
        this.appender.push('init' + RandomUtils.uuid(), 'init' + RandomUtils.uuid());
        console.log('---------->', this.appender)
    }

    append() {
        this.appender.push(RandomUtils.uuid(), RandomUtils.uuid());
        console.log('----', this.appender)
    }

    modifyAppender(idx: number) {
        // @ts-ignore
        this.appender[idx][0] = RandomUtils.uuid();
    }

    submit(evet: Event) {
        evet.preventDefault();
        console.log('submit -> ', this.form.valid());
    }
}

const data = DomRender.run(new Data(), document.querySelector('#app')!);