import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {OnInitRender} from 'dom-render/lifecycle/OnInitRender';
import {CreatorMetaData, Render} from 'dom-render/RawSet';
import {OnProxyDomRender} from 'dom-render/lifecycle/OnProxyDomRender';
import {Config} from 'dom-render/Config';

export class DynamicComponent implements OnCreateRender, OnInitRender, OnProxyDomRender {
    name = 'dynamic component';
    age = '55';
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
}