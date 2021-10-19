import {Valid, Validator} from './Validator';

export class ValidValidator<T = any, E = Element> extends Validator<T, E> {
    constructor(public validCallBack: Valid<T, E>, value?: T, target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(value?:T, target?:E, event?:Event): boolean {
        return this.validCallBack(value, target, event);
    }
}
