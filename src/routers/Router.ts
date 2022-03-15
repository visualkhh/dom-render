import {DomRenderProxy} from '../DomRenderProxy';
import {EventManager} from '../events/EventManager';
import {RandomUtils} from '../utils/random/RandomUtils';
import {StringUtils} from '../utils/string/StringUtils';
import {DomRenderFinalProxy} from '../types/Types';
export type RouteData = {
    path: string;
    url: string;
    data?: any;
    searchParams: URLSearchParams;
    pathData?: any;
}
export abstract class Router {
    constructor(public rootObj: any, public window: Window) {
        this.go(this.getUrl());
    }

    attach(): void {
        const proxy = (this.rootObj as any)._DomRender_proxy as DomRenderProxy<any>
        if (proxy) {
            const key = `___${EventManager.ROUTER_VARNAME}`;
            proxy.render(key);
        }
    }

    testRegexp(regexp: string): boolean {
        const b = RegExp(regexp).test(this.getPath());
        return b;
    }

    abstract test(urlExpression: string): boolean;
    abstract set(path: string, data?: any, title?: string): void;
    getRouteData(urlExpression?: string): RouteData {
        const newVar = {
            path: this.getPath(),
            url: this.getUrl(),
            searchParams: this.getSearchParams()
        } as RouteData;

        const data = this.getData();
        if (data) {
            newVar.data = data;
        }
        if (urlExpression) {
            const data = this.getPathData(urlExpression);
            if (data) {
                newVar.pathData = data;
            }
        }
        return Object.freeze(newVar);
    }

    go(path: string, data?: any, title?: string): void ;
    // eslint-disable-next-line no-dupe-class-members
    go(path: string, urlExpressionOrData: string | any, dataOrTitle?: any | string, title?: string): void {
        // console.log('go-->', path, urlExpressionOrData, dataOrTitle, title);
        if (typeof urlExpressionOrData === 'string') {
            const pathData = this.getPathData(urlExpressionOrData, path);
            if (pathData) {
                dataOrTitle = dataOrTitle ?? {};
                dataOrTitle = {...dataOrTitle, ...pathData};
            }
            this.set(path, dataOrTitle, title ?? '');
        } else {
            this.set(path, urlExpressionOrData, dataOrTitle ?? '');
        }
        this.attach();
    }

    abstract getSearchParams(): URLSearchParams;
    abstract getData(): any;
    getPathData(urlExpression: string, currentUrl = this.getPath()): any {
        // console.log('getPathData-->', urlExpression, currentUrl);
        // const regexps = StringUtils.regexExec(/(\{(?:\{??[^{]*?\}))/g, urlExpression);
        // const regexpMap = new Map<string, string>()
        // regexps.forEach((item, idx) => {
        //     const key = `{${idx}}`;
        //     const value = item[0];
        //     urlExpression = urlExpression.replace(value, key)
        //     regexpMap.set(key, value)
        // })

        const urls = currentUrl.split('?')[0].split('/');
        const urlExpressions = urlExpression.split('/');
        if (urls.length !== urlExpressions.length) {
            return;
        }
        const data: {[name: string]: string } = {}
        for (let i = 0; i < urlExpressions.length; i++) {
            const it = urlExpressions[i];
            // it = regexpMap.get(it) ?? it;

            const urlit = urls[i];
            // ex) {serialNo:[0-9]+} or {no}  ..
            const execResult = /^\{(.+)\}$/g.exec(it);
            if (!execResult) {
                if (it !== urlit) {
                    return;
                }
                continue;
            }
            // regex check
            const [name, regex] = execResult[1].split(':'); // group1
            const regExp = RegExp(regex);
            if (regex && !regExp.test(urlit)) {
                return;
            }
            data[name] = urlit;
        }
        return data;
    }

    abstract getUrl(): string;
    abstract getPath(): string;
}