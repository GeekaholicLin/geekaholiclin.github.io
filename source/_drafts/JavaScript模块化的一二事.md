title: JavaScript模块化的一二事
date: 2017-03-09 15:42:18
categories: [编执狂, Web]
tags: [JavaScript, 模块化, Web]
---
在前端发展迅速的今天，模块化已经不是什么新的名词。在查阅资料之前，本人对模块化一知半解，"不就引用sea.js或者require.js的事吗"。其实，学习技术怕的不就是只知道皮毛就以为自己懂了吗？（注：`sea.js`已经不再维护）

不敢说对整篇文章说讲的都全部掌握，只求能比之前懵懂的状态前进一点。

## js模块化解决的是什么

一个工具流行，必然是它解决了当前的某个痛点，满足了人们的需求。就好像jQuery，它封装了DOM的常用操作，并处理了浏览器的兼容性，使得人们操作DOM更加方便。而JavaScript模块化工具必然也是解决了某一类问题。

在学习C语言的时候，都能清楚地知道模块化的重要性--代码复用以及高内聚低耦合，不仅是为了可维护也是为了代码的健壮性。而在JavaScript中，解决的是什么？

--当一个项目逐渐复杂，多个人进行开发的时候，难免会出现命名冲突的问题，还有一个就是前端开发并不像后端一样，有专门的工具进行管理依赖，只以script标签的出现顺序来简略地规定文件的依赖关系。所以**命名冲突**和**文件依赖**是JavaScript模块化解决的主要问题，它的好处自然是可维护性和复用性。

### 命名冲突

在`sea.js`等工具的出现之前，我们的JavaScript代码是如何组织的？或者说模块化开发的整个演变过程是如何的？

#### 全局函数

这种方式前期最常见的。

```javascript
function add(){}
function minus(){}
```

试想一下，如果全局中也有一个变量和函数同名，会导致什么后果？变量提升的时候，函数声明的优先级是高于变量的，所以会导致函数声明被覆盖(不管这个变量在函数声明之前还是之后都是一样的)

缺点：全局命名空间被污染，很容易造成命名冲突。

#### 简单的命名空间

我们知道不同的对象可以有不同的成员，包括变量和函数。这样我们可以将变量和函数都挂载在特定的自定义对象下，只能通过对象来引用其内部成员，达到命名空间的效果。

```javascript
//objBase.js
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
//objBase.js
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
//objBase.js
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

(PS:Hexo-admin插件会莫名丢失`draft`中的内容，再也不用该插件了。心累...)

看起来闭包已经足够使用，但是当基础模块`objBase.js`需要扩展的时候，在源文件进行修改是不妥当的，因为可能会把新的bug引入原有已经测试通过的模块中，这会导致在原有模块中定位错误相当困难。这也是面向对象中的[开闭原则](https://zh.wikipedia.org/wiki/%E5%BC%80%E9%97%AD%E5%8E%9F%E5%88%99) -- 允许在改变它的源代码的前提下变更它的行为。 这就需要我们在扩展模块`objExtend.js`等文件中进行拓展。

而这需要用到闭包的高级用法，而且不同需求对应不同的扩展模式。其实说是高级用法，其实还是用的基础知识，但是思想很值得我们去学习。高级用法有好多，还请根据自己的需求进行选择。

##### 扩展

```javascript
//objExtend.js
var obj = (function(myObj,$){
// 这时可以使用$作为jQuery对象
  obj.minus = function(){};
  return myObj;
})(obj,jQuery);

