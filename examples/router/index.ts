import {DomRender} from 'dom-render';
import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';
import {Config} from 'dom-render/Config';
import {RawSet} from 'dom-render/RawSet';
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
    RawSet.createComponentTargetElement('page-main', (e, o, r) => new Main(), MainTemplate, undefined, config),
    RawSet.createComponentTargetElement('page-second', (e, o, r) => new Second(), SecondTemplate, undefined, config),
    RawSet.createComponentTargetElement('page-detail', (e, o, r) => new Detail(), DetailTemplate, undefined, config)
];
config.routerType = 'hash';
const data = DomRender.run(new Data(), document.querySelector('#app')!, config);