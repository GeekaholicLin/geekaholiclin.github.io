---
title: 制作Hexo主题详细教程（1）
tags:
  - Hexo
  - ylion
  - 主题制作
categories:
  - 编执狂
  - Web
date: 2017-02-22 14:53:00
---
## 关于

### 为什么要造轮子

利用寒假接近半个月来写了一个[主题](https://github.com/GeekaholicLin/hexo-theme-ylion)。为什么要造轮子？其实做这个Hexo主题的目的就是想学习更高级的用法，比如`less`，比如`ejs`，比如`CSS3`以及原生`JavaScript`，也为了更好地沉淀。因为大半年的时间学习jQuery，处理IE的兼容，感觉越来越与前端的发展脱节...

### 为什么要写本教程

在写ylion主题的时候，我也没想到会是如此艰辛。艰辛的不是技术使用方面，艰辛的是[Hexo官方文档](https://hexo.io/zh-cn/docs/)。当你写过主题就知道官方的API写的多么的含糊不清(摔！)，而要命的是，这方面的介绍少之又少(也可能是我搜索的姿势不对...)。所以，为了方便后来造轮子者有个参考，也为了温习制作主题时利用到的知识，写下本教程，本教程以ylion主题为例，**水平有限，如有纰漏，还望指出~**



### 准备

制作一款Hexo主题的要求并不高，要求掌握`ejs`、`less`、以及基本的`HTML`、`CSS`、`JavaScript`，还有熟悉Hexo提供的插件和功能(参见API文档)。至于设计方面的知识，可以参考现有的主题，包括但不限于Hexo主题。

`ejs`和`less`可以使用`Swig`和`Sass/Scss`等，要看自己熟悉哪一个，自己用的适应就行。

`ejs`和`less`并不难学，两者都是为了模块化，减少代码量。前者基本上是js+html，后者基本是css。而`JavaScript`部分，如果想减少上手难度，可以使用`jQuery`代替。

## 开始

### 初始化

按照[教程](https://hexo.io/zh-cn/docs/index.html)配置好自己的开发环境，然后[初始化](https://hexo.io/zh-cn/docs/setup.html)，Hexo则会在指定目录新建需要的文件。  该目录下的文件说明，可以在[官方文档](https://hexo.io/zh-cn/docs/setup.html)中看到，不再赘述。

### 新建主题

在`themes`建立新的文件夹，命名为`ylion`，为了减少工作量，这里使用`generator-hexo-theme`和`yo`来帮我们自动生成需要的目录和文件，再根据我们的需求进行删减和添加。当然，手动建立也是可以的。

首先是需要工具的安装：

```bash
	npm install yo -g
   npm install generator-hexo-theme -g

```

然后在新建的`ylion`目录，使用命令`yo hexo-theme`，进行技术栈的选择。结束后大概是以下的画面：

![hexo-theme](http://image.geekaholic.cn/qm1k5oy4o3bdh2n07mdj0lq505)

而现在的`ylion`目录下的结构为：

```bash
.
├── _config.yml
├── layout
│   ├── archive.ejs
│   ├── category.ejs
│   ├── index.ejs
│   ├── layout.ejs
│   ├── page.ejs
│   ├── partials
│   │   ├── pagination.ejs
│   │   └── recent-posts.ejs
│   ├── post.ejs
│   └── tag.ejs
└── source
    ├── css
    │   └── ylion.less
    ├── favicon.ico
    └── js
        └── ylion.js

```

经过删减和增加后的文件结构一般如下,至于该新建什么文件，是根据自己的主题进行的。

```bash
├── _config.yml ### 主题的配置文件
├── languages ### 多语言支持目录
│   ├── default.yml
│   ├── zh-CN.yml
│   └── zh-TW.yml
├── layout ### 布局模块目录
│   ├── _partial ### 可重复利用的模块目录
│   ├── _thirdParty ### 第三方模块目录
│   ├── _widget ### 小插件模块目录
│   ├── archive.ejs ### 归档布局文件
│   ├── category.ejs ### 分类布局文件
│   ├── index.ejs ### 首页布局文件
│   ├── layout.ejs ### 主布局文件
│   ├── page.ejs ### 分页导航布局文件
│   ├── post.ejs ### 文章详情文件
│   └── tag.ejs ### 标签布局文件
├── package.json
├── scripts ###
│   ├── generator ### 生成器
│   └── helper ### 辅助器
└── source ###
    ├── css ### css
    ├── favicon.ico ### 网站图标
    ├── fonts ### 字体
    ├── img ## 图片目录
    └── js ## js

```

至于每个目录和文件有什么作用，为什么这么分，以及如何自己更强地自定义，会在下面的内容或者以后的内容讲到。


### 文档补充

这一部分是对Hexo官方文档的烂的一比的部分(主要表现在`自定义`部分)进行的补充说明，以及编写主题时的一些心得。我会尽量对照着官方文档的顺序进行补充。

#### 模板

在官方的[模板说明文档](https://hexo.io/zh-cn/docs/templates.html)页面，有这么一个表格。让我们回头看`ylion`目录下的部分文件。

```bash
│   ├── archive.ejs ### 归档布局文件
│   ├── category.ejs ### 分类布局文件
│   ├── index.ejs ### 首页布局文件
│   ├── layout.ejs ### 主布局文件
│   ├── page.ejs ### 分页导航布局文件
│   ├── post.ejs ### 文章详情文件
│   └── tag.ejs ### 标签布局文件
```

再对照表格：

![模板表格](http://image.geekaholic.cn/1snknxi1kcjzgsgojrpazsh92e)

其中`layout.ejs`是最主要的文件，它是所有布局的入口，而其他的布局(layout)比如`index.ejs`只是`layout.ejs`的`<%- body %>`部分。

当你访问博客的首页时，通过表格知道首页对照的模板为`index.ejs`，这时Hexo将`index.ejs`的内容替换掉`layout.ejs`中的`<%- body %>`。而如果是归档界面呢？对的，是`archive.ejs`的内容替换掉`<%- body %>`。而如果`archive.ejs`不存在呢？这时就该表格中的`回调`部分出场了，`archive.ejs`的回调是`index.ejs`，则说明当`archive.ejs`不存在的时候，用`index.ejs`的内容。

那问题来了，如果我想添加新的页面(page)怎么办？其实有好多种方法。

1. Github Pages有一个功能，是每个项目都可以算是一个page。比如你的repo名字是`demo`，而你的Github名字是`Geek`，也就是说你的个人域名是`geek.github.io`，那你可以通过`geek.github.io/demo/index.html`访问`demo`repo下的`index.html`，是不是很方便，这样就可以建立很多个pages了。

2. 但是，我们不想那么麻烦怎么办？根据一定的网站知识，我们可以知道，在你博客目录下的`source`目录下建立一个`demo`目录，然后添加`index.html`照样可以实现上述的功能。

3. 但是又有一个问题，这个`index.html`没有样式，脚本等等，你想让Hexo帮你渲染，怎么弄？
	```bash
		hexo new page 'demo'
	```
则会帮你完成在`source`目录创立`demo`目录，并初始化一个`index.md`文件，使用的渲染布局自然就是`page.ejs`了，为什么？[官方命令说明](https://hexo.io/zh-cn/docs/commands.html#new)如下：
	```bash
		hexo new [layout] <title>
	```
但这还不够，因为比如会添加许多许多pages。`page.ejs`如何加以区分，然后进行渲染？
这时候[front-matter](https://hexo.io/zh-cn/docs/front-matter.html)出场了。给它加上一个字段`type: 'demo'`，然后在`page.ejs`进行逻辑判断，获取的变量为`page.type`，然后实现你的业务逻辑即可。目前(2017-2-22)ylion主题尚未实现`page.ejs`渲染分类等。

4. 又有一个问题(问题真多...)，如果我不想用`page.ejs`进行渲染呢，毕竟在一个文件里写过多的`page.type`判断会显得乱，可不可以单独一个文件，比如`demo.ejs`进行渲染。当然可以！更改`demo`目录下的`index.md`文件的`front-matter`中的`layout`字段，为你要渲染的layout名字，此处为`demo`，然后在`layout`文件夹下新建一个文件`demo.ejs`即可~这相当于**自定义layout**。

至于`Partial`局部模块，还是要根据自己的需求进行处理。比如`ylion`主题中的`article-meta`是文章的信息显示。因为在ylion主题的每个页面都有出现，这时候就有必要抽取为一个局部模块，减少代码的代码量。

而优化是不能够缺少的，如果你的主题是提交至官方Hexo的话。**在这里有一个坑！！！**一般来说，局部缓存的代码如下：

```ejs
<%- partial('_partial/xxxxx', null, {cache: !config.relative_link}) %>
```

但是，如果你`xxxx`局部模块中的变量是根据不同页面被赋不同的值，则不能够使用，不然所有页面中的**此变量都是同一个值**,切记。

#### 变量

全局变量，官方已经讲的很清楚了，不再赘述，主要讲页面变量。

不过，还是举一个例子。以ylion主题中的`leancloud`统计功能为例子，如果在ejs文件中想获取主题下的`_config.yml`的设置，可以使用`theme.leancloud.enable`进行判断。至于怎么正确获取配置中的值，还请熟悉配置文件的格式。之后会有教程专门讲解，不是这部分的内容。


![全局变量](http://image.geekaholic.cn/aknwxmpru3ss9hnubjv1kte4ll)


**注意：**全局变量中的`page`指的是`页面变量`，与页面变量中的`page`是不同的。页面变量到底有哪些内容，是根据当前不同的布局(layout)而决定的。

比如页面变量中的`page`是指由`page.ejs`渲染的页面，`post`是`post.ejs`渲染的页面。就这么简单？Too Young!!

让我们来看看文档又给我们挖了什么样的坑。页面变量中的`page`变量说的就是你。

![page 变量](http://image.geekaholic.cn/f10e1zorltdtbmkqp4aepvs940)

`page`变量有一部分是**front-matter 所设定的变量**，而不是它本身拥有的。比如`page.photos`，其他的暂时没有验证，**目测** `page.link`也是。想当时，一直郁闷为什么无法获取文章的照片，原来是需要在文章中指定（摔！）


似乎理清了变量怎么使用，但有些人会对`page.layout`变量感到郁闷，我也是在写这篇文章的时候才搞懂。算是临时加上的吧。`page.layout`对应`page.ejs`来说肯定是`page`，对于`post.ejs`来说肯定是`post`，这毋庸置疑。但问题来了。对于`hexo new page 'demo'`的`demo page`来说，layout也是`page`，其他的新建页面同理，但是有没有办法改变？

办法是有的，但是改变的话'意思'就完全变了。

[front-matter](https://hexo.io/zh-cn/docs/front-matter.html)变量中有一个`layout`字段，官方文档在该页并没有详细讲解。`layout`字段指定的是该page使用哪一个layout进行渲染。由前面的模板部分讲解的4种方法创建一个page中的'自定义布局一样'。所以，**页面变量中的page变量指的是page布局和自定义布局的对象变量更加准确**。

#### 辅助函数

这一部分倒不是有什么问题，而是我有话想说。关于制作Hexo主题的一点小经验。

ylion主题的制作过程中，我是先花了将近两天完成了基本的原型，期间参考了很多博客的设计，完成了HTML和基本的CSS部分。在写原型的时候，有意地进行模块划分，这样有利于后期转换为ejs和less更加方便。这样好处是有的，不用在多个文件来来回回地跳，这样很容易混乱。但坏处是什么？

坏处就是，你写的结构和类名与Hexo官方提供的辅助函数生成的结构和类名不同，这就会导致你要改类名，严重的需要修改整个结构。当然，修改Hexo官方的辅助函数是可以的，以后的教程会讲到如何做，但是这样又增加了工作量，得不偿失。

所以，折中或者理智的做法应该是，看官方的辅助函数为你生成的结构和类名是什么，这类辅助函数集中在[列表](https://hexo.io/zh-cn/docs/helpers.html#列表)和[分页器](https://hexo.io/zh-cn/docs/helpers.html#paginator)，所以在写主题前最好了解一下。举个栗子：

```ejs
result += '<li class="' + className + '-list-item' + additionalClassName + '">';

      result += '<a class="' + className + '-list-link' + (isCurrent ? ' current' : '') + '" href="' + self.url_for(cat.path) + '">';
      result += transform ? transform(cat.name) : cat.name;
      result += '</a>';

      if (showCount) {
        result += '<span class="' + className + '-list-count">' + cat.length + '</span>';
      }

      if (child) {
        result += '<ul class="' + className + '-list-child">' + child + '</ul>';
      }

      result += '</li>';

```

这是`list_categories`辅助函数的一部分内容，生成的是文章的分类列表，如果你的结构不是这样，不就需要进行修改了吗？

官方的补充说明暂且就这么多吧。

## 未完待续

因为文章过长，所以分割为两个部分进行，前一个部分也就是本文，主要讲如何开始和补充那坑爹的Hexo文档。对应着`ylion`目录的文件，已经算是讲解了

1. `languages`多语言支持(官方文档)。
2. `layout`布局，讲了如何新建page，如何自定义layout，讲了如何看到官方文档的模板表格以及优化的注意事项。
3. 变量的补充说明。

还剩下实现的一些细节:

1. 如何写`_config.yml`文件以及如何读取其中的变量
2. 如何集成第三方服务
3. 如何改写和自定义辅助器或者生成器等
4. ~~ylion主题的小功能及其实现思路~~

To be continued...