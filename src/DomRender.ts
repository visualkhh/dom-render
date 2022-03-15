import {DomRenderProxy} from './DomRenderProxy';
import {Config} from './Config';
import {Router} from './routers/Router';
import {PathRouter} from './routers/PathRouter';
import {HashRouter} from './routers/HashRouter';

export class DomRender {
    public static run<T extends object>(obj: T, target?: Node, config?: Config): T {
        let robj = obj;
        if ('_DomRender_isProxy' in obj) {
            if (target) {
                ((obj as any)._DomRender_proxy as DomRenderProxy<T>).initRender(target);
            }
            robj = obj;
            return robj;
        }
        if (!config) {
            config = {window} as Config;
        }
        config.routerType = config.routerType || 'none';
        const domRender = new DomRenderProxy(obj, target, config);
        const dest = new Proxy(obj, domRender)
        robj = dest;

        if (config.routerType === 'path') {
            config.router = config.router ?? new PathRouter(robj, config.window);
        } else if (config.routerType === 'hash') {
            config.router = config.router ?? new HashRouter(robj, config.window);
        }
        domRender.run(robj);
        return robj;
    }
}
// export default DomRender;