```

需求：将一个模块分离到多个文件，**同步加载**模块文件。

缺点：需要保证`obj`在`objExtend.js`加载前已经存在，所以需要同步加载，先加载`obj`基础模块。


##### 松耦合扩展

```javascript
var obj = (function(myObj,$){
// 这时可以使用$作为jQuery对象
  obj.minus = function(){};
  return myObj;
})(obj||{},jQuery);
```

需求：将一个模块分离到多个文件，**异步加载**模块文件(无论基础模块还是扩展模块)。

Tips：其实是应用了`||`操作符的短路操作，JavaScript中比较常见。

缺点：松耦合扩展不能和`闭包依赖注入`等返回新对象的模块模式进行混合使用，否则会覆盖。试想一下，当返回新对象的`*.js`文件后加载，会是怎样的情况？

##### 紧耦合扩展

```javascript
var obj = (function(myObj,$){
// 这时可以使用$作为jQuery对象
  var old_add = obj.add;
  obj.add = function(){/*use old_add*/}
  obj.minus = function(){};
  return myObj;
})(obj,jQuery);
```

需求：将一个模块分离到多个文件，**同步加载**模块文件，覆盖原有属性或函数并且需要用到原有属性或函数。

缺点：同步加载。

##### 跨文件共享私有对象

```javascript
var MODULE = (function (my) {
	var _private = my._private = my._private || {},
		_seal = my._seal = my._seal || function () {
			delete my._private;
			delete my._seal;
			delete my._unseal;
		},
		_unseal = my._unseal = my._unseal || function () {
			my._private = _private;
			my._seal = _seal;
			my._unseal = _unseal;
		};

	// permanent access to _private, _seal, and _unseal

	return my;
}(MODULE || {}));
```

以上代码可以在[英文原文](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)中找到，使用`松耦合扩展`模式对内部私有属性进行维护，从而达到模块内的多个文件访问私有对象。

> Any file can set properties on their local variable _private, and it will be immediately available to the others. Once this module has loaded completely, the application should call MODULE._seal(), which will prevent external access to the internal _private. If this module were to be augmented again, further in the application’s lifetime, one of the internal methods, in any file, can call _unseal() before loading the new file, and call _seal() again after it has been executed. This pattern occurred to me today while I was at work, I have not seen this elsewhere. I think this is a very useful pattern, and would have been worth writing about all on its own.

需求：将一个模块分离到多个文件，私有对象模块内跨文件共享。

Tips：可以看到`_seal()`是使用了`delete`删除属性的操作符，而`_unseal()`使用了重新赋值的方法。

缺点：代码冗余。

根据英文原文中的意思，"一个模块的所有文件都可以访问私有属性，提倡模块加载结束后调用`_seal()`，而如果需要加载新的模块文件，先调用`_unseal()`，加载完成后，再调用`_seal()`"，但是由于使用了`松耦合扩展`，说明模块加载无法保证顺序，这就意味着`_seal`和`_unseal`方法都要在该模块的每一个文件中。还有一个问题，"Once this module has loaded completely, the application should call MODULE._seal()"。这没有问题，但是

> "If this module were to be augmented again, further in the application’s lifetime, one of the internal methods, in any file, can call _unseal() before loading the new file, and call _seal() again after it has been executed."

这似乎就说不过去了。

因为调用`Module._seal()`的时候`delete my._unseal;`，会失去`_unseal`的引用，在新增加模块文件之前，自然无法调用`Module._unseal()`，导致出错。而且跨文件访问私有属性很难管理。我找到了作者在评论讨论的一番话，当时的内心Orz...

> I've never actually used it, which is probably a good sign that it's not useful. I was mostly just trying to prove that you COULD do something like that with the Module Pattern, and to show the flexibility of JavaScript.

![讨论详情](http://image.geekaholic.cn/20170310103317.png)

文章挺久远的了，但是不妨碍我们学习其思想:)


### 文件依赖

后端开发中有专门的依赖管理软件或者包管理软件，比如`Java`中的`Maven`和`Gradle`，`nodejs`中的`npm`，而在前端中的前期是如何管理依赖的？

`<script>`的出现顺序或者代码出现的顺序。

就好像引入jQuery插件的时候，`jQuery`文件一定需要在这插件引入之前引入。这似乎没什么毛病啊，但当一个项目越来越庞大的时候，或者依赖关系出现闭环、相互依赖等复杂关系的时候，就会出现难以维护，依赖难以管理，请求过多等弊端了。

而且要知道，前面的模块模式虽然可以注入依赖，但是模块导出都是存在单个全局变量，有时候我们只是基于一个存在的模块构建另外一个模块，而不是都将其挂载在全局变量中。

[PPT](https://huangxuan.me/js-module-7day/#/11)的例子如下：

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
所以我们需要一些工具，比模块模式更加好用，既可以避免全局变量冲突(模块模式的冲突避免得不够彻底)，还可以明确代码直接的依赖关系，更重要的是模块声明的方式让编写代码更加舒适。

## js模块化工具

### 模块定义和加载方案

#### 一些历史

`CMD`和`AMD`这部分纯属科普向，`RequireJS`和`SeaJS`都是历史阶段性的产物，也权当了解即可。

JavaScript 模块化最早是出现在`Nodejs`当中，推出了`Module/1.0`规范并获得不错的成功后，想继而推广到浏览器端的时候，出现了分歧，形成了三大流派，大致如下：

![CommonJS流派](http://image.geekaholic.cn/p978yzq5wzv76ep29wn4hwjl73)

如果你想了解这部分历史，请翻阅玉伯大大的[前端模块化开发那点历史](https://github.com/seajs/seajs/issues/588)。

我们在这里简单地探讨一下`AMD规范`和`CMD规范`两者的实现，即`RequireJS`和`SeaJS`，有哪些不同。

#### AMD与CMD

AMD(Async Module Definition)是RequireJS对模块定义的规范化产出，而CMD(Common Module Definition)是SeaJS对模块定义的规范化产出。所以CMD和CommonJS不是说的同一个东西。这里不展开探讨，也没有意义，只简单地总结AMD和CMD的相同点和代码方式上的差别。

- 两者都是异步加载模块文件，而NodeJS的CommonJS是同步
- CMD推崇依赖就近，AMD推崇依赖前置(原因看下面一条)
- CMD 是延迟执行，as lazy as possible，也就是而AMD是提前执行，也就是加载完成后立即执行。

关于第3点，或许看[代码例子](https://github.com/seajs/seajs/issues/588#issuecomment-19682315)更容易理解一些。

```javascript
//AMD
define(['a', 'b'], function(a, b) {
   // 模块 a 和 b 在这里就都执行好并可用了
})
//CMD
define(function(require, exports) {
   // ...
   var a = require('a')  // 模块 a 运行到此处才执行

   // ...

   if (false) {
      var b = require('b')   // 当某些条件为 false 时，模块 b 永远也不会执行
   }
})
```

#### UMD

> 在一些同时需要AMD和CommonJS功能的项目中，你需要使用另一种规范：Universal Module Definition（通用模块定义规范）。

这种模式的使用方法因为其兼容性好，兼顾了AMD、CommonJS和客户端，在开源类库或者自己实现某个原生插件、功能时比较常见。基本的代码框架如下：

```javascript
// returnExports.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('b'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));
```

原理就是一个IIFE，并且加上判断，判断是否存在AMD，存在CommonJS，否则将其挂载到全局对象。

如果你想看更多的例子：见官方[Repo](https://github.com/umdjs/umd)


#### ES6 Module

前端模块化的重要性逐渐显现出来，ECMAScript在ES2015也就是ES6中引入了模块的功能。

ES6默认一个文件一个模块，也就是说，在一个模块文件里面声明的任何东西都是默认私有的，如果想变为`public`，需要使用`export`命令。还有很重要的一点，ES6的**import是实时只读的**。

对于`export`命令来说，有两种导出方式，一种是命名导出，一种是默认导出。一般来说，导出多个值的时候使用命名导出，导出一个值比如一个函数，一个类或者一个对象等使用默认导出。

```javascript
//multiple named export
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}
//或者使用一次导出多个
const sqrt = Math.sqrt;
function square(x) {
    return x * x;
}
function diag(x, y) {
    return sqrt(square(x) + square(y));
}
export {sqrt,square,diag};
//------ main.js ------
//使用命名导出多个值时必须使用相同的名称进行引用，当然可以使用`as`对其名称重命名，export也可以使用`as`关键字
import { square, diag as d } from 'lib';
console.log(square(11)); // 121
console.log(d(4, 3)); // 5
//或者使用`*`引入全部
import * as lib from 'lib';
console.log(lib.square(11)); // 121
console.log(lib.diag(4, 3)); // 5
```

```javascript
//Single default export
//------ MyClass.js ------
export default class { ··· } // no semicolon!

