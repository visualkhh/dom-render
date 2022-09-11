import {Router} from './Router';

export class PathRouter extends Router {
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
        return (new URL(this.window.document.location.href)).searchParams;
    }

    set(path: string, data?: any, title: string = ''): void {
        super.pushState(data, title, path);
    }

    getUrl(): string {
        const url = new URL(this.window.document.location.href);
        return url.pathname + url.search;
    }

    getPath(): string {
        return this.window.location.pathname;
    }
}
