import {Validator} from './Validator';

export class MultipleValidator<T = any, E = Element> extends Validator<T, E> {
    public validators: Validator<T, E>[];
    constructor(validators: Validator<T, E>[], value?: T, target?: E, event?: Event, autoValid: boolean = true) {
        super(value, target, event, autoValid);
        this.validators = validators.map(it => {
            it.setAutoValid(false);
            it.setAutoValidAction(false);
            return it;
        })
        this.validators.forEach(it => {
            it.set(this.value, this.getTarget(), this.getEvent())
        });
    }

    changeValue(value: T | undefined) {
        this.validators.forEach(it => it.set(this.value, this.getTarget(), this.getEvent()));
    }

    validAction(): boolean {
        return !(this.validators.filter(it => !it.validAction()).length > 0);
    }

    valid(): boolean {
        // console.log('mm', this.validators)
        return !(this.validators.filter(it => !it.valid()).length > 0);
    }
}
