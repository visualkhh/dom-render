import {ConstructorType, DomRenderFinalProxy} from '../types/Types';

export type ChannelData = {
    data?: any;
    action?: string;
}
export type ChannelDataSet = {
    channel: Channel;
    data?: ChannelData;
}
export class Channel {
    private subscribeCallback?: (from: ChannelDataSet) => any;

    constructor(private messenger: Messenger, public obj: object, public key: string) {
    }

    publish(key: string | object | ConstructorType<any>, data: ChannelData) {
        const rtns: ChannelDataSet[] = [];
        const sendData = Object.freeze({...data});
        this.messenger.getChannels(key)?.forEach(it => {
            const fromDataSet = {channel: this, data: sendData};
            try { rtns.push({channel: it, data: it.subscribeCallback?.(fromDataSet)}); } catch (e) { console.error(e); }
        });
        return rtns;
    }

    allPublish(data: ChannelData) {
        const rtns: ChannelDataSet[][] = [];
        this.messenger.getAllChannelKeys().forEach(it => {
            rtns.push(this.publish(it, data));
        });
        return rtns.flat();
    }

    subscribeFilter(filterF: (from: ChannelDataSet) => boolean, subscribeCallback: (from: ChannelDataSet) => ChannelData | void | undefined) {
        this.subscribeCallback = (from: ChannelDataSet) => {
            if (filterF(from)) {
                const rtn = subscribeCallback(from);
                if (rtn) {
                    return rtn;
                }
            }
        };
    }

    subscribe(subscribeCallback: (from: ChannelDataSet) => ChannelData | void | undefined) {
        this.subscribeCallback = subscribeCallback;
    };

    unsubscribe() {
        this.subscribeCallback = undefined;
        const channels = this.messenger.getChannels(this.key);
        if (channels) {
            // find this channel and remove it
            const index = channels.indexOf(this);
            if (index >= 0) {
                channels.splice(index, 1);
            }
        }
    };
}

export abstract class Messenger {
    private channels = new Map<string, Channel[]>();
    createChannel(obj: object, key = obj.constructor.name): Channel {
        const channel = DomRenderFinalProxy.final(new Channel(this, obj, key));
        this.channels.get(key) ? this.channels.get(key)!.push(channel) : this.channels.set(key, [channel]);
        return channel;
    }

    getChannels(key: string | object | ConstructorType<any>): Channel[] | undefined {
        if (typeof key === 'string') {
            return this.channels.get(key);
        } else if (typeof key === 'function') {
            return this.channels.get(key.name);
        } else {
            return this.channels.get(key.constructor.name);
        }
    }

    getAllChannels(): Channel[] {
        return Array.from(this.channels.values() ?? []).flat()
    }

    getAllChannelKeys(): string[] {
        return Array.from(this.channels.keys() ?? []).flat()
    }
}