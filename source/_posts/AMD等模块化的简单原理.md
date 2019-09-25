---
title: AMD等模块化的简单原理
date: 2017-03-11 16:36:19
tags: [JavaScript, 模块化, Web]
categories: [编执狂, Web]
---

## iWo

在正式开始之前，让我们先看看一个简易版的模块Loader是如何实现的？

感谢@爝神的[iWo.js](https://github.com/liulyliu/iWo/blob/master/src/iwo.loader.js)，虽然不一定符合AMD规范，而且有着一些使用限制，比如必须有id，而且路径是相对于最后加载`<script>`的`baseUrl`而言等等缺陷，毕竟不足100行的代码。但麻雀虽小，五脏俱全，不妨碍我们解读一个加载器的大概思想。

```javascript
/**
 * @author xiaojue[designsor@gmail.com]
 * @date 20141112
 * @fileoverview core for iwo,a easy module control
 */
(function(win, doc, undef) {

    var cache = {},
        loadings = {},
        queue = [],
        scripts = doc.getElementsByTagName('script'),
        root = scripts[scripts.length - 1].src,
        basepath = root.slice(0, root.lastIndexOf('/') + 1);

    function Module(path, deps, factory) {
        this.id = path;
        this.deps = factory ? deps : [];
        this.factory = factory ? factory : deps;
        utils.addLoading(this.deps);
        cache[path] = this;
        loadings[path] = 2;
    }

    var utils = {
        addLoading: function(deps) {
            for (var i = 0; i < deps.length; i++) {
                var id = deps[i],stat = loadings[id];
                loadings[id] = stat ? stat : 0;
            }
        },
        _r: function(id) {
            var mod = cache[id];
            return mod.exports || (mod.exports = mod.compile());
        },
        checkLoading: function() {
            for (var id in loadings) {
                if (loadings[id] < 2) return false;
            }
            return true;
        },
        loadDeps: function() {
            for (var id in loadings){
                if (loadings[id] < 1) utils.loadMod(id);
            }
        },
        loadScript: function(path, cb) {
            var script = doc.createElement('script'),
                parent = doc.getElementsByTagName('head')[0];
            script.onload = script.onreadystatechange = script.onerror = function() {
                if (/loaded|complete|undefined/.test(script.readyState)) {
                    script.onload = script.onerror = script.onreadystatechange = null;
                    script.parentNode.removeChild(script);
                    script = undef;
                    if(cb) cb();
                }
            };
            script.src = basepath + path + '.js';
            parent.appendChild(script);
        },
        loadMod: function(id) {
            loadings[id] = 1;
            utils.loadScript(id, function() {
                if (utils.checkLoading()) {
                    while (queue.length) {
                        cache[queue.shift()].compile();
                    }
                } else {
                    utils.loadDeps();
                }
            });
        },
        run: function(path) {
            queue.push(path);
            utils.addLoading([path]);
            utils.loadDeps();
        },
        define: function(path, deps, factory) {
            new Module(path, deps, factory);
        }
    };

    Module.prototype = {
        constructor: Module,
        compile: function() {
            return this.factory(utils._r);
        }
    };

    win.iwo = {
        version: '0.0.1',
        core: 'iwo.core',
        run: utils.run,
        define: utils.define
    };

    //iwo.run(iwo.core);

})(window, document);
```


### iWo 源码概要

先来看看最外一层，很熟悉是不是？对，就是IIFE(立即执行函数表达式)，在很多插件的实现或者开源代码中很常见。

```javascript
(function(win, doc, undef) {
})(window, document);
```
虽然很常见，但还是多说几句吧。

将`window`，`document`传入是为了提高效率，使得变量查找不需要再沿着作用域链向上查找，还有就是为了在压缩的时候，两者都可以被压缩，达到一定的优化。而`undef`这里因为第三个参数**没有定义**，所以自然获得`undefined`，而不传`undefined`是因为在一些浏览器中`undefined`的可以被修改。

接着，让我们来看看里面的成员都有哪些，有什么作用吧，从上到下分别是

- cache：用来存储初始化(new)的`Module`对象，key即为path，也为id，value为对应的`Module`对象
- loadings：用来存储模块(或依赖的模块)的状态，key即为path，也为id，value为0时是依赖声明，value为1时是依赖加载，value为2时是模块初始化
- queue：用来存储执行队列的数组
- scripts：`script`标签对象
- root：最后一个标签的地址
- basepath：基地址(到最后的一个'/'，包括'/')
- Module：`Module`构造函数
- utils：挂载相关函数的对象
	- addLoading：初始化当前模块的状态(若不存在则为0)
	- _r：作于`factory`的参数，在此用于`require(Module)`使用，返回`reuqire`的`Module`的返回值
	- checkLoading：检测是否所有模块加载并初始化
	- loadDeps：遍历`loadings`，调用`loadMod()`加载声明的依赖，即loadings[id]=0
	- loadMod：将依赖的状态进行改变为加载状态(`loadings[id]=1`)，调用`loadScript()`，并传入`callback`回调
	- loadScript：**动态创建`<script>`，异步加载模块文件`*.js`**，监听加载事件(做了兼容处理)，加载成功(或失败)后移除标签，重置并调用回调函数`callback`
	- run：运行模块
	- define：模块定义，也就是`new Module()`
- Module.prototype：主要为了挂载`Module`对象的公共方法`compile`
	- compile：其实就是`Module`对象的`factory()`，只不过将`_r`作为实参传入，作用自然是执行`Module`的`factory()`方法，而在`_r()`中，核心代码是`return mod.exports || (mod.exports = mod.compile());`，这行代码使得**依赖模块只执行一次，而不是多次，从而达到优化目的**
- win.iwo：将必要的变量和方法（`run()`和`define()`）挂载到全局对象window中。



### 举个栗子

阅读源码的方法我个人的做法是使用调试的方法，所以自己瞎写了一些例子，让我们先来看看项目的结构。

```bash
.
├── app.js
├── iWo.js
├── mods
│   └── module2.js
└── test
    └── home.html

```

其中`home.html`是我们的测试页面，其实页面什么都没有，只是用于加载script脚本而已，核心代码如下：

```html
<!-- home.html -->
<body>
<script src="../iWo.js"></script>
<script src="../app.js"></script>
</body>
```

而`iWo.js`的内容就是Loader加载器了，代码已经粘贴在上面。而`app.js`是我们业务逻辑代码的入口，为了搞清楚加载流程和执行的顺序，特地增加了好几个`console.log()`。

```javascript
//app.js
console.log('loaded app.js file');
var temp;
iwo.define('module1',['mods/module2'],function (require) {
    console.log('executing module1');
    var temp = 'init value';
    console.log('print out temp init value in module1:'+temp);
    console.log('require mods/module2');
    temp = require('mods/module2');
    console.log('print out temp value after requiring module2 in module1:'+temp);
    console.log('executed module1');
});
iwo.run('module1');
console.log('print out temp value after running module in global scope:'+temp);

```

而`module2.js`为了能验证其路径的正确处理，特放在`mods`目录下面。

```javascript
//module2.js
console.log('loaded module2.js file');
iwo.define('mods/module2',function () {
    console.log('executing module2');
    console.log('executed module2');
    return 'Module2 return value';
});
```

### 执行流程

让我们来从`app.js`入口梳理一下整个代码执行的流程。

1. 打印`loaded app.js file`，说明浏览器已经加载`app.js`文件并执行该文件。

2. 定义依赖于`mods/module2`的`module1`模块，执行`iwo.define()`方法，实际上是new出来一个新的`Module`对象
	1. 对于每个新的`Module`对象都要将其依赖加入`loadings`对象中，并赋值`loadings[id]`为0，说明是依赖声明状态。而且，将`Module`对象缓存到`cache`对象中，并设置`loadings[id]`为2，说明是模块声明状态。
	2. 模块定义阶段结束。

3. 执行`iwo.run()`方法，执行`module1`模块
	1. `queue.push(path);`--先将当前执行模块压入执行队列，因为要先加载其依赖，方可执行当前模块。
	2. `utils.addLoading([path]);`--标明当前模块的状态。(PS:但是我个人认为`Module`对象的状态已经在`new`的时候标注为`2`，这里显得多此一举，暂时不知道该步骤为了考虑什么情况。若大家知道，可以在评论区指出，谢谢~)
	3. `utils.loadDeps();`--加载当前模块的依赖。具体的工作原理是怎么样的？该方法遍历`loadings`对象，如果`loadings[id]`的值小于1，说明是依赖声明状态，并未加载依赖文件，这时候调用`loadMod(id)`方法
	4. `loadMod(id)`--先是改变`loadings[id]`的状态为"依赖加载"，也就是"1"，然后调用`loadScript(id,callback)`方法
	5. `loadScript(id,callback)`--其实就是根据`id`构建出`src`，动态创建`<script>`标签将依赖的模块所在文件异步加载，并监听新创建标签的`onload`/`onerror`/`onreadystatechange`事件，当事件完成后移除创建的标签并且重置`script`标签对象的各个变量，最后调用`callback()`。这里需要注意的是，`onreadystatechange`是为了处理ie下的兼容性，因为在[IE9以下版本的IE中`script`标签不支持`onload`和`onerror`](http://kangax.github.io/jstests/script-element-onload-attribute-support/)，所以使用`onreadystatechange`进行替代，但是还有一个问题，重置`script`对象下的变量不仅是为了垃圾回收机制，更多的是为了避免某些浏览器(如IE9)触发两次事件。可以查看[这篇久远的国外文章](http://www.aaronpeters.nl/blog/prevent-double-callback-execution-in-IE9)进行简单的了解
	6. 当`mods/module2.js`加载进来的时候，又一次开始执行`iwo.define()`，再一次进入模块定义阶段，初始化`mods/module2`模块。
	7. 当加载的`mods/module2.js`执行结束后，意味着`mods/module2`已经定义好了。这时候就会调用`callback()`方法了。
	8. `callback()`--这个方法的主要任务是调用`checkLoading()`检测依赖是否都已经加载进来，如何检测？对，就是利用`loadings[id]`的状态值，当所有的`loadings[id]`都为2(也就是所有模块文件都加载进来，都定义好了)的时候，就会根据执行队列的模块长度，从第一个开始进行执行。这里有一个妙用，`queue.shift()`这样就能保证从头到尾按照顺序执行模块。具体的执行是调用了挂载在`Module`原型上的`compile()`方法，实质上是其对应模块的`factory()`的执行，唯一的差别在于其可以传递`require`进行导出结果操作。


### 结果与简要分析


上面的代码例子执行结果如下图所示：

![执行结果](http://image.geekaholic.cn/2017-03-15_142611_0001.jpg)


由一二条打印结果可以看出，模块加载是异步的，而且模块内部的变量无法被外部全局访问，而第3，4条打印结果可以告诉我们，`module1`的执行是先加载并定义`mods/module2`，但是并没有运行`mods/module2`的`factory`函数，`mods/module2`的`factory()`函数真正执行的时机在于`require('mods/module2')`，所以从这点上来看，**`iwo.js`这一个特点更像是`CMD规范`的懒执行**。

可以看出，一个简单的模块加载器，最起码需要有：

- 异步加载脚本
- 依赖检测、分析与加载

而如果你想了解`JavaScript异步加载`的多种加载方式(其中属`动态创建DOM节点`最为常用)，以及`JavaScript延迟执行`的方法，可以查看以下两个链接：

- [JAVASCRIPT 装载和执行](http://coolshell.cn/articles/9749.html)

- [让我们再聊聊浏览器资源加载优化](http://www.infoq.com/cn/articles/browser-resource-loading-optimization)

其中第二个文章的分析也不仅仅讲的是加载和执行，干货满满，非常值得一看。

而这里还是要再说明一下，`JavaScript延迟执行`与`factory函数懒执行`说的是两码事。以`iWo.js`为例子，动态创建DOM的方式加载js脚本的时候，当一加载完成就会执行该外部脚本，否则哪里来的`define`。而`factory函数懒执行`只不过是调用该`factory`函数是在`require`相应模块的时候。

End.
