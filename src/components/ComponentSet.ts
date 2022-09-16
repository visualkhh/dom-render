export type ComponentSetConfig = {objPath?: string | null};
export class ComponentSet {
    public config: ComponentSetConfig;
    constructor(public obj: any, public template?: string, public styles?: string[], config?: ComponentSetConfig) {
        this.config = Object.assign({objPath: 'obj'} as ComponentSetConfig, config)
    }

    // get html() {
    //     const styles = (this.styles?.map(it => `<style>${it}</style>`) ?? []).join(' ');
    //     const template = (this.template ?? '');
    //     return styles + template;
    // }
}
