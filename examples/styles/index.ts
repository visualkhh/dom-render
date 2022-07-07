import {DomRender} from 'dom-render';
import {Config} from 'dom-render/Config';
import {User} from './components/user/user';
import {Profile} from './components/profile/profile';
import ProfileTemplate from './components/profile/profile.html'
import ProfileStyle from './components/profile/profile.css'
import UserTemplate from './components/user/user.html'
import UserStyle from './components/user/user.css'
class Data {
    name = 'my name is dom-render';
    friends = [{name: 'a'}, {name: 'b'}, {name: 'c'}];
    sw = true;
    toggle() {
        this.sw = !this.sw;
    }
}
const data = DomRender.run(new Data(), document.querySelector('#app'), {
    targetElements: [
        DomRender.createComponent({type: Profile, template: ProfileTemplate, styles: ProfileStyle}),
        DomRender.createComponent({type: User, template: UserTemplate, styles: UserStyle})
    ]
});
setTimeout(() => {
    console.log('-->', data);
    data.friends[1].name = Date.now().toString()
}, 10000)