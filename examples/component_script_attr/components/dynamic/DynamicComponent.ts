import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {OnInitRender} from 'dom-render/lifecycle/OnInitRender';
import {CreatorMetaData} from 'dom-render/rawsets/CreatorMetaData';
import {Render} from 'dom-render/rawsets/Render';
import {OnProxyDomRender} from 'dom-render/lifecycle/OnProxyDomRender';
import {Config} from 'dom-render/configs/Config';
import {OnDestroyRender} from 'dom-render/lifecycle/OnDestroyRender';

export class DynamicComponent implements OnCreateRender, OnInitRender, OnProxyDomRender, OnDestroyRender {
    name = 'dynamic component';
    age = '55';
    around = 'd Around'
    changeName() {
        this.name = RandomUtils.uuid();
    }

    onCreateRender(a: number, b: number, c: number): void {
        console.log('------', 'onCreateRender ', a, b, c);
    }

    onInitRender(data?: { render?: Render; creatorMetaData?: CreatorMetaData }): void {
        console.log('------', 'onInitRender ')
    }

    onProxyDomRender(config: Config): void {
        console.log('DynamicComponent onProxyDomRender', config);
    }

    onDestroyRender(): void {
        console.log('onDestroyRender', 'DynamicComponent');
    }
}
