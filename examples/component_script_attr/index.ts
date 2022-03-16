import {DomRender} from 'dom-render';
import {Config} from 'dom-render/Config';
import {RawSet} from 'dom-render/RawSet';
import {ScriptUtils} from 'dom-render/utils/script/ScriptUtils';
import {Profile} from './components/profile/profile';
import ProfileTemplate from './components/profile/profile.html';
import {Home} from './components/home/home';
import HomeTemplate from './components/home/home.html';
import {ComponentSet} from 'dom-render/components/ComponentSet';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';

class Data {
    toggle = true;
    name = 'my name is dom-render';
    link = 'https://naver.com';
    age = 55;
    dynamicComponent: ComponentSet;
    constructor() {
        this.dynamicComponent = new ComponentSet(
            {
                name: 'dynamic component',
                age: '55',
            },
            '<h1 class="gold">aa ${this.name}$</h1><div><button dr-event-click="this.name = Date.now();">changeName</button></div>', ['.gold {color: gold}, .aqua { color: aqua}']);
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
    .add({type: Home}, {template: HomeTemplate});

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

const data = DomRender.run(new Data(), document.querySelector('#app')!, config);

// setInterval(() => {
//     console.log(data)
// }, 5000)