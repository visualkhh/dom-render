import {Validator} from './Validator';
import {NonPassValidator} from './NonPassValidator';

// export type MakeValidator<T = any, E = Element> = (value: T, target: E, event?: Event) => Validator<T, E>;

export abstract class ValidatorArray<T = any, E = Element> extends Validator<Validator<T, E>[], E> {
    constructor(value?: Validator<T, E>[], target?: E, public event?: Event, public autoValid = true) {
        super(value, target, event, autoValid);
    }

    getValidators() {
        return this._value;
    }

    setValue(target: E, value: T, event?: Event) {
        this.value?.filter(it => {
            if (it.target) {
                return it.target === target || (it.target as any)._DomRender_origin === target
            } else {
                return false;
            }
        }).forEach(it => {
            it.value = value;
            it.event = event;
        })
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
    }

    getValidator(e: E) {
        return this.value?.filter(it => ((it.target as any)?._DomRender_origin ?? it.target) === e)[0]
    }

    removeElement(e: E) {
        const value = this.value;
        if (value) {
            this.value = value.filter(it => ((it.target as any)?._DomRender_origin ?? it.target) !== e);
        }
    }

    makeValidator(value: T, target: E, event?: Event): Validator<T, E> {
        return new NonPassValidator(value, target, event);
    };
}
