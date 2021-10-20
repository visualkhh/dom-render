import {DomRenderProxy} from '../DomRenderProxy';

export type Valid<T = any, E = Element> = (value?: T, target?: E, event?: Event) => boolean;
// export interface Valid<T = any, E = Element> {
//     valid(value?: T, target?: E, event?: Event): boolean;
// }
export abstract class Validator<T = any, E = Element> {
    private _target?: E;
    private _event?: Event;
    private _autoValid!: boolean;

    constructor(protected _value?: T, target?: E, event?: Event, autoValid = true) {
        this.setTarget(target);
        this.setEvent(event);
        this.setAutoValid(autoValid)
    }

    getAutoValid() {
        return this._autoValid;
    }

    setAutoValid(autoValid: boolean) {
        this._autoValid = autoValid;
        return this;
    }

    getEvent() {
        return this._event;
    }

    setEvent(event: Event | undefined) {
        if (event) {
            this._event = DomRenderProxy.final(event);
        }
        return this;
    }

    getTarget() {
        return this._target;
    }

    setTarget(target: E | undefined) {
        if (target) {
            this._target = DomRenderProxy.final(target);
        }
        return this;
    }

    get value(): T | undefined {
        if (this._value === undefined || this._value === null) {
            this._value = (this.getTarget() as any)?.value;
        }
        return this._value;
    }

    set value(value: T | undefined) {
        this._value = value;
        this.changeValue(value);
        const target = this.getTarget() as any;
        if (target && target?.value !== undefined && target?.value !== null) {
            target.value = this._value;
        }
        if (this.getAutoValid()) {
            this.valid();
        }
    }

    set(value?:T, target?: E, event?: Event) {
        this.value = value;
        this.setTarget(target);
        this.setEvent(event)
    }

    changeValue(value: T | undefined) {
    }

    get checked(): boolean {
        return (this.getTarget() as any)?.checked ?? false;
    }

    set checked(checked: boolean) {
        const target = this.getTarget() as any;
        if (target) {
            target.checked = checked;
        }
    }

    get selectedIndex(): number {
        return (this.getTarget() as any)?.selectedIndex ?? -1;
    }

    set selectedIndex(selectedIndex: number) {
        const target = this.getTarget() as any;
        if (target) {
            target.selectedIndex = selectedIndex;
        }
    }

    public querySelector(selector: string) {
        return (this.getTarget() as unknown as Element)?.querySelector(selector);
    }

    public querySelectorALL(selector: string) {
        return (this.getTarget() as unknown as Element)?.querySelectorAll(selector);
    }

    public abstract valid(): boolean;

    public inValid(): boolean {
        return !this.valid();
    };

    public allValid() {
        return this.valid() && this.childInValids();
    }

    public allInValid() {
        return !this.allValid();
    }

    public childValids(): boolean {
        return !this.childInValids();
    }

    public childInValids(): boolean {
        const inValid = Object.entries(this).filter(([k, v]) => (v instanceof Validator) && !v.valid());
        // console.log('child InValid->', Object.entries(this).filter(([k, v]) => (v instanceof Validator)));
        // console.log('child InValid->', inValid)
        return inValid.length > 0;
    }

    public get length() {
        return (this.value as any)?.length ?? 0;
    }
}
