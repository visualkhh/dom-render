export type ComponentSetConfig = {objPath?: string | null};
export class ComponentSet {
    public config: ComponentSetConfig;
    constructor(public obj: any, public template?: string, public styles?: string[], config?: ComponentSetConfig) {
        this.config = Object.assign({objPath: 'obj'} as ComponentSetConfig, config)
    }
}
