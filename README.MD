dom-render
===
## view template engine
### Dom control and reorder using web component
```shell
npm install dom-render
````
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>dom-render</title>
</head>
<body id="app">
    <h1>template</h1>
    <h2>print</h2>
    <div>${this.name}</div>
    <div>${this.office.addr.first}, ${this.office.addr.last}, ${this.office.addr.street} (${this.office.name})</div>
    <div dr="this.office.addr.street">${this.getOfficeFullAddr()}</div>
    
    <h2>df-if</h2>
    <div dr-if="true"> true</div>
    <div dr-if="this.gender==='M'"> gender: M</div>
    
    <h2>df-for, of</h2>
    <div dr-for="var i = 0; i < this.friends.length; i++"> friend</div>
    <div dr-for-of="this.friends"> ${#it#.name}</div>
    <div dr-for="var i = 1 ; i <= 9 ; i++" dr-it="i">
        ${#it#} *
        <scope dr-for="var y = 1 ; y <= 9 ; y++" dr-it="y" dr-var="superIt=#it#" dr-strip="true">
            #it# = ${var.superIt * #it#}
        </scope>
    </div>
    
    <h1>event</h1>
    <h2>dr-event, click, change, input, keyup, keydown</h2>
    <div>
        click: <button dr-event-click="this.name = 'name' + new Date()">click</button> <br>
        change: <input type="text" dr-event-change="this.name = $target.value"> <br>
        input: <input type="text" dr-event-input="this.name = $target.value"> <br>
        keyup: <input type="text" dr-event-keyup="this.name = $target.value"> <br>
        keydown: <input type="text" dr-event-keydown="this.name = $target.value">
    </div>
    
    <h2>dr-value, value-link</h2>
    <div>
        dr-value: <input type="text" dr-value="this.office.name"> <br>
        dr-value-link: <input type="text" dr-value-link="this.office.addr.street"> <br>
    </div>
    
    <h1>attribute</h1>
    <h2>dr-attr</h2>
    <textarea dr-attr="{rows: this.age/2, cols: this.age}"></textarea>
    <h2>dr-style</h2>
    <div dr-style="{fontSize: this.age+'px'}"> style </div>
    <button dr-event-click="this.age = Math.floor(Math.random() * 20)"> change age</button>
    
    <h1>lifeCycle</h1>
    <h2>dr-on-init</h2>
    <div>
        <input dr-on-init="this.onInitElement" value="init-test-value">
    </div>
    <script src="./src/index.ts"></script>
</body>
</html>
```
```typescript
class User {
    name: string;
    age: number;
    gender: string;
    friends: User[];
    office = {
        name: 'guro',
        addr: {
            first: 'guro',
            last: ' digital',
            street: ' complex'
        }
    }

    constructor(name: string, age: number, gender: string, friends: User[] = []) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.friends = friends;
    }

    onInitElement(e: HTMLInputElement) {
        console.log('inputElement onInit', e.value)
    }

    getOfficeFullAddr() {
        return `${this.office.addr.first}, ${this.office.addr.last}, ${this.office.addr.street} (${this.office.name})`
    }

    sayName() {
        console.log(this.name)
    }
}
const friends = [new User('friend1', 15, 'M'), new User('friend2', 16, 'F')]
const target = document.querySelector('#app');
if (target) {
    const user = DomRender.run(new User('parent', 10, 'M', friends), target);
}
```
