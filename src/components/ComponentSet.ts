export class ComponentSet {
    constructor(public obj: any, public template?: string, public styles?: string[], public styleLocale = false) {
    }

    // get html() {
    //     const styles = (this.styles?.map(it => `<style>${it}</style>`) ?? []).join(' ');
    //     const template = (this.template ?? '');
    //     return styles + template;
    // }
}
