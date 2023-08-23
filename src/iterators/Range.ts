// within rangeResult.ts
// @ts-ignore
export class RangeResult implements IteratorResult<number> {
    done: boolean;
    value: number;

    constructor(value: number | undefined, done: boolean) {
        this.done = done;
        this.value = value ?? 0;
    }
}

export class RangeIterator implements Iterator<number> {
    private _first: number;
    private _current: number;
    private _last: number
    private _step: number
    constructor(first: number, last: number, step: number) {
        this._current = this._first = first;
        this._last = last;
        this._step = step;
    }

    next(value?: any): IteratorResult<number> {
        let r: RangeResult;
        if (this._first < this._last && this._current < this._last) {
            r = new RangeResult(this._current, false);
            this._current += this._step
        } else if (this._first < this._last && this._current === this._last) {
            r = new RangeResult(this._current, false);
            this._current += this._step
        } else if (this._first > this._last && this._current > this._last) {
            r = new RangeResult(this._current, false);
            this._current -= this._step
        } else if (this._first > this._last && this._current === this._last) {
            r = new RangeResult(this._current, false);
            this._current -= this._step
        } else if (this._current === this._last) {
            r = new RangeResult(this._current, false);
            this._current -= this._step
        } else {
            r = new RangeResult(undefined, true);
        }
        return r;
    }
}

export class Range implements Iterable<number> {
    public readonly isRange = true;

    constructor(public first: number, public last: number, public step: number = 1) {
    }

    [Symbol.iterator](): Iterator<number> {
        return new RangeIterator(this.first, this.last, this.step);
    }

    map<U>(callbackfn: (value: number, index: number, array: number[]) => U, thisArg?: any): U[] {
        return Array.from(this).map(callbackfn)
    }

    public static range(first: number | string, last?: number, step: number = 1): Range {
        if (typeof first === 'number' && last === undefined) {
            return new Range(0, first, step);
        } else if (typeof first === 'string') {
            const [_first, _last = '0'] = first.split('..');
            const [__last, _step = '1'] = _last.split(',');
            return new Range(Number(_first.trim()), Number(__last.trim()), Number(_step.trim()));
        } else {
            return new Range(first, last ?? 0, step);
        }
    }
}
