import {ConstructorType, DomRenderFinalProxy} from '../types/Types';

enum CallBackType {
    FILTER,
    MAP,
    SUBSCRIBE
}

export type ChannelData = {
    channel: Channel;
    data?: (any | undefined);
}
export type ChannelMetaData = {
    channel: Channel;
    action?: string;
}
export class ChannelSubscription {
    constructor(public channel: Channel, public subscriber: ChannelSubscriber) {
    }

    unsubscribe() {
        this.subscriber.unsubscribe();
    }
}
export class ChannelSubscriber {
    public parentSubscriber?: ChannelSubscriber;
    public callbacks: ({type: CallBackType, callback: (data: any, metaData: ChannelMetaData) => any | undefined})[] = [];
    constructor(public channel: Channel) {
    }

    exeCallback(data: any, metaData: ChannelMetaData) {
        for (const callback of this.callbacks) {
            if (callback.type === CallBackType.FILTER && !callback.callback(data, metaData)) {
                break;
            } else if (callback.type === CallBackType.MAP) {
                data = callback.callback(data, metaData);
            } else if (callback.type === CallBackType.SUBSCRIBE) {
                data = callback.callback(data, metaData);
                break;
            }
        }
        return data;
    }

    // chaining point
    filter<D = any>(callback: (data: D, meta: ChannelMetaData) => any) {
        this.callbacks.push({type: CallBackType.FILTER, callback});
        return this;
    }

    map<D = any, R = any>(callback: (data: D, meta: ChannelMetaData) => R) {
        this.callbacks.push({type: CallBackType.MAP, callback});
        return this;
    }

    subscribe(callback: (data: any, metaData: ChannelMetaData) => any | undefined) {
        this.callbacks.push({type: CallBackType.SUBSCRIBE, callback});
        this.channel.subscribers.add(this);
        return new ChannelSubscription(this.channel, this);
    }

    unsubscribe() {
        this.channel.subscribers.delete(this);
    }

    deleteSubscriber() {
        this.unsubscribe();
        this.channel.subscribers.delete(this);
    }
}

export class Channel {
    public subscribers = new Set<ChannelSubscriber>();
    constructor(private messenger: Messenger, public obj: object, public key: string) {
    }

    publish(key: string | object | ConstructorType<any>, data: any, action?: string) {
        const rtns: ChannelData[] = [];
        this.messenger.getChannels(key)?.forEach(it => {
            try {
                it.subscribers.forEach(its => {
                    const rdata = its.exeCallback(data, {channel: this, action});
                    rtns.push({channel: it, data: rdata});
                });
            } catch (e) {
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

    // string point
    filter<D = any>(filterF: (data: D, meta: ChannelMetaData) => boolean) {
        const subscriber = new ChannelSubscriber(this);
        subscriber.filter(filterF);
        return subscriber;
    }

    map<D = any, R = any>(filterF: (data: D, meta: ChannelMetaData) => R) {
        const subscriber = new ChannelSubscriber(this);
        subscriber.map(filterF);
        return subscriber;
    }

    subscribe(subscribeCallback: (data: any, meta: ChannelMetaData) => any | void | undefined) {
        const subscriber = new ChannelSubscriber(this);
        return subscriber.subscribe(subscribeCallback);
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
        if (typeof key === 'object') {
            key = key.constructor.name;
        } else if (typeof key === 'function') {
            key = key.name;
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
