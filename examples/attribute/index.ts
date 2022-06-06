import {DomRender} from 'dom-render';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {Home} from './components/home/home';
import HomeTemplate from './components/home/home.html';
import SubHomeTemplate from './components/subHome/subHome.html';
import {SubHome} from './components/subHome/subHome';

class Data {
    name = 'my name is dom-render';
    color = '#ff0000';
    addr = 'zzz';
    changeData() {
        this.name = RandomUtils.getRandomString(10);
        // this.color = RandomUtils.getRandomColor();
    }
}

const config: Config = {window}
config.targetElements = [
    DomRender.createComponent({type: Home, template: HomeTemplate}, config),
    DomRender.createComponent({type: SubHome, template: SubHomeTemplate}, config)
];
const data = DomRender.run(new Data(), document.querySelector('#app')!, config);