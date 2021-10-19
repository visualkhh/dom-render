import {DomRenderProxy} from '../DomRenderProxy';

export type Valid<T = any, E = Element> = (value?: T, target?: E, event?: Event) => boolean;
// export interface Valid<T = any, E = Element> {
//     valid(value?: T, target?: E, event?: Event): boolean;
// }
export abstract class Validator<T = any, E = Element> {
    private _target?: E;
    private _event?: Event;

    constructor(protected _value?: T, target?: E, event?: Event, public autoValid = true) {
        this.target = target;
        this.event = event;
    }

    get event() {
        return ((this._event as any)?._DomRender_origin ?? this._event);
    }

    set event(event: Event | undefined) {
        this.setEvent(event)
    }

    setEvent(event: Event | undefined) {
        if (event) {
            this._event = DomRenderProxy.final(event);
        }
    }

    get target() {
        return ((this._target as any)?._DomRender_origin ?? this._target);
    }

    set target(target: E | undefined) {
        this.setTarget(target)
    }

    setTarget(target: E | undefined) {
        if (target) {
            this._target = DomRenderProxy.final(target);
        }
    }

    get value(): T | undefined {
        console.log('value-->', this._value)
        if (this._value === undefined || this._value === null) {
            this._value = (this.target as any)?.value;
        }
        return this._value;
    }

    set value(value: T | undefined) {
        this._value = value;
        this.changeValue(value);
        const target = this.target as any;
        if (target?.value !== undefined && target?.value !== null) {
            target.value = this._value;
        }
        if (this.autoValid) {
            this.valid();
        }
    }

    changeValue(value: T | undefined) {
    }

    // getOriginTarget() {
    //     return ((this.target as any)?._DomRender_origin ?? this.target);
    // }

    get checked(): boolean {
        return (this.target as any)?.checked ?? false;
    }

    set checked(checked: boolean) {
        (this.target as any).checked = checked;
    }

    get selectedIndex(): number {
        return (this.target as any)?.selectedIndex ?? -1;
    }

    set selectedIndex(selectedIndex: number) {
        (this.target as any).selectedIndex = selectedIndex;
    }

    public querySelector(selector: string) {
        return (this.target as unknown as Element)?.querySelector(selector);
    }

    public querySelectorALL(selector: string) {
        return (this.target as unknown as Element)?.querySelectorAll(selector);
    }

    abstract valid(): boolean;

    public inValid(): boolean {
        return !this.valid();
    };

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
