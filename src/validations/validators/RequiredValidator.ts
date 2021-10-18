import {Validation} from '../Validation';

export class RequiredValidator<T = any, E = Element> extends Validation<T, E> {

    constructor(value: T, target: E, event?: Event) {
        super(value, target, event);
    }

    valid(): boolean {
        return this.value !== undefined && this.value !== null;
    }
}
