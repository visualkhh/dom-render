import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {OnProxyDomRender} from 'dom-render/lifecycle/OnProxyDomRender';
import {Config} from 'dom-render/Config';
import {Channel, Messenger} from 'dom-render/messenger/Messenger';

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
        this.channel?.publish('index', {
            name: this.name,
            age: this.age,
            title: this.title
        });
    }

    onProxyDomRender({messenger}: Config): void {
        this.channel = messenger?.createChannel('home');
    }
}