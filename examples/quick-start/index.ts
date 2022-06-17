import {DomRender} from 'dom-render';

class Data {
    name = 'my name is dom-render';
    friends = [{name: 'a'}, {name: 'b'}, {name: 'c'}];
}

const data = DomRender.run(new Data(), document.querySelector('#app')!);
setTimeout(() => {
    data.friends[1].name = Date.now().toString()
}, 10000)