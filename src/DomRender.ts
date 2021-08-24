import {DomRenderProxy} from './DomRenderProxy';
import { Config } from 'Config';

export class DomRender {
    public static run<T extends object>(obj: T, target?: Node, config?: Config): T {
        if ('_DomRender_isProxy' in obj) {
            if (target) {
                ((obj as any)._DomRender_proxy as DomRenderProxy<T>).initRender(target);
            }
            return obj;
        } else {
            const domRender = new DomRenderProxy(obj, target, config);
            const dest = new Proxy(obj, domRender)
            domRender.run(dest);
            return dest;
        }
    }
}
