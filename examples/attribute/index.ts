import {DomRender} from 'dom-render';
import {RandomUtils} from 'dom-render/utils/random/RandomUtils';

class Data {
    name = 'my name is dom-render';
    color = '#ff0000';

    changeData() {
        this.name = RandomUtils.getRandomString(10);
        this.color = RandomUtils.getRandomColor();
    }
}

const data = DomRender.run(new Data(), document.querySelector('#app')!);