regex
- https://blog.hexabrain.net/205
- https://www.youtube.com/watch?v=rhzKDrUiJVk
- https://www.youtube.com/watch?v=t3M6toIflyQ&t=1146s
- https://regexr.com/
- https://gungadinn.github.io/data/2019/07/14/RegularExpression/
- 전방, 후방: https://sub0709.tistory.com/54
- scope search:  https://www.regextester.com/1969 ```\(([^)]+)\)```
- between
  - https://www.py4u.net/discuss/1414338  
  - https://stackoverflow.com/questions/2403122/regular-expression-to-extract-text-between-square-brackets  ```(?<=\[).+?(?=\])```
  - ```
    (?<=\[).+?(?=\])
    (\[(?:\[??[^\[]*?\]))
    (?:(?<=\().+?(?=\))|(?<=\[).+?(?=\]))
    ```
  - 탐욕을 줄이다.
    ```
    <.*> 정규식의 결과로 <html> 문자열을 원했지만, 최대한의 문자열인 <html><head><title>Title</title> 을 소비했다.
    이를 해결하기 위해서 *?, +?, ??, {m, n}? 과 같이 ? 문자열을 사용하여 탐욕을 줄일 수 있다.
    ```
javascript
  - iterator
    - https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Iteration_protocols
    - https://pks2974.medium.com/javascript%EC%99%80-iterator-cdee90b11c0f
    - https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html
    - https://www.geekabyte.io/2019/06/typing-iterables-and-iterators-with.html
tsconfig
- https://www.typescriptlang.org/ko/docs/handbook/compiler-options.html
- UtilsTypes
  - https://www.typescriptlang.org/docs/handbook/utility-types.html

custom-element
- https://ko.javascript.info/custom-elements
- https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined
- https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry
- https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_custom_elements
- https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_shadow_DOM
- https://ko.javascript.info/custom-elements#ref-562
- 
slot
  - https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots
  - https://github.com/mdn/web-components-examples/tree/master/element-details
  - https://alexband.tistory.com/53
- custom tag
  - https://github.com/mdn/web-components-examples/blob/master/popup-info-box-web-component/index.html


querySelector
 - https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
 - 