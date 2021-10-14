export namespace Profile {
    export const templat = '<div>aaaaa${this.name}aaaaa <!--${this.name}--></div>';
    export const styles = ['', ''];
    export class Component {
        public name = 'default name'
        public __domrender_components = {}
        constructor() {
            console.log('-- -----')
        }
    }
}
