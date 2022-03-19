DOM-RENDER  
===   
[![typescript](https://img.shields.io/badge/-npm-black?logo=npm)](https://www.npmjs.com/package/dom-render) [![license](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)
* view template engine
* Dom control and reorder and render
* all internal variables are managed by proxy. (DomRenderProxy)

# 🚀 Quick start 
```html
<script src="https://visualkhh.github.io/dom-render/cdn/dom-render@1.0.73.js"></script>
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
<script src="https://visualkhh.github.io/dom-render/cdn/dom-render@1.0.73.js"></script>
<script>
  let data = {
    name: 'my name is dom-render'
  };
  data = DomRender.run(data , document.querySelector('#app'));
</script>
</body>
</html>
```

# 😃 examples
- [examples](./examples)


## Expression
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

## dr-form
<details>
  <summary>form<strong>🔻(click)</strong></summary>
* event: change  
* modify change: dr-form:event="input"

```html
<body id="app">
<form dr-form="this.form" dr-event-submit="this.submit(); $event.preventDefault();">
  name: <input name="name">
  age: <input name="age">
  <button type="submit">submit</button>
</form>
<script>
  let data = {
    form: {},
    submit() {
      console.log(this.form);
    }
  };
  data = DomRender.run(data , document.querySelector('#app'));
</script>
</body>
<!-- 💥 submit call --> 
<!-- console: {name: 'name data', age: 'age data'}  -->
```
</details>

<details>
  <summary>validator<strong>🔻(click)</strong></summary>

```html
<body id="app">
<form dr-form="this.form" dr-event-submit="this.submit(); $event.preventDefault();">
    name: <input name="name">
    age: <input name="age">
    <button type="submit">submit</button>
</form>
<script>
    const form = new FormValidator();
    form.name = new NotEmptyValidator();
    form.age = new NotEmptyValidator();
    let data = {
        form,
        submit() {
            if (this.form.valid()){
                console.log('valid');
            } else {
                console.log('inValid');
            }
        }
    };
    data = DomRender.run(data , document.querySelector('#app'));
</script>
</body>
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
</details>



## Route
<details>
  <summary>Route<strong>🔻(click)</strong></summary>

- [examples](./examples/router)

* config routerType: 'hash' | 'path' | 'none'  (default: 'none')
```typescript
// Config
const config: Config = {
  window
};
DomRender.addComponent(config, {type: Main, tagName: 'page-main'}, {template: MainTemplate})
        .add({type: Second, tagName: 'page-second'}, {template: SecondTemplate})
        .add({type: Detail, tagName: 'page-detail'}, {template: DetailTemplate});
config.routerType = 'hash';
config.routerType = 'hash';
const data = DomRender.run(new Data(), document.querySelector('#app')!, config);
```
```html
<header>
    <button dr-event-click="$router.go('/')">main</button>
    <button dr-event-click="$router.go('/second', {secondata: 555})">second</button>
    <button dr-event-click="$router.go('/detail/25?name=zzz')">detail</button>
  </div>
</header>
<main>
  <page-main dr-if="$router.test('/')"></page-main>
  <page-second dr-if="$router.test('/second')"></page-second>
  <page-detail url='/detail/{id:[0-9]+}' dr-if="$router.test($attribute.url)" dr-on-create="$router.getRouteData($attribute.url)"></page-detail>
</main>
```

```typescript
import {RouteData} from 'dom-render/routers/Router';
import {OnCreateRender} from 'dom-render/lifecycle/OnCreateRender';

export class Detail implements OnCreateRender {
    name = 'Detail';

    onCreateRender(routeData: RouteData) {
        console.log('routeData->', routeData);
    }
}
```
```typescript
// RouteData type
type RouteData = {
  path: string;
  url: string;
  data?: any;
  searchParams: URLSearchParams;
  pathData?: any;
}
```
</details>

## Messenger (Data transmission) 
* publish, subscribe
<details>
  <summary>publish<strong>🔻(click)</strong></summary>

```typescript
export class Home implements OnProxyDomRender {
    private channel?: Channel;

  sendIndexMessage() {
    const rtn = this.channel?.publish(Index, {
      name: this.name,
      age: this.age,
      title: this.title
    });
    console.log('sendIndexMessage return value: ', rtn);
  }
    
    onProxyDomRender({messenger}: Config): void {
        this.channel = messenger?.createChannel(Home);
    }
}
```
</details>
<details>
  <summary>subscribe<strong>🔻(click)</strong></summary>

```typescript
class Index implements OnProxyDomRender {
    onProxyDomRender({messenger}: Config): void {
      messenger?.createChannel(this).filter((data) => (data.age ?? 0) > 5).subscribe((data) => {
        this.rcvData = data;
        return {data: 'good', action: 'actionGood'}
      });
      // messenger?.createChannel(this).subscribe((data) => {
      //     this.rcvData = data;
      //     return {data: 'good', action: 'actionGood'}
      // });
    }
}
````
</details>

## Class
<details>
  <summary>Range<strong>🔻(click)</strong></summary>

```javascript
const range = new Range(100,55, 10);
for (let data of new Range(100,55, 10)) {
  console.log(data);
}
const rangeArray = new Range(100,55, 10).toArray();
```
</details>

## Detect Get, Set
<details>
  <summary>Method Proxy<strong>🔻(click)</strong></summary>

### using detect
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

### OnBeforeReturnSet
```typescript
export interface OnBeforeReturnSet {
    onBeforeReturnSet(name: string, value: any, fullPath?: string[]): void;
}
```
### OnBeforeReturnGet
```typescript
export interface OnBeforeReturnGet {
    onBeforeReturnGet(name: string, value: any, fullPath?: string[]): void;
}
```
</details>



## Proxy
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


## LifeCycle
* OnCreateRender
  * onCreateRender(): created call
* OnInitRender
  * onInitRender(): init render call
* OnDestroyRender
  * onDestroyRender(): component Destroy call

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
# Component, Attribute, AttributeCallBack
# 😃 examples
- [examples](./examples/component_script_attr)
```html
<body id="app">
${this.name}$
<h1>component</h1>
<profile dr-on-component-init="$component.name='jhone'; $component.age=55;"><b>${#component#.details}$</b></profile>
<profile dr-on-component-init="$component.name='cal'; $component.age=56;"><b>detail-2</b></profile>
<profile dr-on-component-init="$component.name='rose'; $component.age=57;">
    <profile dr-on-component-init="$component.name='rose-sub'; $component.age=156;">
        <b>${this.name}$</b>
    </profile>
</profile>
<h3>component data link and detect</h3>
<Profile dr-if="this.toggle" dr-detect="$component.age = this.age" dr-on-component-init="$component.name='papa'; $component.age=58;">
    <b>${this.name}$</b>
</Profile>

<button dr-event-click="this.name = new Date().toString();">change name</button>
<button dr-event-click="this.age = Date.now();">change age</button>
<button dr-event-click="this.toggle = !this.toggle;">change toggle</button>

<j1>component constructor, on-create, dr-on-component-init</j1>
<home dr-constructor="[this.name, this.age, 'home welcom']" dr-on-create="{type: 'onCreate', data: 'datadata'}" dr-on-component-init="$component.onInit('data')"></home>



<h1>scripts</h1>
<div>
    ${$scripts.concat('hello', 'tail')}$
</div>

<h1>attr</h1>
<button link="this.link">
link attribute
</button>
<h1>attrCallBack</h1>
<input id="callback" type="text" wow>
</body>
```
```typescript
DomRender
        .addComponent(config, {type: Profile}, {template: ProfileTemplate})
        .add({type: Home}, {template: HomeTemplate});

DomRender.addAttribute(config, 'link',
        (element: Element, attrValue: string, obj: any, rawSet: RawSet) => {
          return obj;
        },
        (element: Element, attrValue: string, obj: any, rawSet: RawSet) => {
          const fag = window.document.createDocumentFragment();
          if (attrValue) {
            const n = element.cloneNode(true) as Element;
            attrValue = ScriptUtils.eval(`return ${attrValue}`, obj)
            n.addEventListener('click', () => {
              location.href = attrValue;
            });
            fag.append(n);
          }
          return fag;
        }
);

DomRender.addAttributeCallBack(config, 'wow', (e, a, o) => {
  e.addEventListener('click', (event) => {
    alert((event.target as any).value);
  })
})
const data = DomRender.run(new Data(), document.querySelector('#app')!, config);
```
using component
```html
<my-element dr-on-component-init="$component.say();"></my-element>
```
- attribute
  - dr-on-component-init: component created init call script
    - $component: component  instance
    - $element: element instance
    - $attribute: element attribute object
    - $innerHTML: element innerHTML string
---

# License
* MIT
* visualkhh@gmail.com
