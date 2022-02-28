import {DomRender} from 'dom-render';

class Data {
    name = 'my name is dom-render';
}

const data = DomRender.run(new Data(), document.querySelector('#app')!);