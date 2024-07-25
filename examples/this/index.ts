import {DomRender} from 'dom-render';
import {Config} from 'dom-render/configs/Config';
import { ComponentSet } from 'dom-render/components/ComponentSet';

export class Home {
  constructor() {
    console.log('Home constructor');
  }
}

export class Profile {
  constructor() {
    console.log('Profile constructor');
  }
}

export class SubThis {
  child: any;
  constructor() {
    this.child = new ComponentSet({name: 'subThis'}, '<div><h1>sub-sub-this [${@this@.name}$]</h1></div>');
  }
}

export class Index {
  child: any;
  wow = 'wowvvvvvvvvv';
  constructor() {
    this.child = new ComponentSet(new SubThis(), `<div><h1>subthis</h1> @this@.child <div dr-this="@this@.child">sssssssss</div></div>`);
    console.log('@@@@@@@@@@', this.child.obj)
    // this.child = new ComponentSet(new SubThis(), '<div><h1>subthis @this@</h1>dd${#this#)}$dd</div>');
  }
}

const config: Config = {
  window,
  scripts: {
    concat: function (data: string, str: string) {
      return data + str;
    }
  },
  targetElements: [
    DomRender.createComponent({type: Profile, template: '<div>profile</div>'}),
    DomRender.createComponent({type: Home, template: '<div>home</div>'})
  ]
};
const data = DomRender.run(new Index(), document.querySelector('#app')!, config);