//------ main2.js ------
import MyClass from 'MyClass';
const inst = new MyClass();
```

基本的用法如上所示，如果想查看更加高级的用法，比如两种方式混合导出等可以查阅专门的文章或者期待我的[ES6学习日记](/tags/ES6/)~

好处是它是一个标准，而且**实时更新**，然而残酷的现实是浏览器支持度全线飘红，不过可以通过`Babel`等工具进行代码转换。

![兼容性](http://image.geekaholic.cn/2017-03-10_173025_0001.jpg)


### 模块打包构建方案

AMD和CMD是在前端引入`RequireJS`或者`SeaJS`的脚本，在线加载解释器并对代码进行编译，从而达到模块化管理的目的。ES6 Module是JavaScript原生支持，但目前浏览器的兼容性不理想，需要通过`Bable`转换。

其实除了上述两者之外，JavaScript前端模块化还有一种解决方案，是通过`Node`和相应的工具，本地预编译，不需要在前端加载解释器，将模块化的代码打包处理(合并和压缩等)，而浏览器端的代码引入只需要引入打包处理后的**一个文件**，比如`<script src="app.js"></script>`即可。而这种解决方案目前流行的有两款工具：`Browserify`和`Webpack`。

（ 注意`Babel`和`Browserify`、`Webpack`不是同一类工具，前者用于转换ES6代码，以达到更强的浏览器兼容性，而后者是构建工具，用于压缩合并等功能。 ）

#### Browserify+CommonJS

> Browsers don't have the `require` method defined, but Node.js does. With Browserify you can write code that uses `require` in the same way that you would use it in Node.

在`Node.js`中，CommonJS是同步载入的，对于浏览器来说并不理想。而`Browserify`的作用就是将CommonJS模块(或者纯前端脚本)转换为浏览器可以调用的格式。然后`Browserify`通过抽象语法树（AST）来解析代码中的每一个 `require` 语句，在分析完所有模块的依赖和结构之后，就会把所有的代码合并到一个文件中。它还有一个好处就是，可以让前端`JavaScript`模块直接使用`npm install`的方式进行安装，比如`npm install backbone jquery`安装backbone和它所依赖的jQuery模块。

而如果你想在`Browserify`中使用`AMD`模块语法，可以看一下这款插件[deamdify](https://www.npmjs.com/package/deamdify)或者下面的解决方案。

而如果你想使用AMD的语法以及`RequireJS`来异步加载模块，可以使用`RequireJS optimizer`, `r.js`一类的构建工具来合并和压缩AMD的模块。同理，`SeaJS`可以使用`spm`。

`Browserify`的基本用法是：

```bash
browserify main.js -o bundle.js
```

如果你想详细了解`Browserify`的用法、例子，可以查看其[官网](http://browserify.org/)或者[Browserify 使用指南](http://zhaoda.net/2015/10/16/browserify-guide/)

#### Rollup -- tree shaking

> Rollup is a module bundler for JavaScript which compiles small pieces of code into a something larger and more complex, such as a library or application. It uses the new standardized format for code modules included in the ES6 revision of JavaScript, instead of previous idiosyncratic solutions such as CommonJS and AMD.

从官网的介绍可以看到`RollupJS`作为打包工具，有一些优点：

- ES6原生语法
- Tree shaking
- 转换为AMD,CommonJS,UMD,IIFE等方式

关于什么是`Tree shaking`，官方的定义是：

> Tree-shaking a.k.a. 'live code inclusion' is the process of only including the code that is used. It is similar to dead code elimination but can be more efficient

简单地来说，是一种减少代码冗余的技术，只加载需要调用的代码，而不是加载全部，这样就不怕载入的依赖存在冗余了。

但是很不幸，以上的优点在最新版本v2.2的`Webpack`中都已经实现了。


#### Webpack -- 一切皆模块

目前主流的前端构建工具，估计属`Webpack`是最热的了吧。

虽然Webpack和Browserify都是模块化打包工具，但是两者面向的方面可是大有不同。`Browserify`是一个为浏览器环境提供Node模块的模块打包工具，而`Webpack`不仅仅是将`JavaScipt`纳入模块化的范畴，图片、样式文件等资源也可以进行模块化、打包等，在很多人(包括我)看来，`Webpack`不仅仅是JavaScript模块化工具。因为它依赖其强大的插件，包含了`gulp`的大部分功能，可以说是大而全的前端工程化工具，也就是说`Webpack 约等于 gulp+Browerify`。当然，也有使用`Webpack+gulp`的（将Webpack做打包工具，gulp做自动化工具），这些工具的使用暂时不是很熟悉，就不献丑了。

回到正题，Webpack提供的模块化思想似乎更加的先进，可以使用`code splitting`这样的功能，将代码分割成一个个的chunk，然后实现按需加载进行性能优化。

Webpack在JavaScript模块化方面的简单使用和`Browserify`很类似。

```bash
webpack main.js bundle.js
```

如果你想对比`Webpack`和`Browserify`之间的区别，可以查看文章[Browserify VS Webpack - JS Drama](http://blog.namangoel.com/browserify-vs-webpack-js-drama)和[Webpack官方的对比](http://webpack.github.io/docs/comparison.html)，或者[看看`Webpack`可以为你提供什么](https://github.com/petehunt/webpack-howto)

#### 最优解？

所以，介绍了那么多的工具，目前(2017/3/10)的最优方案应该是什么？

个人意见是`ES6+Webpack2.2(需要安装相关的Babel插件)`或者`ES6+RollupJS+gulp等自动化工具`，至于如何还请根据自己的项目要求~


## 结束？

这篇文章讲了什么？无外乎模块化历史的发展。学到了几种模块模式，懂得了`UMD`（之前知道这种写法，但不清楚术语），还见识到了前端发展的迅速。

因为中间`hexo-admin`插件抽风了，让我一个下午的写作没有保存。本来一天可以写完的硬是花了我两天的时间来写这篇文件，我能怎么办QAQ我也很绝望啊。讲了那么多，无外乎一些历史和简单的介绍，到底模块化`AMD`等内部是如何实现的，内部是怎么样的原理，似乎没有讲到。想接着大致地分析内部的原理，虽然知道异步加载模块的原理是通过动态生成`<script>`标签，却怕自己的能力不够分析那么多。

考虑到时间、篇章和能力的限制，暂且到此结束该篇，将其他部分的内容后移:)

- JavaScript模块化加载器的大概原理和[`lodjs`源码](https://github.com/yanhaijing/lodjs)分析

- Webpack的使用和ES6 Module的详细介绍

`lodjs` 是 @颜海镜大大 对AMD规范实现的一个模块加载器，粗略地看了一下代码，还是挺清晰的，准备学习然后分享~


---


## 参考资料：

- [JavaScript模块化七日谈](https://huangxuan.me/js-module-7day/#/)

- [JavaScript中的模块化开发](http://www.jianshu.com/p/3832c00a44a7?utm_source=caibaojian.com)

- [深入理解JavaScript 模块模式--高级模式](http://www.oschina.net/translate/javascript-module-pattern-in-depth#content_h2_5_5)

- [JavaScript Module Pattern: In-Depth](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)

- [JavaScript 模块化入门Ⅱ：模块打包构建](https://zhuanlan.zhihu.com/p/22945985)

- [RequireJS, Sea.js, Browserify和webpack的对比](https://github.com/boxizen/boxizen.github.io/issues/9)