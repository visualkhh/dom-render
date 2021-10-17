export abstract class Validation {
    value = '';

    abstract valid(): boolean;

    public childValid(): boolean {
        return !this.childInValid();
    }

    public childInValid(): boolean {
        const inValid = Object.entries(this).filter(([k, v]) => (v instanceof Validation) && !v.valid());
        return inValid.length > 0;
    }

    public get length() {
        return this.value?.length ?? 0;
    }

    [name: string]: Validation | string | undefined | Element | any;
}
