import {Validator} from './Validator';
import {ValidatorArray} from './ValidatorArray';

export class IncludeCheckedValidatorArray<T = any, E = Element> extends ValidatorArray<T, E> {
    constructor(public include: any[], public allRequired: boolean = false, value?: Validator<T, E>[], target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    valid(): boolean {
        const valus = this.value ?? [];
        const checkedValue = valus.filter(it => it.checked).map(it => it.value);
        return checkedValue.length > 0 &&
            (!(checkedValue.filter(it => !this.include.includes(it)).length > 0)) &&
            (this.allRequired ? checkedValue.filter(it => this.include.includes(it)).length === this.include.length : true)
    }
}
