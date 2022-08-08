import {DomRender} from 'dom-render';
import {FormValidator} from 'dom-render/validators/FormValidator';
import {NotEmptyValidator} from 'dom-render/validators/NotEmptyValidator';
import {RegExpTestValidator} from 'dom-render/validators/RegExpTestValidator';
import {CheckedValidator} from 'dom-render/validators/CheckedValidator';

class FormGroup extends FormValidator {
    name = new NotEmptyValidator();
    age = new NotEmptyValidator();
    email = new RegExpTestValidator(/\S+@\S+\.\S+/);
    agree = new CheckedValidator();
}
class Data {
    form = {} as {name?: string, age?: string};
    formGroup = new FormGroup();
    submit($event: Event) {
        $event.preventDefault();
        console.log('name', this.form.name);
        console.log('age', this.form.age);
    }

    submitFormGroup($event: Event) {
        $event.preventDefault();
        console.log('name', this.formGroup.name.valid());
        console.log('age', this.formGroup.age.valid());
        console.log('email', this.formGroup.email.valid());
        console.log('agree', this.formGroup.agree.valid());
        console.log('all', this.formGroup.valid());
        console.log(this.formGroup);
        this.formGroup.reset();
    }
}
const data = DomRender.run(new Data(), document.querySelector('#app'));
