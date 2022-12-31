export class StorageUtils {
    public static setLocalStorageItem(k: string, v: string | any, window: Window) {
        if (typeof v === 'object') {
            v = JSON.stringify(v);
        }
        window.localStorage.setItem(k, v);
    }

    public static setSessionStorageItem(k: string, v: string | any, window: Window) {
        if (typeof v === 'object') {
            v = JSON.stringify(v);
        }
        window.sessionStorage.setItem(k, v);
    }

    public static getLocalStorageItem(k: string, window: Window) {
        return window.localStorage.getItem(k);
    }

    public static getSessionStorageItem(k: string, window: Window) {
        return window.sessionStorage.getItem(k);
    }

    public static cutLocalStorageItem(k: string, window: Window) {
        const data = StorageUtils.getLocalStorageItem(k, window);
        StorageUtils.removeLocalStorageItem(k, window);
        return data;
    }

    public static cutSessionStorageItem(k: string, window: Window) {
        const data = StorageUtils.getSessionStorageItem(k, window);
        StorageUtils.removeSessionStorageItem(k, window);
        return data;
    }

    public static removeLocalStorageItem(k: string, window: Window) {
        return window.localStorage.removeItem(k);
    }

    public static removeSessionStorageItem(k: string, window: Window) {
        return window.sessionStorage.removeItem(k);
    }

    public static getLocalStorageJsonItem<T>(k: string, window: Window): T | undefined {
        const item = window.localStorage.getItem(k);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (e) {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    public static getSessionStorageJsonItem<T>(k: string, window: Window): T | undefined {
        const item = window.sessionStorage.getItem(k);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (e) {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    public static cutLocalStorageJsonItem<T>(k: string, window: Window): T | undefined {
        const item = StorageUtils.getLocalStorageJsonItem(k, window);
        StorageUtils.removeLocalStorageItem(k, window);
        return item as (T | undefined);
    }

    public static cutSessionStorageJsonItem<T>(k: string, window: Window): T | undefined {
        const item = StorageUtils.getSessionStorageJsonItem(k, window);
        StorageUtils.removeSessionStorageItem(k, window);
        return item as T | undefined;
    }

    public static clearLocalStorage(window: Window) {
        window.localStorage.clear();
    }

    public static clearSessionStorage(window: Window) {
        window.sessionStorage.clear();
    }
}
