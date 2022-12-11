export class Appender<T = any> implements Iterable<T> {
    // eslint-disable-next-line no-undef
    [key: number]: T[] | undefined;

    length = 0;

    constructor(defaultDatas?: T[]) {
        if (defaultDatas) {
            this.push(...defaultDatas);
        }
        // (this.childs as any).isAppender = true;
    }

    [Symbol.iterator](): Iterator<T> {
        const items = this.getAll();
        let idx = 0;
        return {
            next(value?: any): IteratorResult<T, any> {
                let r: IteratorResult<T> = {value: undefined, done: true};
                if (items.length > idx) {
                    r = {value: items[idx], done: false};
                }
                idx++;
                return r;
            }
        }
    }

    getAll(): T[] {
        return this.getAlls().flat();
    }

    getAlls(): T[][] {
        const map = Array.from({length: this.length}).filter((it, idx) => this[idx]).map((it, idx) => this[idx]);
        return map as T[][];
    }

    push(...items: T[]): void {
        // console.log('----2>', items, this.length);
        (items as any).index = this.length;
        this[this.length++] = items;
        // console.log('---22->', this.length)
        // const appender = this.childs[this.lastIndex];
        // appender.values = items;
        // this.childs.push(new Appender(appender.index + 1));
    }

    // delete(idx: number): void {
    //     // if (idx in this) {
    //     //     console.log('---------dele',idx)
    //     //     delete this[idx];
    //     //     this.length = this.length - 1;
    //     // }
    //     this.length = this.length - 1;
    // }

    clear(): void {
        // console.log('length', this.length);
        for (let i = 0; i < this.length; i++) {
            delete this[i];
        }
        this.length = 0;
    }
}