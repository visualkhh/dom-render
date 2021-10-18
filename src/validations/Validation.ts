export abstract class Validation {
    value?: string;

    constructor(value?: string) {
        this.value = value;
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
        return this.value?.length ?? 0;
    }

    [name: string]: Validation | string | undefined | Element | any ;
}

const a = new class extends Validation {
    valid(): boolean {
        return false;
    }
}('a')

console.log('--', a)
