import {ConstructorType, DomRenderFinalProxy} from '../types/Types';

// export type ChannelData = {
//     data?: any;
//     action?: string;
// }
class FilterSkipException {
    constructor() {
    }
}

export type ChannelData = {
    channel: Channel;
    data?: (any | undefined);
}
export type ChannelMetaData = {
    channel: Channel;
    action?: string;
}

export class ChannelSubscriber {
    public parentSubscriber?: ChannelSubscriber;

    constructor(
        public channel: Channel,
        public callback?: (data: any, metaData: ChannelMetaData) => any | undefined
    ) {
    }

    publish(data: any, metaData: ChannelMetaData) {
        if (this.callback) {
            return this.callback(data, metaData);
        }
    }

    subscribe(callback: (data: any, metaData: ChannelMetaData) => any | undefined) {
        this.callback = callback;
    }

    unsubscribe() {
        this.callback = undefined;
        this.channel.unsubscribe(this);
        this.parentSubscriber?.unsubscribe();
    }

    deleteChannel() {
        this.unsubscribe();
        this.channel.deleteChannel();
    }
}

export class Channel {
    // private subscribeCallback?: (data: any, meta: ChannelMetaData) => any | void | undefined;
    // private filterFnc = (from: ChannelDataSet) => true;
    private subscribers = new Set<ChannelSubscriber>();

    constructor(private messenger: Messenger, public obj: object, public key: string) {
    }

    publish(key: string | object | ConstructorType<any>, data: any, action?: string) {
        const rtns: ChannelData[] = [];
        // const sendData = data; // Object.freeze({...data});
        this.messenger.getChannels(key)?.forEach(it => {
            // const fromDataSet = {channel: this, data: sendData};
            try {
                it.subscribers.forEach(its => {
                    rtns.push({channel: it, data: its.publish(data, {channel: this, action})});
                });
            } catch (e) {
                if (e instanceof FilterSkipException) {
                    return;
                }
                console.error(e);
            }
        });
        return rtns;
    }

    allPublish(data: any, action: string) {
        const rtns: (any | undefined)[][] = [];
        this.messenger.getAllChannelKeys().forEach(it => {
            rtns.push(this.publish(it, data));
        });
        return rtns.flat();
    }

    filter(filterF: (data: any, meta: ChannelMetaData) => boolean) {
        const subscriber = new ChannelSubscriber(this);
        const rs = this.subscribe((data: any, meta: ChannelMetaData) => {
            if (filterF(data, meta)) {
                subscriber.publish(data, meta);
            } else {
                throw new FilterSkipException();
            }
        });
        subscriber.parentSubscriber = rs;
        return subscriber;
        // filterF()
        // const oldFilter = this.filterFnc;
        // this.filterFnc = (f: ChannelDataSet) => {
        //     if (filterF(f)) {
        //         return oldFilter(f);
        //     }
        //     return false;
        // }
        // return this;
    }

    subscribe(subscribeCallback: (data: any, meta: ChannelMetaData) => any | void | undefined) {
        const subscriber = new ChannelSubscriber(this, subscribeCallback);
        this.subscribers.add(subscriber);
        // this.subscribeCallback = subscribeCallback;
        return subscriber;
    };

    unsubscribe(cs: ChannelSubscriber) {
        this.subscribers.delete(cs);
        //     this.subscribeCallback = undefined;
        //     const channels = this.messenger.getChannels(this.key);
        //     if (channels) {
        //         // find this channel and remove it
        //         const index = channels.indexOf(this);
        //         if (index >= 0) {
        //             channels.splice(index, 1);
        //         }
        //     }
    };

    deleteChannel() {
        this.messenger.deleteChannel(this);
    };
}

export abstract class Messenger {
    private channels = new Set<Channel>();

    createChannel(obj: object, key = obj.constructor.name): Channel {
        const channel = DomRenderFinalProxy.final(new Channel(this, obj, key));
        this.channels.add(channel);
        // this.channels.get(key) ? this.channels.get(key)!.push(channel) : this.channels.set(key, [channel]);
        return channel;
    }

    deleteChannel(channel: Channel) {
        this.channels.delete(channel);
    }

    addChannel(channel: Channel) {
        this.channels.add(channel);
    }

    getChannels(key: string | object | ConstructorType<any>): Channel[] {
        if (typeof key === 'function') {
            key = key.name;
        } else {
            key = key.constructor.name;
        }
        return Array.from(this.channels.values()).filter(it => it.key === key);
    }

    getAllChannels(): Channel[] {
        return Array.from(this.channels.values());
    }

    getAllChannelKeys(): string[] {
        return Array.from(this.channels.values()).map(it => it.key);
    }
}