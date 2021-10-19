import {Validator} from './Validator';

export class NotEmptyValidator<T = any, E = Element> extends Validator<T, E> {
    constructor(value?: T, target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        const value = this.value;
        // console.log('NotEmptyValidator', value, value !== undefined && value !== null && ((value as any)?.length ?? 0) > 0)
        return value !== undefined && value !== null && ((value as any)?.length ?? 0) > 0;
    }
}
