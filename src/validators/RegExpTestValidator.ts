import {Validator} from './Validator';
import {DomRenderProxy} from '../DomRenderProxy';

export class RegExpTestValidator<T = any, E = Element> extends Validator<T, E> {
    public regexp: RegExp;
    constructor(regexp: RegExp, value?: T, target?: E, event?: Event, autoValid = true) {
        super(value, target, event, autoValid);
        this.regexp = DomRenderProxy.final(regexp)
    }

    valid(): boolean {
        const value = this.value as unknown as string;
        const regExp = (this.regexp as any)._DomRender_origin ?? this.regexp;
        // console.log('regexp-->', value, this.regexp, regExp.test(value))
        if (value) {
            return regExp.test(value);
        } else {
            return false;
        }
    }
}
