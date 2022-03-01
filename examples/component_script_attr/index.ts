import {DomRender} from 'dom-render';
import {Config} from 'dom-render/Config';
import {RawSet} from 'dom-render/RawSet';
import template from './profile.html';
import {ScriptUtils} from 'dom-render/utils/script/ScriptUtils';
class User {
    name?: string;
    age?: number;
}
class Data {
    name = 'my name is dom-render';
    link = 'https://naver.com';
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
const component = RawSet.createComponentTargetElement('profile', (e, o, r) => new User(), template, undefined, config);
config.targetElements = [component];
const targetAttribute = RawSet.createComponentTargetAttribute(
    'link',
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
config.targetAttrs = [targetAttribute];
const data = DomRender.run(new Data(), document.querySelector('#app')!, config);