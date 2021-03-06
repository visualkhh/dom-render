import {DomRender} from 'dom-render';
import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {Config} from 'dom-render/Configs/Config';
import {Main} from './pages/main/main';
import MainTemplate from './pages/main/main.html';
import {Second} from './pages/second/second';
import SecondTemplate from './pages/second/second.html';
import {Detail} from './pages/detail/detail';
import DetailTemplate from './pages/detail/detail.html';

class Data implements OnCreateRender {
    constructor() {
    }

    name = 'my name is dom-render';
    count = 1;

    plusCount() {
        this.count++;
    }

    onCreateRender() {
    }
}

const config: Config = {
    window
};
config.targetElements = [
    DomRender.createComponent({type: Main, tagName: 'page-main', template: MainTemplate}),
    DomRender.createComponent({type: Second, tagName: 'page-second', template: SecondTemplate}),
    DomRender.createComponent({type: Detail, tagName: 'page-detail', template: DetailTemplate})
]
config.routerType = 'hash';
const data = DomRender.run(new Data(), document.querySelector('#app'), config);