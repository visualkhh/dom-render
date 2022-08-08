import {DomRender} from 'dom-render';
import {Config} from 'dom-render/configs/Config';
import {RawSet} from 'dom-render/rawsets/RawSet';
import {ScriptUtils} from 'dom-render/utils/script/ScriptUtils';
import {Profile} from './components/profile/profile';
import ProfileTemplate from './components/profile/profile.html';
import {Home} from './components/home/home';
import HomeTemplate from './components/home/home.html';
import HomeStyle from './components/home/home.css';
import {ComponentSet} from 'dom-render/components/ComponentSet';
import {DynamicComponent} from './components/dynamic/DynamicComponent';
import {DynamicComponent2} from './components/dynamic/DynamicComponent2';
import {OnProxyDomRender} from 'dom-render/lifecycle/OnProxyDomRender';
import {ChannelMetaData, Messenger} from 'dom-render/messenger/Messenger';

export class Index implements OnProxyDomRender {
    toggle = true;
    name = 'my name is dom-render';
    link = 'https://naver.com';
    age = 55;
    rcvData: any;
    dynamicComponent: ComponentSet;
    dynamicComponent1 = new ComponentSet(
        new DynamicComponent(),
        '<h1 class="gold">aa ${this.name}$</h1><div><button dr-event-click="this.changeName()">changeName</button></div>', ['.gold {color: gold} .aqua { color: aqua}']
    );
    dynamicComponent2 = new ComponentSet(
        new DynamicComponent2(),
        '<h1 class="aqua">aa ${this.name}$</h1><div><button dr-event-click="this.changeName()">changeName</button></div>', ['.gold {color: gold} .aqua { color: aqua}']
    );

    constructor() {
        this.dynamicComponent = this.dynamicComponent1;
    }

    changeDynamicComponent() {
        this.dynamicComponent = this.dynamicComponent.obj instanceof DynamicComponent ? this.dynamicComponent2 : this.dynamicComponent1;
    }

    eventMessenger() {
        Messenger.publish(window,
            {
                key: Index, data: {name: 'index'}, action: 'type1',
                result: (c) => {
                    console.log('----', c);
                }
            }
        );
    }

    onProxyDomRender({messenger}: Config): void {
        messenger?.createChannel(this)
            .filter((data: any, meta: ChannelMetaData) => {
                console.log('filter-->');
                return (data.age ?? 0) > 5;
            })
            .map((data: any, meta: ChannelMetaData) => {
                console.log('-------', data);
                return data.age;
            })
            .subscribe((data: any, meta: ChannelMetaData) => {
                console.log('-----ss--', data);
                this.rcvData = data;
                return {
                    data: 'good',
                    action: 'actionGood'
                }
            });

        Messenger.subscribe(window,
            {
                obj: this,
                init: (c, s) => {
                    console.log('--ccccc--', c);
                    s.unsubscribe();
                    c.deleteChannel();
                },
                subscribe: (data: any, meta: ChannelMetaData) => {
                    console.log('---data-', data, meta);
                }
            });
        // messenger?.createChannel(this).filter((data) => (data.age ?? 0) > 5).subscribe((data) => {
        //     this.rcvData = data;
        //     return {data: 'good', action: 'actionGood'}
        // });
        // messenger?.createChannel(this).subscribe((data) => {
        //     this.rcvData = data;
        //     return {data: 'good', action: 'actionGood'}
        // });
        // console.log('onProxyDomRender', messenger);
    }
}

const config: Config = {
    window,
    scripts: {
        concat: function (data: string, str: string) {
            return data + str;
        }
    },
    targetElements: [
        DomRender.createComponent({type: Profile, template: ProfileTemplate}),
        DomRender.createComponent({type: Home, template: HomeTemplate, styles: HomeStyle})
    ],
    targetAttrs: [
        DomRender.createAttribute('link',
            (element: Element, attrValue: string, obj: any, rawSet: RawSet) => {
                return obj;
            },
            (element: Element, attrValue: string, obj: any, rawSet: RawSet) => {
                const fag = window.document.createDocumentFragment();
                if (attrValue) {
                    const n = element.cloneNode(true) as Element;
                    attrValue = ScriptUtils.eval(`return ${attrValue}`, obj)
                    n.addEventListener('click', () => {
                        location.href = attrValue;
                    });
                    fag.append(n);
                }
                return fag;
            }
        )
    ],
    applyEvents: [
        {
            attrName: 'wow',
            callBack: (e, a, o) => {
                e.addEventListener('click', (event) => {
                    alert((event.target as any).value);
                })
            }
        }
    ]
};

const data = DomRender.run(new Index(), document.querySelector('#app')!, config);
setTimeout(() => {
    console.log(data)
}, 5000)
