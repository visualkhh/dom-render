import {RandomUtils} from './utils/random/RandomUtils';

export class RawSet {
    constructor(public point: {start: Comment, end: Comment}, public fragment: DocumentFragment) {
    }

    public static checkPointCreate(element: Element): RawSet {
        const uuid = RandomUtils.uuid()
        const start = document.createComment(`start ${uuid}`)
        const end = document.createComment(`end ${uuid}`)
        const fragment = document.createDocumentFragment();
        return new RawSet({start, end}, fragment)
    }
}
