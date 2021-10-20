import {Validator} from './Validator';

export class MultipleValidator<T = any, E = Element> extends Validator<T, E> {
    constructor(public validators: Validator<T, E>[], value?: T, target?: E, event?: Event, autoValid: boolean = true) {
        super(value, target, event, autoValid);
        this.validators.forEach(it => it.set(this.value, this.getTarget(), this.getEvent()));
    }

    changeValue(value: T | undefined) {
        this.validators.forEach(it => it.set(this.value, this.getTarget(), this.getEvent()));
    }

    valid(): boolean {
        return !(this.validators.filter(it => !it.valid()).length > 0);
    }
}
