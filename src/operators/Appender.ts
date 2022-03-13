export class Appender {
    values?: any[];

    constructor(public index: number) {
    }
}

export class AppenderContainer {
    // childs: Array<Appender> = [new Appender(0)];
    // eslint-disable-next-line no-undef
    [key: number]: any[] | undefined;
    length = 0;
    // [keys: string]: any;

    constructor() {
        // (this.childs as any).isAppender = true;
    }

    push(...items: any[]): void {
        // console.log('----2>', this.length)
        (items as any).index = this.length;
        this[this.length++] = items;
        // console.log('---22->', this.length)
        // const appender = this.childs[this.lastIndex];
        // appender.values = items;
        // this.childs.push(new Appender(appender.index + 1));
    }

    clear(): void {
        // console.log('length', this.length);
        for (let i = 0; i < this.length; i++) {
            delete this[i];
        }
        this.length = 0;
    }

    // get currentAppender(): Appender {
    //     return this.childs[this.childs.length - 2];
    // }
    //
    // get lastAppender(): Appender {
    //     return this.childs[this.childs.length - 1];
    // }

    // get length() {
    //     return 1;
    //     // return this.childs.length;
    // }
    //
    // get currentIndex() {
    //     return 1;
    //     // return this.childs.length - 2;
    // }

    // get lastIndex() {
    //     return this.childs.length - 1;
    // }
}