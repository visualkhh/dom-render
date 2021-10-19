import {Validator} from './Validator';

export class ValueEqualsValidator<T = any, E = Element> extends Validator<T, E> {
    constructor(public equalsValue: T, value?: T, target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        return this.value === this.equalsValue;
    }
}
