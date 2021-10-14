![Single Page Application Framworks](assets/banner.png)
[![npm version](https://img.shields.io/badge/npm-v1.0.44-blue)](https://www.npmjs.com/package/dom-render) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE.md) [![Chat](https://img.shields.io/badge/discord-20%20online-brightgreen?logo=discord)](https://discord.gg/PW56dpns) [![Github](https://img.shields.io/badge/-github-black?logo=github)](https://github.com/visualkhh/dom-render)
# Our primary goals are
- view template engine
- Dom control and reorder using web component
---

# 🚀 Quick start 
```shell
npm install dom-render
````
---
# 😃 examples
- [examples project](./example)
--- 

# 📄 Code description
## initialized
```html
<!doctype html><html lang="en"><body id="app"></body></html>
```
```typescript
const target = document.querySelector('#app');
const data = DomRender.run({name: 'my name is dom-render'}, target);
data.name = 'modify name';
```
## print and call
```html
<div>${this.name}</div>
<div>${this.office.addr.first}, ${this.office.addr.last}, ${this.office.addr.street} (${this.office.name})</div>
<div dr="this.office.addr.street">${this.getOfficeFullAddr()}</div>
```
## dr-if
```html
<div dr-if="true">true</div>
<div dr-if="this.gender==='M'"> gender: M</div>
```
## dr-for, dr-for-of
```html
<div dr-for="var i = 0; i < this.friends.length; i++"> friend</div>
<div dr-for-of="this.friends"> ${#it#.name}</div>
<div dr-for="var i = 1 ; i <= 9 ; i++" dr-it="i">
    ${#it#} *
    <scope dr-for="var y = 1 ; y <= 9 ; y++" dr-it="y" dr-var="superIt=#it#" dr-strip="true">
        #it# = ${var.superIt * #it#}
    </scope>
</div>
```

## dr-inner-text, dr-inner-html
```html
<div dr-inner-text="'<b>aa</b> <button dr-event-click=\'alert(1)\'>aa</button>'"> friend</div>
<div dr-inner-html="'<b>aa</b> <button dr-event-click=\'alert(1)\'>aa</button>'"> friend</div>
```

## event
- element
  - dr-event
    - click, mousedown, mouseup, dblclick, mouseover, mouseout, mousemove, mouseenter, mouseleave, contextmenu, keyup, keydown, keypress, change, input, submit, resize
- window
  - dr-window
    - event-popstate
```html
<div>
    click: <button dr-event-click="this.name = 'name' + new Date()">click</button> <br>
    change: <input type="text" dr-event-change="this.name = $target.value"> <br>
    input: <input type="text" dr-event-input="this.name = $target.value"> <br>
    keyup: <input type="text" dr-event-keyup="this.name = $target.value"> <br>
    ...
    keydown: <input type="text" dr-event-keydown="this.name = $target.value"><br>
    submit: <form dr-event-submit="console.log($event); $event.preventDefault();"><input type="text"> <button type="submit">submit</button></form><br>
    window-event-popstate: <input type="text" dr-window-event-popstate="alert(this.name)"><br>
</div>
```

## dr-value, value-link
```html
dr-value: <input type="text" dr-value="this.office.name"> <br>
dr-value-link: <input type="text" dr-value-link="this.office.addr.street"> <br>
```

## dr-attr
```html
<textarea dr-attr="{rows: this.age/2, cols: this.age}"></textarea>
```

## dr-style
```html
<div dr-style="{fontSize: this.age+'px'}"> style </div>
```


## dr-strip
as-is
```html
<div dr-strip="false"><span>hello</span></div>
```
to-be
```html
<span>hello</span>
```

## dr-on-init
```html
<input dr-on-init="this.onInitElement">
```
---

# script
```typescript
new DomRender.run(obj, target, {
  scripts: {
    concat: function (head: string, tail: string) {
      return head + tail; 
    }
  }
});
```
using script
```typescript
const data = config.scripts.concat('head', 'tail')
```
```html
<div>${$scripts.concat('head', 'tail')}</div>
<div dr-if="$scripts.concat('wow', 'good') === 'wowgood'"> is wowgood</div>
```

---
# component
```typescript
export namespace Profile {
  export const templat = '<div>aaaaa${this.name}aaaaa </div>';
  export const styles = ['p {color: red}', 'div {margin: ${this.margin} + \'px\' }'];
  export class Component {
    public name = 'default name';
    public margin = 5;
    public say() {
        console.log('say!~')
    }
  }
}

new DomRender.run(obj, target, {
  targetElements: [
    RawSet.createComponentTargetElement('my-element', (e, o, r) => new Profile.Component(), Profile.templat, Profile.styles, scripts)
  ],
});
```
using component
```html
<my-element dr-on-init="$component.say();"></my-element>
```
- attribute
  - dr-on-init: component created init call script
    - $component: component  instance
    - $element: element instance
    - $attribute: element attribute object
    - $innerHTML: element innerHTML string
---

# LifeCycle
```
* OnInitRender
  - onInitRender(): init render call
```
----
# License
* MIT
* visualkhh@gmail.com
