import {Validator} from './Validator';
import {NonPassValidator} from './NonPassValidator';

export type MakeValidator<T = any, E = Element> = (value: T, target: E, event?: Event) => Validator<T, E>;

export abstract class ValidatorArray<T = any, E = Element> extends Validator<Validator<T, E>[], E> {
    private _makeValidatorFactory: MakeValidator<T, E> = (value: T, target: E, event?: Event): Validator<T, E> => {
        return new NonPassValidator(value, target, event);
    }

    constructor(value?: Validator<T, E>[], target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
    }

    getMakeValidatorFactory(): MakeValidator<T, E> {
        return this._makeValidatorFactory;
    }

    setMakeValidatorFactory(value: MakeValidator<T, E>) {
        this._makeValidatorFactory = value;
        return this;
    }

    setArrayValue(target: E, value: T, event?: Event) {
        this.value?.filter(it => {
            if (it.getTarget()) {
                return it.getTarget() === target;
            } else {
                return false;
            }
        }).forEach(it => {
            it.set(value, target, event);
        });
        this.tickValue(this.value)
    }

    addValidator(value: T, target: E, event?: Event) {
        if (!this.value) {
            this.value = [];
        }
        if (value instanceof Validator) {
            this.value?.push(value)
        } else {
            this.value?.push(this.makeValidator(value, target, event))
        }
        this.tickValue(this.value)
    }

    allChecked(checked: boolean) {
        this.checked = checked;
        this.value?.forEach(it => {
            it.checked = checked;
        })
    }

    getValidators() {
        return this._value;
    }

    getValidator(e: E) {
        return this.value?.filter(it => it.getTarget() === e)[0]
    }

    getValidatorByValue(value: T) {
        const validatorByValue = this.getValidatorByValues(value)[0];
        return validatorByValue;
    }

    getValidatorByValues(value: T) {
        return this.value?.filter(it => it.value === value) ?? [];
    }

    removeElement(e: E) {
        const value = this.value;
        if (value) {
            this.value = value.filter(it => it.getTarget() !== e);
        }
    }

    makeValidator(value: T, target: E, event?: Event): Validator<T, E> {
        return this._makeValidatorFactory(value, target, event);
    };
}
