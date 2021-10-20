import {Validator} from './Validator';
import {ValidatorArray} from './ValidatorArray';

export class CountGreaterThanUnCheckedValidatorArray<T = any, E = Element> extends ValidatorArray<T, E> {
    constructor(public count: number, value?: Validator<T, E>[], target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        return (this.value ?? []).filter(it => !it.checked).length > this.count;
    }
}
