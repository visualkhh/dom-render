import {DomRenderProxy} from './DomRenderProxy';
import {Config} from './Config';
import {PathRouter} from './routers/PathRouter';
import {HashRouter} from './routers/HashRouter';
import {ConstructorType, DomRenderFinalProxy} from './types/Types';
import {RawSet} from './RawSet';
import {DefaultMessenger} from './messenger/DefaultMessenger';

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

    public static addComponent(config: Config, {type, tagName = type.name}: {type: ConstructorType<any>, tagName?: string}, {template, styles = []}: {template: string, styles?: string[]}) {
        const component = RawSet.createComponentTargetElement(tagName, (e, o, r2, counstructorParam) => {
            return new type(...counstructorParam);
        }, template, styles, config);
        config.targetElements = config.targetElements ?? [];
        config.targetElements.push(component);
        return {
            add: (source: {type: ConstructorType<any>, tagName?: string}, front: {template: string, styles?: string[]}) => {
                return DomRender.addComponent(config, source, front);
            }
        };
    }

    public static addAttribute(config: Config, attrName: string, getThisObj: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => any, factory: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment) {
        const targetAttribute = RawSet.createComponentTargetAttribute(
            attrName,
            getThisObj,
            factory
        )
        config.targetAttrs = config.targetAttrs ?? [];
        config.targetAttrs.push(targetAttribute);
        return {
            add: (attrName: string, getThisObj: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => any, factory: (element: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment) => {
                return DomRender.addAttribute(config, attrName, getThisObj, factory);
            }
        };
    }

    public static addAttributeCallBack(config: Config, attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void) {
        config.applyEvents = config.applyEvents ?? [];
        config.applyEvents.push({
            attrName,
            callBack
        })
        return {
            add: (attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void) => {
                return DomRender.addAttributeCallBack(config, attrName, callBack);
            }
        };
    }
}