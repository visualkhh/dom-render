import {Validator} from './Validator';

export class CheckedValidator<T = any, E = HTMLElement> extends Validator<T, E> {
    constructor(value?: T, target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        return (this.target as any)?.checked ?? false;
    }
}
