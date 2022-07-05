import {ConstructorType, DomRenderFinalProxy} from '../types/Types';
import {Config} from '../Config';

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
    channel?: Channel;
    action?: string;
}

export class ChannelSubscription {
    constructor(public channel: Channel, public subscriber: ChannelSubscriber) {
    }

    unsubscribe() {
        this.subscriber.unsubscribe();
    }
}

export class ChannelSubscriber<SD = any> {
    public parentSubscriber?: ChannelSubscriber;
    public callbacks: ({ type: CallBackType, callback: (data: any, metaData: ChannelMetaData) => any | undefined })[] = [];

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
    filter<D = SD>(callback: (data: D, meta: ChannelMetaData) => boolean): ChannelSubscriber<SD> {
        this.callbacks.push({type: CallBackType.FILTER, callback});
        return this;
    }

    map<D = SD, R = any>(callback: (data: D, meta: ChannelMetaData) => R): ChannelSubscriber<R> {
        this.callbacks.push({type: CallBackType.MAP, callback});
        return this as unknown as ChannelSubscriber<R>;
    }

    subscribe(callback: (data: SD, metaData: ChannelMetaData) => any | undefined) {
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
        const subscriber = new ChannelSubscriber<D>(this);
        subscriber.filter(filterF);
        return subscriber;
    }

    map<D = any, R = any>(filterF: (data: D, meta: ChannelMetaData) => R): ChannelSubscriber<R> {
        const subscriber = new ChannelSubscriber<R>(this);
        subscriber.map(filterF);
        return subscriber;
    }

    subscribe<D = any>(subscribeCallback: (data: D, meta: ChannelMetaData) => any | void | undefined) {
        const subscriber = new ChannelSubscriber<D>(this);
        return subscriber.subscribe(subscribeCallback);
    };

    deleteChannel() {
        this.messenger.deleteChannel(this);
    };
}

type MessengerEventDetail = {
    key: string | object | ConstructorType<any>;
    data?: any;
    action?: string;
    result?: (c: ChannelData[]) => void;
}

type MessengerSubscribeEventDetail = {
    obj: any;
    key?: string | object | ConstructorType<any>;
    init: (channel: Channel, subscription: ChannelSubscription) => void;
    subscribe: (data: any, meta: ChannelMetaData) => void;
}

export abstract class Messenger {
    private channels = new Set<Channel>();
    static readonly EVENT_PUBLISH_KEY = 'domRenderMessenger_publish';
    static readonly EVENT_SUBSCRIBE_KEY = 'domRenderMessenger_subscribe';
    constructor(private config: Config) {
        this.config.window.addEventListener(Messenger.EVENT_PUBLISH_KEY, (e: Event) => {
            const detail = ((e as CustomEvent).detail as MessengerEventDetail);
            // console.log('--->', detail)
            const rtns: ChannelData[] = [];
            this.getChannels(detail.key)?.forEach(it => {
                try {
                    it.subscribers.forEach(its => {
                        const rdata = its.exeCallback(detail.data, {action: detail.action});
                        rtns.push({channel: it, data: rdata});
                    });
                } catch (e) {
                    console.error(e);
                }
            });
            detail.result?.(rtns);
        });
        this.config.window.addEventListener(Messenger.EVENT_SUBSCRIBE_KEY, (e: Event) => {
            const detail = ((e as CustomEvent).detail as MessengerSubscribeEventDetail);
            // console.log('--->', detail)
            const channel = this.createChannel(detail.obj, detail.key);
            detail.init(channel, channel.subscribe(detail.subscribe));
        });
    }

    public static publish(window: Window, detail: MessengerEventDetail) {
        window.dispatchEvent(new CustomEvent(Messenger.EVENT_PUBLISH_KEY, {detail}));
    }

    public static subscribe(window: Window, detail: MessengerSubscribeEventDetail) {
        window.dispatchEvent(new CustomEvent(Messenger.EVENT_SUBSCRIBE_KEY, {detail}));
    }

    createChannel(obj: any, key = obj.constructor.name): Channel {
        const channel = DomRenderFinalProxy.final(new Channel(this, obj, key)) as Channel;
        this.channels.add(channel);
        // this.channels.get(key) ? this.channels.get(key)!.push(channel) : this.channels.set(key, [channel]);
        return channel;
    }

    deleteChannel(channel: Channel) {
        this.channels.delete(channel);
    }

    deleteChannelFromObj(obj: any) {
        if (obj) {
            this.channels.forEach(it => {
                if (it.obj === obj) {
                    // console.log('dddddddddddd', obj)
                    this.deleteChannel(it);
                }
            });
        }
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
