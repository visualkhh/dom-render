import {DomRender} from 'dom-render';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';
import {Config} from 'dom-render/Config';
import {Home} from './components/home/home';
import HomeTemplate from './components/home/home.html';

class Data {
    name = 'my name is dom-render';
    color = '#ff0000';
    addr = 'zzz';
    changeData() {
        this.name = RandomUtils.getRandomString(10);
        this.color = RandomUtils.getRandomColor();
    }
}

const config = {
    window
} as Config;
DomRender.addComponent(config, {type: Home}, {template: HomeTemplate});
const data = DomRender.run(new Data(), document.querySelector('#app')!, config);