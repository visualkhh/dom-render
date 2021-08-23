import {DomRenderProxy} from './DomRenderProxy';
import { ConstructorType } from 'types/Types';
import { Config } from 'Config';

export class DomRender {
    public static run<T extends object>(obj: T, target?: Node, config?: Config): T {
        const domRender = new DomRenderProxy(obj, target, config);
        const dest = new Proxy(obj, domRender)
        domRender.run(dest);
        return dest;
    }

}
