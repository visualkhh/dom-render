import {DomRenderProxy} from './DomRenderProxy';

export class DomRender {
    public static run<T extends object>(obj: T, target: Element): T {
        const domRender = new DomRenderProxy(obj);
        const dest = new Proxy(obj, domRender)
        domRender.run(dest);
        return dest;
    }
}
