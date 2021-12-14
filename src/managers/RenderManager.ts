import {DomRenderProxy} from '../DomRenderProxy';

export class RenderManager {
    static render(obj: any, target = Object.keys(obj)) {
        const domRenderProxy = obj._DomRender_proxy as DomRenderProxy<any>;
        if (domRenderProxy) {
            target.forEach(it => {
                domRenderProxy.root([it], obj[it]);
            })
        }
    }
}