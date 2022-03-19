import {DomRender} from 'dom-render';
import {Config} from 'dom-render/Config';
import {RawSet} from 'dom-render/RawSet';
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

    onProxyDomRender({messenger}: Config): void {
        messenger?.createChannel(this).filter((f) => (f.data?.data.age ?? 0) > 5).subscribe((f) => {
            this.rcvData = f.data;
            return {data: 'good', action: 'actionGood'}
        });
        // messenger?.createChannel(this).subscribe((f) => {
        //     this.rcvData = f.data;
        //     return {data: 'good', action: 'actionGood'}
        // });
        // console.log('onProxyDomRender', messenger);
    }
}

const config = {
    window
} as Config;
const scripts = {
    concat: function (data: string, str: string) {
        return data + str;
    }
}
config.scripts = scripts;
DomRender
    .addComponent(config, {type: Profile}, {template: ProfileTemplate})
    .add({type: Home}, {template: HomeTemplate, styles: [HomeStyle]});

DomRender.addAttribute(config, 'link',
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
);

DomRender.addAttributeCallBack(config, 'wow', (e, a, o) => {
    e.addEventListener('click', (event) => {
        alert((event.target as any).value);
    })
})

const data = DomRender.run(new Index(), document.querySelector('#app')!, config);

// setInterval(() => {
//     console.log(data)
// }, 5000)