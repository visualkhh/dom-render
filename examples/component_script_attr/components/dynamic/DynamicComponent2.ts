import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {OnProxyDomRender} from 'dom-render/lifecycle/OnProxyDomRender';
import {OnDestroyRender} from 'dom-render/lifecycle/OnDestroyRender';

export class DynamicComponent2 implements OnProxyDomRender, OnDestroyRender {
    name = 'dynamic component222';
    age = '55222';
    changeName() {
        this.name = RandomUtils.uuid();
    }

    onProxyDomRender(config: Config): void {
        console.log('DynamicComponent2 onProxyDomRender', config);
    }

    onDestroyRender(): void {
        console.log('onDestroyRender', 'DynamicComponent2');
    }
}