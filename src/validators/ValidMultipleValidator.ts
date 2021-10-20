import {Validator} from './Validator';
import {MultipleValidator} from './MultipleValidator';

export type ValidMulltiple<T = any, E = Element> = (validators: Validator<T, E>[], value?: T, target?: E, event?: Event) => boolean;

export class ValidMultipleValidator<T = any, E = Element> extends MultipleValidator<T, E> {
    constructor(public validMultipleCallback: ValidMulltiple<T, E>, public validators: Validator<T, E>[], value?: T, target?: E, event?: Event, autoValid: boolean = true) {
        super(validators, value, target, event, autoValid);
    }

    valid(): boolean {
        return this.validMultipleCallback(this.validators, this.value, this.getTarget(), this.getEvent());
    }
}
