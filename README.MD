dom-render
===

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="dist/dom-render.js"></script>
</head>
<body>
<div id="app">


    <!--%
  for(var i = 0 ; i < this.cnt ; i ++) {
      write(`<div>${i}</div>`);
      write(`<div>${i}: <input type="text" dr-on-init="e${i+1}"><div>`);
  }
  %-->
    <div>
        <button dr-event-click="this.cc()">click me</button>
    </div>


</div>
</body>
<script>
    console.log('-----')
    const app = document.querySelector('#app');
    class User {
        friends;
        color;
        selectValue;
        textValue;
        e1;
        e2;

        constructor(cnt) {
            this.name = 'zz'
            this.cnt = cnt;
            this.color = RandomUtils.getRandomColor();
            //this.friends = ['a'];
        }

        cc($event) {
            // console.log('-->', $event, this.selectValue, this.textValue)
            console.log('-->', this.e1, this.e2)
            // this.textValue = RandomUtils.getRandomColor();
        }

        makeRandomColor() {
            return RandomUtils.getRandomColor();
        }

        element($element) {
            $element.value = RandomUtils.getRandomColor();
            console.log('ele', $element);
        }
    }
    const config = new Config();
    const targetNode = new TargetNode(app, TargetNodeMode.replace)
    let user = new User(1);
    const raw = {template: app.innerHTML, styles: ['p {color: /*%write(this.color)%*/}']};
    user = DomRender.render(document, user, raw, config, targetNode);
    setTimeout(() => {
        // user.friends.push(2)
        user.cnt = 2;
        // console.log('-->user.cnt', user, user.cnt)
        // user.friends = [2,3,4];
    }, 3000)
</script>
</html>





```
