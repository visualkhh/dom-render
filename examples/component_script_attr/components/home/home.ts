import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {OnProxyDomRender} from 'dom-render/lifecycle/OnProxyDomRender';
import {Config} from 'dom-render/configs/Config';
import {Channel} from 'dom-render/messenger/Messenger';
import {Index} from '../../index';

export class Home implements OnCreateRender, OnProxyDomRender {
    private channel?: Channel;

    constructor(public name: string, public age: number, public title: string) {
    }

    onCreateRender(data: any): void {
        console.log('onCreateRender->', data);
    }

    onInit(data: any): void {
        console.log('onInit', data);
    }

    sendIndexMessage() {
        const rtn = this.channel?.publish(Index, {
            name: this.name,
            age: this.age,
            title: this.title
        });
        console.log('sendIndexMessage return value: ', rtn);
        // console.log('channel-->', this.channel);
    }

    onProxyDomRender({messenger}: Config): void {
        this.channel = messenger?.createChannel(Home);
    }
}
