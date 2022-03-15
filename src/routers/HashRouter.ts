import {Router} from './Router';
import {LocationUtils} from '../utils/location/LocationUtils';

export class HashRouter extends Router {
    test(urlExpression: string): boolean {
        if (this.getPathData(urlExpression)) {
            return true;
        } else {
            return false;
        }
    }

    getData(): any {
        return this.window.history.state;
    }

    getSearchParams(): URLSearchParams {
        return new URLSearchParams(LocationUtils.hashSearch(this.window));
    }

    set(path: string, data?: any, title: string = ''): void {
        path = '#' + path;
        this.window.history.pushState(data, title, path);
    }

    getUrl(): string {
        return LocationUtils.hash(this.window) || '/';
    }

    getPath(): string {
        return LocationUtils.hashPath(this.window) || '/';
    }
}