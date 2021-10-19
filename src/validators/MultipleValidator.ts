import {Validator} from './Validator';

export class MultipleValidator<T = any, E = Element> extends Validator<T, E> {
    constructor(public validators: Validator<T, E>[], value?: T, target?: E, event?: Event, autoValid: boolean = true) {
        super(value, target, event, autoValid);
        this.validators.forEach(it => {
            it.value = this.value;
            it.target = this.target;
            it.event = this.event;
        })
    }

    changeValue(value: T | undefined) {
        this.validators.forEach(it => {
            it.value = value;
            it.target = this.target;
            it.event = this.event;
        })
    }

    valid(): boolean {
        return !(this.validators.filter(it => !it.valid()).length > 0);
    }
}
