tags: []
categories: []
date: 2017-03-09 15:42:00
---
在前端发展迅速的今天，模块化已经不是什么新的名词。在查阅资料之前，本人对模块化一知半解，"不就引用sea.js或者require.js的事吗"。其实，学习技术怕的不就是只知道皮毛就以为自己懂了吗？（注：`sea.js`已经不再维护）

不敢说对整篇文章说讲的都全部掌握，只求能比之前懵懂的状态前进一点。

## js模块化解决的是什么

一个工具流行，必然是它解决了当前的某个痛点，满足了人们的需求。就好像jQuery，它封装了DOM的常用操作，并处理了浏览器的兼容性，使得人们操作DOM更加方便。而JavaScript模块化工具必然也是解决了某一类问题。

在学习C语言的时候，都能清楚地知道模块化的重要性--代码复用以及高内聚低耦合，不仅是为了可维护也是为了代码的健壮性。而在JavaScript中，解决的是什么？

--当一个项目逐渐复杂，多个人进行开发的时候，难免会出现命名冲突的问题，还有一个就是前端开发并不像后端一样，有专门的工具进行管理依赖，只以script标签的出现顺序来规定文件的依赖关系。所以Javascript模块化解决的主要是**命名冲突**和**依赖管理**，它的好处自然也是可维护性和可复用性。

### 命名冲突

在`sea.js`等工具的出现之前，我们的JavaScript代码是如何组织的？或者说模块化开发的整个演变过程是如何的？

#### 全局函数

这种方式前期最常见的。

```javascript
function add(){}
function minus(){}
```

试想一下，如果全局中也有一个变量和函数同名，会导致什么后果？Hosting的时候，函数声明的优先级是高于变量的，所以会导致函数声明被覆盖(不管这个变量在函数声明之前还是之后都是一样的)

缺点：全局命名空间被污染，很容易造成命名冲突。

#### 简单的命名空间

我们知道不同的对象可以有不同的成员，包括变量和函数。这样我们可以将变量和函数都挂载在特定的自定义对象下，只能通过对象来引用其内部成员，达到命名空间的效果。

```javascript
var obj = {
  add: function(){console.log('add')},
  minus: function(){console.log('minus')}
}
//add();//出错
obj.add();//console:'add'
```
优点：减少了全局变量。
缺点：1. 对象的成员都被暴露，可以被外界修改，无私有成员可言。2. 当命名空间过长时，造成记忆负担。

#### 闭包

```javascript
var obj = (function(){
  var addText = 'add';
  var add = function(){console.log(addText)};
  return{
    add: add
  }
})();
obj.add();//'add'
obj.addText= 'add Changed!';
obj.add();//'add'
```

优点：1. 减少了全局变量，一定程度上解决了变量命名冲突。2. 可以选择性地将内部成员暴露给外部接口。


#### 闭包依赖注入

让我们为上面的闭包再增强一点，给它**注入依赖**，并且让它更加易于拓展。

```javascript
var obj = (function($){
// 这时可以使用$作为jQuery对象
  var addText = 'add';
  var add = function(){console.log(addText)};
  return{
    add: add
  }
})(jQuery);
```

优点：高内聚低耦合，根据需要注入不同的依赖。

确实，只要在全局中存在`$`变量就可以在匿名函数中使用，但是这样不利于后期代码的维护。因为在维护的后期你很有可能不记得`obj`的依赖有哪些，而注入依赖会使得代码更加清晰。

#### 闭包的高级模式

##### 扩充

看起来闭包已经足够使用，但是


```javascript

```



### 文件依赖管理

后端开发中有专门的依赖管理软件，比如Java中的`Maven`和`Gradle`，`nodejs`中的`npm`，而在前端中的前期是如何管理依赖的？

`<script>`的出现顺序或者代码出现的顺序，就好像引入jQuery插件的时候，`jQuery`文件一定需要在这插件引入之前引入。这似乎没什么毛病啊，但当一个项目越来越庞大的时候，[PPT](https://huangxuan.me/js-module-7day/#/11)的例子如下：

```javascript
body
    script(src="zepto.js")
    script(src="jhash.js")
    script(src="fastClick.js")
    script(src="iScroll.js")
    script(src="underscore.js")
    script(src="handlebar.js")
    script(src="datacenter.js")
    script(src="deferred.js")
    script(src="util/wxbridge.js")
    script(src="util/login.js")
    script(src="util/base.js")
    script(src="util/city.js")
    script(src="util/date.js")
    script(src="util/cookie.js")
    script(src="app.js")
```

这就会出现难以维护，依赖难以管理，请求过多等弊端了。



---


** 参考资料：**

- [JavaScript模块化七日谈](https://huangxuan.me/js-module-7day/#/)

- [JavaScript中的模块化开发](http://www.jianshu.com/p/3832c00a44a7?utm_source=caibaojian.com)

- [深入理解JavaScript 模块模式--高级模式](http://www.oschina.net/translate/javascript-module-pattern-in-depth#content_h2_5_5)
