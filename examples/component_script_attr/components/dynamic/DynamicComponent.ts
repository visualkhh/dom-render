import {RandomUtils} from 'dom-render/utils/random/RandomUtils';

export class DynamicComponent {
    name = 'dynamic component';
    age = '55';
    changeName() {
        this.name = RandomUtils.uuid();
    }
}