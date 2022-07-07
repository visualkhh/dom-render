import {DomRenderProxy} from './DomRenderProxy';
import {Config} from './configs/Config';
import {PathRouter} from './routers/PathRouter';
import {HashRouter} from './routers/HashRouter';
import {ConstructorType, DomRenderFinalProxy} from './types/Types';
import {RawSet} from './RawSet';
import {DefaultMessenger} from './messenger/DefaultMessenger';

export class DomRender {
    public static run<T extends object>(obj: T, target?: Node | null, oConfig?: Omit<Config, 'window'>): T {
        let robj = obj;
        if ('_DomRender_isProxy' in obj) {
            if (target) {
                ((obj as any)._DomRender_proxy as DomRenderProxy<T>).initRender(target);
            }
            robj = obj;
            return robj;
        }
        let config = oConfig as Config;
        if (!config) {
            config = {window} as Config;
        }
        if (config && !config.window) {
            config.window = window;
        }
        config.routerType = config.routerType || 'none';
        config.messenger = DomRenderFinalProxy.final(config.messenger ?? new DefaultMessenger(config));
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

    public static createComponent(param: {type: ConstructorType<any> | any, tagName?: string, template?: string, styles?: string[] | string}) {
        // console.log('===>', typeof param.type, param.type.name, param.type.constructor.name)
        const component = RawSet.createComponentTargetElement(param.tagName ?? (typeof param.type === 'function' ? param.type.name : param.type.constructor.name), (e, o, r2, counstructorParam) => {
            return typeof param.type === 'function' ? new param.type(...counstructorParam) : param.type;
        }, param.template ?? '', Array.isArray(param.styles) ? param.styles : (param.styles ? [param.styles] : undefined));
        return component;
    }

    public static createAttribute(attrName: string, getThisObj: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => any, factory: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment) {
        const targetAttribute = RawSet.createComponentTargetAttribute(
            attrName,
            getThisObj,
            factory
        )
        return targetAttribute;
    }
}