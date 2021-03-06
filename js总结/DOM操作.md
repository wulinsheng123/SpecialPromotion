### classList方法的用法

使用方式element.classList //返回全部的类名数组

例如: element.classList.add 

classList的全部方法：

1. add(className1, className2)    // 在元素中添加一个或多个元素

2. contains(className)  // 检验是否包含这个class

3. remove(className1, className2) //  移除一个或多个类名

4. toggle(className1, true|false) // 切换元素中的类名
---


### window.getComputedStyle


window.getComputedStyle(element[,pseudo-element]);

首先是有两个参数，元素和伪类。第二个参数不是必须的，当不查询伪类元素的时候可以忽略或者传入 null。

---

### setProperty ,getPropertyValue

获取某个样式

window.getComputedStyle("元素", "伪类").getPropertyValue(style);

setProperty() 方法用于设置一个新的 CSS 属性，同时也可以修改 CSS 声明块中已存在的属性。

propertyname	必需。一个字符串，表示创建或修改的属性。

value	可选，新的属性值。

priority	可选。字符串，规定是否需要设置属性的优先级 important。

window.getComputedStyle("元素", "伪类").setProperty(propertyname, value, priority)


---

### cssText

element.style.cssText = style

document.getElementById("ex1").style.cssText = "color: blue;";

---

### getBoundingClientRect 和 getClientRects 方法

返回中包含 bottom:, height:, left:, right:, top:, width:, x:, y:等属性
getClientRects 里有 getBoundingClientRect

---

### element.dispatchEvent()自定义事件的触发

```js
var dom = document.querySelector('#id')
document.addEventListener('alert', function (event) {
  console.log(event)
}, false);
```

1.let evt = document.createEvent("HTMLEvents"); 创建

2.evt.initEvent("alert", false, false); 初始化

3.dom.dispatchEvent(evt); 执行事件

| 参数   |      事件接口      |  初始化方法 |
|----------|:-------------:|------:|
| HTMLEvents |  HTMLEvent | initEvent() |
| MouseEvents |    MouseEvent   |   initMouseEvent() |
| UIEvents | UIEvent |    initUIEvent() |

---

####Event
自定义事件的函数有 Event、CustomEvent 和 dispatchEvent
```js
// 向 window派发一个resize内置事件
window.dispatchEvent(new Event('resize'))
 

// 直接自定义事件，使用 Event 构造函数：
var event = new Event('build');
var elem = document.querySelector('#id')
// 监听事件
elem.addEventListener('build', function (e) {
    // content
 }, false);
// 触发事件.
elem.dispatchEvent(event);
```

---
