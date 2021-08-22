import {DomRenderProxy} from './DomRenderProxy';
import {RawSet} from './RawSet';

export class DomRender {
    public static run<T extends object>(obj: T, target: Node): T {
        const domRender = new DomRenderProxy(obj, target);
        const dest = new Proxy(obj, domRender)
        domRender.run(dest);
        return dest;
    }
}
