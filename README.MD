![Single Page Application Framworks](assets/banner.png)
[![npm version](https://img.shields.io/badge/npm-v1.0.44-blue)](https://www.npmjs.com/package/dom-render) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE.md) [![Chat](https://img.shields.io/badge/discord-20%20online-brightgreen?logo=discord)](https://discord.gg/PW56dpns) [![Github](https://img.shields.io/badge/-github-black?logo=github)](https://github.com/visualkhh/dom-render)
# Our primary goals are
- view template engine
- Dom control and reorder
- all internal variables are managed by proxy. (DomRenderProxy)
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
<div>${this.name}$</div>
<div>${this.office.addr.first}$, ${this.office.addr.last}$, ${this.office.addr.street}$ (${this.office.name}$)</div>
<div dr="this.office.addr.street">${this.getOfficeFullAddr()}$</div>
```
## dr-if
```html
<div dr-if="true">true</div>
<div dr-if="this.gender==='M'">gender: M</div>
```
## dr-for, dr-for-of
```html
<div dr-for="var i = 0; i < this.friends.length; i++"> friend</div>
<div dr-for-of="this.friends"> ${#it#.name}$</div>
<div dr-for-of="$range(10, 20)"><div>${#it#}$</div><div>
<div dr-for="var i = 1 ; i <= 9 ; i++" dr-it="i">
    ${#it#}$ *
    <scope dr-for="var y = 1 ; y <= 9 ; y++" dr-it="y" dr-var="superIt=#it#" dr-strip="true">
        #it# = ${var.superIt * #it#}$
    </scope>
</div>
```

## dr-repeat
```html
<div dr-repeat="10"><div>#it#</div></div>
<div dr-repeat="$range(10, 20)"><div>#it#</div></div>
<div dr-repeat="$range(10, 20, 5)"><div>#it#</div></div>
<div dr-repeat="$range('10..5, 2')"><div>#it#</div></div>
```

## dr-inner-text, dr-inner-html
```html
<div dr-inner-text="'<b>aa</b> <button dr-event-click=\'alert(1)\'>aa</button>'"> friend</div>
<div dr-inner-html="'<b>aa</b> <button dr-event-click=\'alert(1)\'>aa</button>'"> friend</div>
```

## event
dr-event-(name) 
- click, mousedown, mouseup, dblclick, mouseover, mouseout, mousemove, mouseenter, mouseleave, contextmenu, keyup, keydown, keypress, change, input, submit, resize, focus, blur
- ref: element 
- variable: $event, $target
```html
click: <button dr-event-click="this.name = 'name' + new Date()">click</button> <br>
change: <input type="text" dr-event-change="this.name = $target.value"> <br>
input: <input type="text" dr-event-input="this.name = $target.value"> <br>
keyup: <input type="text" dr-event-keyup="this.name = $target.value"> <br>
...
keydown: <input type="text" dr-event-keydown="this.name = $target.value"><br>
submit: <form dr-event-submit="console.log($event); $event.preventDefault();"><input type="text"> <button type="submit">submit</button></form><br>
```

dr-window-event-popstate
- ref: window 
- variable: $target
```html
window-event-popstate: <input type="text" dr-window-event-popstate="alert(this.name)"><br>
```

dr-event
- other event
- ref: element
- variable: $params, $event
```html
<input dr-event:bind='eventName1, eventName2' dr-event="console.log('event', $params, $event)"  type="text">
```

## dr-value, value-link
dr-value
- The value is assigned the first time.

dr-value-link
- Value and variable values are referencing each other. It affects each other when changing. (Immediate reflection event: input)
```html
dr-value: <input type="text" dr-value="this.office.name"> <br>
dr-value-link: <input type="text" dr-value-link="this.office.addr.street"> <br>
```

## dr-attr
```html
<textarea dr-attr="{rows: this.age/2, cols: this.age}"></textarea>
<div dr-attr="{wow: '123', good: 123444}"></div>
<div dr-attr="['wow=123', 'good=123444']"></div>
<div dr-attr="'wow=123, good=123444'"></div>
```

## dr-class
```html
<div dr-class="{big: this.age > 50, red: this.age > 50}">
<div dr-class="'big yellow ' + (this.age > 50 ? 'old' : 'young')">
<div dr-class="['small', 'yellow']">
```

## dr-style
```html
<div dr-style="{fontSize: this.age + 'px'}"> style </div>
<div dr-style="{'font-size': '20px'}"> style</div>
<div dr-style="'font-size: ' + this.age +'px; margin: ' + this.age + 'px'"> style </div>
<div dr-style="['font-size: ' + this.age +'px', 'margin: ' + this.age + 'px']"> style </div>
```


## dr-strip
as-is
```html
<div dr-strip="true"><span>hello</span></div>
```
to-be
```html
<span>hello</span>
```

## dr-on-init
```html
<input dr-on-init="this.onInitElement">
```

## dr-before, dr-after
```html
<div dr-before="console.log('process before')" dr-after="console.log('process after')"></div>
```
## dr-complete
```html
<select dr-value-link="this.currentContry" dr-event-change="this.contryChange($event)">
    <option dr-for-of="this.languages" dr-value="#it#.key" dr-complete="this.currentContry='defaultValue'">${#it#.title}$</option>
</select>
```

---
# LifeCycle
```
* OnInitRender
  - onInitRender(): init render call
```
---

# Script
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
# Component
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

# dr-form
- event: change
- modify change: dr-form:event="input"
```typescript
class User {
  form = {};
  submit() {
    const form = (this.form as any)
    console.log('submit->', form, form.name, form.age, form.addr);
  }
}
```
```html
<form dr-form="this.form" dr-event-submit="this.submit(); $event.preventDefault();">
  name: <input name="name">
  age: <input name="age">
  addr: <input dr-form:event="input" name="addr">
  <button type="submit">submit</button>
</form>
```

# validator
```typescript
class PageValidator extends FormValidator { 
    required = new RequiredValidator();
    notEmpty = new NotEmptyValidator();
    empty = new EmptyValidator();
    regexp = new RegExpTestValidator(/[0-9]/);
    mix = new MultipleValidator([new RequiredValidator(), new NotEmptyValidator()]);

    all = new ValidValidatorArray((v, t, e) => {
        return !((v ?? []).filter(it => !it.checked).length > 0);
    });

    gender = new ValidValidatorArray((v, t, e) => {
        return ((v ?? []).filter(it => it.checked).length > 0);
    });
}
class User {
  form = new PageValidator();
  submit() {
    console.log('submit valid->', this.form.valid());
  }
  
  changeData() {
    this.form.required.value = 'new value';    
  }
}
```

```html
<form dr-form="this.form" dr-event-submit="this.submit(); $event.preventDefault();">
    <h2>validator</h2>
    required: <input name="required"> <br>
    notEmpty: <input name="notEmpty"> <br>
    empty: <input name="empty"> <br>
    regexp: /[0-9]/ <input name="regexp"> <br>
    <h2>mix validator</h2>
    required, notEmpty: <input name="mix"> <br>
    <h2>all check required</h2>
    <input name="all" type="checkbox" value="a">a <br>
    <input name="all" type="checkbox" value="b">b <br>

    <h2>gender chose one</h2>
    <input name="gender" type="radio" value="male"> Male <br>
    <input name="gender" type="radio" value="female"> Female<br>

    <button type="submit">check valid</button>
</form>
```
validator
- Validator (abstract)
- ValidatorArray (abstract)
- AllCheckedValidatorArray
- AllUnCheckedValidatorArray
- CheckedValidator
- CountEqualsCheckedValidatorArray
- CountEqualsUnCheckedValidatorArray
- CountGreaterThanCheckedValidatorArray
- CountGreaterThanEqualsCheckedValidatorArray
- CountGreaterThanEqualsUnCheckedValidatorArray
- CountGreaterThanUnCheckedValidatorArray
- CountLessThanCheckedValidatorArray
- CountLessThanEqualsCheckedValidatorArray
- CountLessThanEqualsUnCheckedValidatorArray
- CountLessThanUnCheckedValidatorArray
- CountUnCheckedValidatorArray
- EmptyValidator
- ExcludeCheckedValidatorArray
- FormValidator
- IncludeCheckedValidatorArray
- MultipleValidator
- NonPassValidator
- NotEmptyValidator
- NotRegExpTestValidator
- PassValidator
- RegExpTestValidator
- RequiredValidator
- UnCheckedValidator
- ValidMultipleValidator
- ValidValidator
- ValidValidatorArray
- ValueEqualsValidator
- ValueNotEqualsValidator


# Class
## Range
```typescript
const range = new Range(100,55, 10);
for (let data of new Range(100,55, 10)) {
  console.log(data);
}
const rangeArray = new Range(100,55, 10).toArray();
```

# Detect Get, Set
OnBeforeReturnSet
```typescript
export interface OnBeforeReturnSet {
    onBeforeReturnSet(name: string, value: any, fullPath?: string[]): void;
}
```
OnBeforeReturnGet
```typescript
export interface OnBeforeReturnGet {
    onBeforeReturnGet(name: string, value: any, fullPath?: string[]): void;
}
```

using detect
```typescript
{
    name: 'dom-render'
    onBeforeReturnSet: (name: string, value: any, fullpath: string[]) => {
        console.log('set name-->', name, value, fullpath);
    }
    onBeforeReturnGet: (name: string, value: any, fullpath: string[]) => {
        console.log('get name-->', name, value, fullpath);
    }
}
```
exclude detect property: Config
- proxyExcludeOnBeforeReturnGets: ['propertyName']
- proxyExcludeOnBeforeReturnSets: ['propertyName']
---

# Proxy
all internal variables are managed by proxy. (DomRenderProxy)
### exclude proxy (situation: Maximum call stack error)
exclude detect property: Config
- proxyExcludeTyps: [Class...]

Code base
```typescript
// frezz
{name : Object.freeze({...})}

// Shield Object type: {[k: string]: any}
{name : new Shield()}

// DomRenderProxy Final
{name : DomRenderProxy.final({...})}
```
--- 
# Config
```typescript
export type TargetElement = {
    _name: string,
    template?: string,
    styles?: string[],
    callBack: (target: Element, obj: any, rawSet: RawSet) => DocumentFragment,
    complete?: (target: Element, obj: any, rawSet: RawSet) => void
};

export type TargetAttr = {
    name: string,
    callBack: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => DocumentFragment,
    complete?: (target: Element, attrValue: string, obj: any, rawSet: RawSet) => void
};

export interface Config {
    targetElements?: TargetElement[];
    targetAttrs?: TargetAttr[];
    onElementInit?: (name: string, obj: any, rawSet: RawSet) => void;
    onAttrInit?: (name: string, attrValue: string, obj: any, rawSet: RawSet) => void;
    proxyExcludeTyps?: ConstructorType<any>[];
    proxyExcludeOnBeforeReturnSets?: string[];
    proxyExcludeOnBeforeReturnGets?: string[];
    scripts?: { [n: string]: any };
    applyEvents?: { attrName: string, callBack: (elements: Element, attrValue: string, obj: any) => void }[];
}
```
----
# License
* MIT
* visualkhh@gmail.com
