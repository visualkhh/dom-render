DOM-RENDER  
===   
[![typescript](https://img.shields.io/badge/-npm-black?logo=npm)](https://www.npmjs.com/package/dom-render) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)
* view template engine
* Dom control and reorder and render
* all internal variables are managed by proxy. (DomRenderProxy)

# 🚀 Quick start 
```html
<script src="https://visualkhh.github.io/dom-render/cdn/dom-render@1.0.69.js"></script>
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body id="app">
${this.name}$
<script src="https://visualkhh.github.io/dom-render/cdn/dom-render@1.0.69.js"></script>
<script>
  let data = {
    name: 'my name is dom-render'
  };
  data = DomRender.run(data , document.querySelector('#app'));
</script>
</body>
</html>
```

## Print and Call Expression
<details>
  <summary>${...}$, #{...}# <strong>🔻(click)</strong></summary>

### ${}$ innerTEXT, #{}# innerHTML
```html
<body id="app">
${this.name}$  <!-- outout: <i>my name is dom-render</i> -->
#{this.name}# <!-- outout text is italic: my name is dom-render -->
<script>
  let data = {
    name: '<i>my name is dom-render</i>'
  };
  data = DomRender.run(data , document.querySelector('#app'));
</script>
</body>
```
</details>

# dom-render attributes

## control, print Statement
<details>
  <summary>dr-if<strong>🔻(click)</strong></summary>

### if element render
```html
<body id="app">
  <div dr-if="true">true</div>  <!-- render -->
  <div dr-if="this.gender === 'M'">gender: M</div> <!-- No Render -->
<script>
  let data = {
    gender: 'F'
  };
  data = DomRender.run(data , document.querySelector('#app'));
</script>
</body>
```
</details>

<details>
  <summary>dr-for, dr-for-of<strong>🔻(click)</strong></summary>

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
</details>

<details>
  <summary>dr-repeat<strong>🔻(click)</strong></summary>

```html
<div dr-repeat="10"><div>#it#</div></div>
<div dr-repeat="$range(10, 20)"><div>#it#</div></div>
<div dr-repeat="$range(10, 20, 5)"><div>#it#</div></div>
<div dr-repeat="$range('10..5, 2')"><div>#it#</div></div>
```
</details>

<details>
  <summary>dr-inner-text, dr-inner-html<strong>🔻(click)</strong></summary>

```html
<div dr-inner-text="'<b>aa</b> <button dr-event-click=\'alert(1)\'>aa</button>'"> friend</div>
<div dr-inner-html="'<b>aa</b> <button dr-event-click=\'alert(1)\'>aa</button>'"> friend</div>
```
</details>


## event
<details>
  <summary>dr-event-(name)<strong>🔻(click)</strong></summary>

* click, mousedown, mouseup, dblclick, mouseover, mouseout, mousemove, mouseenter, mouseleave, contextmenu, keyup, keydown, keypress, change, input, submit, resize, focus, blur
* ref: element
* variable: $event, $target
```html
click: <button dr-event-click="this.name = 'name' + new Date()">click</button> <br>
change: <input type="text" dr-event-change="this.name = $target.value"> <br>
input: <input type="text" dr-event-input="this.name = $target.value"> <br>
keyup: <input type="text" dr-event-keyup="this.name = $target.value"> <br>
...
keydown: <input type="text" dr-event-keydown="this.name = $target.value"><br>
submit: <form dr-event-submit="console.log($event); $event.preventDefault();"><input type="text"> <button type="submit">submit</button></form><br>
```
</details>

<details>
  <summary>dr-window-event-popstate<strong>🔻(click)</strong></summary>

* ref: window
* variable: $target

```html
window-event-popstate: <input type="text" dr-window-event-popstate="alert(this.name)"><br>
```
</details>

<details>
  <summary>dr-event<strong>🔻(click)</strong></summary>

* other event
* ref: element
* variable: $params, $event


```html
<input dr-event:bind='eventName1, eventName2' dr-event="console.log('event', $params, $event)"  type="text">
```
</details>



## value
<details>
  <summary>dr-value, value-link<strong>🔻(click)</strong></summary>

* dr-value
  * The value is assigned the first time.
* dr-value-link
  * Value and variable values are referencing each other. It affects each other when changing. (Immediate reflection event: input)

```html
dr-value: <input type="text" dr-value="this.office.name"> <br>
dr-value-link: <input type="text" dr-value-link="this.office.addr.street"> <br>
```
</details>

## other
<details>
  <summary>dr-attr<strong>🔻(click)</strong></summary>

```html
<textarea dr-attr="{rows: this.age/2, cols: this.age}"></textarea>
<div dr-attr="{wow: '123', good: 123444}"></div>
<div dr-attr="['wow=123', 'good=123444']"></div>
<div dr-attr="'wow=123, good=123444'"></div>
```
</details>

<details>
  <summary>dr-class<strong>🔻(click)</strong></summary>

```html
<div dr-class="{big: this.age > 50, red: this.age > 50}"></div>
<div dr-class="'big yellow ' + (this.age > 50 ? 'old' : 'young')"></div>
<div dr-class="['small', 'yellow']"></div>
```
</details>

<details>
  <summary>dr-style<strong>🔻(click)</strong></summary>

```html
<div dr-style="{fontSize: this.age + 'px'}"> style </div>
<div dr-style="{'font-size': '20px'}"> style</div>
<div dr-style="'font-size: ' + this.age +'px; margin: ' + this.age + 'px'"> style </div>
<div dr-style="['font-size: ' + this.age +'px', 'margin: ' + this.age + 'px']"> style </div>
```
</details>

<details>
  <summary>dr-strip<strong>🔻(click)</strong></summary>

```html
<div dr-strip="true"><span>hello</span></div> <!-- output html : <span>hello</span> -->
```
</details>

<details>
  <summary>dr-before, dr-after<strong>🔻(click)</strong></summary>

```html
<div dr-before="console.log('process before')" dr-after="console.log('process after')"></div>
```
</details>

<details>
  <summary>dr-complete<strong>🔻(click)</strong></summary>

```html
<select dr-value-link="this.currentContry" dr-event-change="this.contryChange($event)">
  <option dr-for-of="this.languages" dr-value="#it#.key" dr-complete="this.currentContry='defaultValue'">${#it#.title}$</option>
</select>
```
</details>

## LifeCycle
* OnInitRender
  * onInitRender(): init render call

## Script
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
