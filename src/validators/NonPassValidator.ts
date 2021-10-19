import {Validator} from './Validator';

export class NonPassValidator<T = any, E = Element> extends Validator<T, E> {
    constructor(value?: T, target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        return false;
    }
}
