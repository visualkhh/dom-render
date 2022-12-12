import {DomRender} from 'dom-render';
import {FormValidator} from 'dom-render/validators/FormValidator';
import {NotEmptyValidator} from 'dom-render/validators/NotEmptyValidator';
import {Appender} from 'dom-render/operators/Appender';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/configs/Config';
//
// const appender = new Appender<number>([1, 2]);
// appender.push(3, 4)
// console.log('------->', appender, appender.length);
//
// // console.log(appender[Symbol.iterator]);
// for (const number of appender) {
//     console.log('----2222--->', number);
// }

class PageForm extends FormValidator {
    name = new NotEmptyValidator();
    addr = new NotEmptyValidator();
}

class User {
    constructor(public name: string, public age: number) {
    }
}

class Data {
    appender = new Appender();
    dictionary = {} as any
    drIf = true;
    users = [new User('John', 25), new User('Jane', 30), new User('Jack', 35)];
    name = 'dom-render';
    age = 20;
    tagStr = '<i>dom-render</i>';
    value = '';
    form = new PageForm();
    la = {
        name: 'dom-render'
    }

    constructor() {
        this.appender.push('init' + RandomUtils.uuid(), 'init' + RandomUtils.uuid());
        // console.log('---------->', this.appender)
        this.appendDictionary('wow');
        this.appendDictionary('good');
    }

    appendDictionary(key = RandomUtils.getRandomString(5)) {
        // console.log('------append')
        this.dictionary[key] = new Date().toISOString();
        // this.dictionary.z = new Date().toISOString();
        // this.dictionary = this.dictionary;
        // console.log('appendDictionary -> ', this.dictionary);
    }

    changeDictionary(key: string) {
        // this.dictionary.z = new Date().toISOString();
        this.dictionary[key] = new Date().toISOString();
        // this.dictionary = this.dictionary;
        // this.la.name = 'dom-render!!';
        // console.log('------->', this.dictionary)
    }

    deleteDictionary(key: string) {
        // this.dictionary[key] = undefined;
        delete this.dictionary[key];
    }

    append() {
        this.appender.push(RandomUtils.uuid(), RandomUtils.uuid());
        console.log('----', this.appender)
    }

    clearAppend() {
        this.appender.clear()
        console.log('----', this.appender)
    }

    modifyAppender(idx: number) {
        // @ts-ignore
        this.appender[idx][0] = RandomUtils.uuid();
    }

    removeAppender(idx: number) {
        console.log('removeAppender -> ', idx);

    }

    submit(evet: Event) {
        evet.preventDefault();
        console.log('submit -> ', this.form.valid());
    }
}

export class Home {

}
const config: Config = {
    window,
    scripts: {
        concat: function (data: string, str: string) {
            return data + str;
        }
    },
    targetElements: [
        DomRender.createComponent({type: Home, template: '<h1>Home</h1>'})
    ]
}
const data = DomRender.run(new Data(), document.querySelector('#app')!, config);