import {Validator} from './Validator';

export class FormValidator<E = HTMLFormElement> extends Validator<void, E> {
    constructor(target?: E, event?: Event, autoValid = true) {
        super(undefined, target, event, autoValid)
    }

    public valid(): boolean {
        return this.childValids()
    }
}
