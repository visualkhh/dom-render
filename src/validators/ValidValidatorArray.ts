import {Valid, Validator} from './Validator';
import {ValidatorArray} from './ValidatorArray';

export class ValidValidatorArray<T = any, E = Element> extends ValidatorArray<T, E> {
    constructor(public validCallBack: Valid<Validator<T, E>[], E>, value?: Validator<T, E>[], target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        console.log('-------vvv', this.value, this.validCallBack(this.value, this.target, this.event))
        return this.validCallBack(this.value, this.target, this.event);
    }
}
