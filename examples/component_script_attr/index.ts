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
import dynamic1 from './components/dynamic/dynamic1.html';
import dynamic1style from './components/dynamic/dynamic1.css';
import dynamic2 from './components/dynamic/dynamic2.html';
import dynamic2style from './components/dynamic/dynamic2.css';
export class Index implements OnProxyDomRender {
    toggle = true;
    name = 'my name is dom-render';
    link = 'https://naver.com';
    age = 55;
    rcvData: any;
    dynamicComponent: ComponentSet;

    dynamicComponent1:ComponentSet = new ComponentSet(new DynamicComponent(), dynamic1 as string, [dynamic1style as string]);
    dynamicComponent2 = new ComponentSet(new DynamicComponent2(), dynamic2, [dynamic2style]);

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
    ],
    operatorAround: {
        drThis: {
            beforeAttr: (value, obj) => {
                // console.log('beforeAttr', value);
                return value;
            },
            before: (data1, obj) => {
                // console.log('before', data1);
                if (data1) {
                data1.obj.around = data1.obj.around + Date.now().toString()
                }
                return data1;
            },
            after: (data1, obj) => {
                // console.log('after', data1);
            }

        }
    }
};
const data = DomRender.run(new Index(), document.querySelector('#app')!, config);
setTimeout(() => {
    console.log(data)
}, 5000)
