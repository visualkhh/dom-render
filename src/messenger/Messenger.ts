export class Channel {
    private subscribeCallback?: (from: string, data: any) => any;

    constructor(private messenger: Messenger, private key: string) {
    }

    publish(key: string, data: any) {
        const rtns: {key: string, data: any}[] = [];
        this.messenger.getChannels(key)?.forEach(it => {
            try { rtns.push({key, data: it.subscribeCallback?.(this.key, data)}); } catch (e) {}
        });
        return rtns;
    }

    allPublish(data: any) {
        const rtns: { key: string; data: any; }[][] = [];
        this.messenger.getAllChannelKeys().forEach(it => {
            rtns.push(this.publish(it, data));
        });
        return rtns.flat();
    }

    subscribe(subscribeCallback: (from: string, data: any) => any) {
        this.subscribeCallback = subscribeCallback;
    };
}

export abstract class Messenger {
    private channels = new Map<string, Channel[]>();
    createChannel(key: string): Channel {
        const channel = new Channel(this, key);
        this.channels.get(key) ? this.channels.get(key)!.push(channel) : this.channels.set(key, [channel]);
        return channel;
    }

    getChannels(key: string): Channel[] | undefined {
        return this.channels.get(key);
    }

    getAllChannels(): Channel[] {
        return Array.from(this.channels.values() ?? []).flat()
    }

    getAllChannelKeys(): string[] {
        return Array.from(this.channels.keys() ?? []).flat()
    }
}