
export type Valid<T = any, E = Element> = (value?: T, target?: E, event?: Event) => boolean;
export type ValidAction<T = any, E = Element> = (valid: boolean, value?: T, target?: E, event?: Event) => void;
// export interface Valid<T = any, E = Element> {
//     valid(value?: T, target?: E, event?: Event): boolean;
// }
export abstract class Validator<T = any, E = Element> {
    private _target?: E;
    private _event?: Event;
    private _autoValid!: boolean;
    private _autoValidAction!: boolean;
    private _validAction?: ValidAction<T, E>;
    constructor(protected _value?: T, target?: E, event?: Event, autoValid = true, autoValidAction = true) {
        this.setTarget(target);
        this.setEvent(event);
        this.setAutoValid(autoValid)
        this.setAutoValidAction(autoValidAction)
    }

    getValidAction(): ValidAction<T, E> | undefined {
        return this._validAction;
    }

    setValidAction(value: ValidAction<T, E>) {
        this._validAction = value;
        return this;
    }

    getAutoValid() {
        return this._autoValid;
    }

    setAutoValid(autoValid: boolean) {
        this._autoValid = autoValid;
        return this;
    }

    getAutoValidAction() {
        return this._autoValidAction;
    }

    setAutoValidAction(autoValid: boolean) {
        this._autoValidAction = autoValid;
        return this;
    }

    getEvent() {
        return this._event;
    }

    setEvent(event: Event | undefined) {
        if (event) {
            this._event = this.domRenderFinal(event);
        }
        return this;
    }

    getTarget() {
        return this._target;
    }

    targetFocus() {
        (this._target as any)?.focus?.();
    }

    targetReset() {
        (this._target as any)?.reset?.();
    }

    targetDispatchEvent(event: Event) {
        return (this._target as any)?.dispatchEvent(event);
    }

    setTarget(target: E | undefined) {
        if (target) {
            this._target = this.domRenderFinal(target);
        }
        return this;
    }

    private domRenderFinal(obj: any) {
        (obj as any)._DomRender_isFinal = true;
        return obj
    }

    get value(): T | undefined {
        if (this._value === undefined || this._value === null) {
            this._value = (this.getTarget() as any)?.value;
        }
        return this._value;
    }

    set value(value: T | undefined) {
        // console.log('---?set?', value, this)
        this._value = value;
        this.tickValue(value);
    }

    protected tickValue(value: T | undefined) {
        this.changeValue(value);
        const target = this.getTarget() as any;
        if (target && target?.value !== undefined && target?.value !== null) {
            try {
                target.value = this._value;
            } catch (e) {
                console.error('set value function is blocked ')
            }
        }
        if (this.getAutoValidAction()) {
            this.validAction();
        } else if (this.getAutoValid()) {
            this.valid();
        }
    }

    set(value?:T, target?: E, event?: Event) {
        this.setTarget(target);
        this.setEvent(event)
        this.value = value;
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

    public validAction() {
        const valid = this.valid();
        this.getValidAction()?.(valid, this.value, this.getTarget(), this.getEvent());
        return valid;
    }

    // public childValidAction() {
    //     const valid = this.childValids();
    //     this.getValidAction()?.(valid, this.value, this.getTarget(), this.getEvent());
    //     return valid;
    // }

    public abstract valid(): boolean;

    public inValid(): boolean {
        return !this.valid();
    };

    public allValid() {
        return this.valid() && this.childInValid();
    }

    public allValidAction() {
        return this.validAction() && this.childInValidAction();
    }

    public allInValid() {
        return !this.allValid();
    }

    public allInValidAction() {
        return !this.allValidAction();
    }

    public childValid(): boolean {
        return !this.childInValid();
    }

    public childValue(): {[key: string]: any } {
        const data = {} as any;
        this.childValidators().filter(([k, v]) => {
            data[k] = v.value;
        });
        return data;
    }

    public childValidAction(): boolean {
        return !this.childInValidAction();
    }

    public childInValid(): boolean {
        const inValid = this.childValidators().filter(([k, v]) => !v.valid());
        return inValid.length > 0;
    }

    public childInValidValidator(): [string, Validator<any, Element>][] {
        const inValid = this.childValidators().filter(([k, v]) => !v.valid());
        return inValid;
    }

    public childInValidAction(): boolean {
        const inValid = this.childValidators().filter(([k, v]) => !v.validAction());
        return inValid.length > 0;
    }

    public childValidator(name: string): Validator | undefined {
        return Object.entries(this).find(([k, v]) => ( k === name && (v instanceof Validator)))?.[1];
    }

    public childValidators(): [string, Validator][] {
        return Object.entries(this).filter(([k, v]) => (v instanceof Validator));
    }

    public childValidValidator(): [string, Validator][] {
        return this.childValidators().filter(it => it[1].valid());
    }

    public syncValue() {
        this.value = (this.getTarget() as any)?.value;
    }

    public allSyncValue() {
        this.childValidators().forEach(([k, e]) => {
            e.syncValue();
        })
    }

    public get length() {
        return (this.value as any)?.length ?? 0;
    }
}