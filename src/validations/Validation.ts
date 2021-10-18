export abstract class Validation<T = any, E = Element> {
    constructor(protected _value?: T, public target?: E, public event?: Event) {
    }

    // @ts-ignore
    get value(): T | undefined {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
    }

    abstract valid(): boolean;

    public valids(): boolean {
        return !this.inValids();
    }

    public inValids(): boolean {
        const inValid = Object.entries(this).filter(([k, v]) => (v instanceof Validation) && !v.valid());
        return inValid.length > 0;
    }

    public get length() {
        return (this.value as any)?.length ?? 0;
    }

    [name: string]: Validation | string | undefined | Element | any ;
}
