import {Validation} from './Validation';
import {RequiredValidator} from './validators/RequiredValidator';

export abstract class Validations <T = any, E = Element> extends Validation<Validation<T, E>[]> {
    constructor(value?: Validation<T, E>[]) {
        super(value);
    }

    get values() {
        return this._value;
    }

    setValue(target: E, value: T, event?: Event) {
        this.value?.filter(it => {
            return it.target === target || (it.target as any)._DomRender_origin === target
        }).forEach(it => {
            it.value = value;
            it.event = event;
        })
    }

    addValue(value: T, target: E, event?: Event) {
        if (!this.value) {
            this.value = [];
        }
        if (value instanceof Validation) {
            this.value?.push(value)
        } else {
            this.value?.push(this.makeValidation(value, target, event))
        }
    }

    removeElement(e: E) {
        if (this.value) {
            this.value = this.value.filter(it => it.target !== e);
        }
    }

    makeValidation(value: T, target: E, event?: Event): Validation<T, E> {
        return new RequiredValidator(value, target, event);
    };
}
