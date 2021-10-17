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
<div>${this.name}</div>
<div>${this.office.addr.first}, ${this.office.addr.last}, ${this.office.addr.street} (${this.office.name})</div>
<div dr="this.office.addr.street">${this.getOfficeFullAddr()}</div>
```
## dr-if
```html
<div dr-if="true">true</div>
<div dr-if="this.gender==='M'">gender: M</div>
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
    <option dr-for-of="this.languages" dr-value="#it#.key" dr-complete="this.currentContry='defaultValue'">${#it#.title}</option>
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

# validation
```html
  <div class="row mb-3">
        <div class="col">
            <span>아이디</span>
            <input class="w-100" type="text" name="id" placeholder="아이디" dr-value-link="this.form.id.value" dr-event-blur="this.form.id.valid()" required/>
            <span dr-on-init="this.form.id.msgElement" class="d-none"></span>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col">
            <span>비밀번호</span>
            <input class="w-100" type="password" name="id" placeholder="숫자, 영문, 특수문자 조합 최소 8자~20자" dr-value-link="this.form.password.value" dr-event-blur="this.form.password.valid()" required/>
            <span dr-on-init="this.form.password.msgElement" >password valid message section</span>
            <input class="w-100" type="password" name="id" placeholder="비밀번호 재입력"  dr-value-link="this.form.confirmPassword" required/>
            <span dr-class="{'d-block': this.form.password != this.form.confirmPassword, 'text-danger': this.form.password != this.form.confirmPassword}">2nd input password valid message section</span>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col">
            <span>이메일</span>
            <input class="w-100" type="email" name="id" placeholder="이메일" dr-value-link="this.form.email" required/>
            <span class="">2nd input password valid message section</span>
        </div>
    </div>
</div>
```
```typescript
class SignUp {
 public form = new class extends Validation {
        id = new class extends Validation {
            public msgElement!: HTMLElement;
            valid(): boolean {
                let valid = false;
                if (this.length == 0) {
                    this.msgElement.className = 'd-block text-danger';
                    this.msgElement.textContent = '아이디를 입력해주세요.';
                } else if (this.length < 3 || this.length > 20) {
                    this.msgElement.className = 'd-block text-danger';
                    this.msgElement.textContent = '아이디는 4글자 이상 20자 미만 이어야 합니다.';
                } else {
                    let isExist = false;
                    if (isExist) {
                        this.msgElement.className = 'd-block text-danger';
                        this.msgElement.textContent = '이미 사용중인 아이디입니다. 다른 아이디를 이용해주세요.';
                    } else {
                        this.msgElement.className = 'd-block text-success';
                        this.msgElement.textContent = '사용 가능한 아이디입니다.';
                        valid = true;
                    }
                }
                return valid;
            }
        }();
        password = new class extends Validation {
            public msgElement!: HTMLElement;
            valid(): boolean {
                let valid = false;
                let regExp = /^.*(?=.)(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
                const ERROR_REQUIRE_PW = '비밀번호를 입력해주세요.';
                const ERROR_PW_LENGTH = '비밀번호는 8글자~20글자로 이루어져야 합니다.';
                const ERROR_PW_REGEXP = '비밀번호는 숫자, 영문, 특수문자 조합으로 이루어져야 합니다.';
                const SUCCESS_AVAILABLE_USER_PW = '사용 가능한 비밀번호입니다.';
                if (this.length == 0) {
                    this.msgElement.className = 'd-block text-danger';
                    this.msgElement.textContent = ERROR_REQUIRE_PW;
                } else if (this.length < 8 || this.length > 20) {
                    this.msgElement.className = 'd-block text-danger';
                    this.msgElement.textContent = ERROR_PW_LENGTH;
                } else {
                    if (regExp.test(this.value)) {
                        this.msgElement.className = 'd-block text-success';
                        this.msgElement.textContent = SUCCESS_AVAILABLE_USER_PW;
                        valid = true;
                    } else {
                        this.msgElement.className = 'd-block text-danger';
                        this.msgElement.textContent = ERROR_PW_REGEXP;
                    }
                }
                return valid;
            }
        }();
        confirmPassword = new class extends Validation {
            value = '';
            valid(): boolean {
                return true;
            }
        }();
        email = new class extends Validation {
            value = '';
            valid(): boolean {
                return true;
            }
        }();
        valid() {
            return this.childValid()
        }
    }();
}
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
