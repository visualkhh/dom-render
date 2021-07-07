dom-render
===
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="../dist/DomRenderCompiler.js"></script>
</head>
<body>
<div id="body">
    <div>
        <!--%
        for(var i = 0 ; i < 10; i++) {
            write(this.name + '--' + i)
        }
        %-->
    </div>
</div>
</body>
<script>
    console.log('-->', ScopeRawSet)
    const body = document.querySelector('#body');
    let targetNode = new TargetNode(body, TargetNodeMode.appendChild)
    const raw = new ScopeRawSet(body.innerHTML)

    class User {
        constructor(name, height, width) {
            this.name = name;
            this.height = height;
            this.width = width;
        }
    }

    const user = new User('visualkhh', 55, 22);
    let compiler = new DomRenderCompiler(raw, user).run(targetNode);
    targetNode = compiler.root.executeToTargetNode();
    console.log(targetNode)
</script>
</html>

```
