import {Validator} from './Validator';

export class RequiredValidator<T = any, E = Element> extends Validator<T, E> {
    constructor(value?: T, target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        const value = this.value;
        // console.log('required', value, value !== undefined && value !== null)
        return value !== undefined && value !== null;
    }
}
