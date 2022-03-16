import {RandomUtils} from 'dom-render/utils/random/RandomUtils';

export class DynamicComponent2 {
    name = 'dynamic component222';
    age = '55222';
    changeName() {
        this.name = RandomUtils.uuid();
    }
}