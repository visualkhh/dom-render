export class ScriptUtils {
    public static getVariablePaths(script: string): Set<string> {
        const usingVars = new Set<string>();

        class GetDetectProxy implements ProxyHandler<any> {
            public usingVars = usingVars;

            constructor(public prefix?: string) {
            }

            set(target: any, p: string | symbol, value: any, receiver: any): boolean {
                return true;
            }

            get(target: any, p: string | symbol, receiver: any): any {
                let items;
                if (typeof p === 'string') {
                    items = this.prefix ? this.prefix + '.' + p : p;
                    // console.log('add?', items)
                    this.usingVars.add(items)
                }
                return new Proxy(() => {
                }, new GetDetectProxy(items));
            }
        }

        const destUser = new Proxy(() => {
        }, new GetDetectProxy())

        try {
            // eslint-disable-next-line no-new-func,no-unused-expressions
            Function(`"use strict"; ${script}; `).bind(destUser)();
        } catch (e) {
            console.error(e);
        }
        return usingVars;
    }

    public static evalReturn(script: string, thisTarget: any): any {
        if (!script.startsWith('this.')) {
            script = 'this.' + script;
        }
        return this.eval('return ' + script + ';', thisTarget);
    }

    public static eval(script: string, thisTarget: any): any {
        // eslint-disable-next-line no-new-func,no-unused-expressions
        return Function(`"use strict"; ${script} `).bind(thisTarget)();
    }
}
