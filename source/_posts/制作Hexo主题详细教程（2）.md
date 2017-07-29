---
title: 制作Hexo主题详细教程（2）
tags:
  - ylion
  - hexo
  - 主题制作
categories:
  - 编执狂
  - Web
date: 2017-03-06 11:02:00
---
接着[上一次的教程](/2017/02/22/制作Hexo主题详细教程（1）/),还有一些细节没有讲，分别是配置文件、第三方服务、自定义辅助器、~~主题的小功能~~等。

## 配置文件

### 格式

Hexo 主题使用 `YAML` 语言作为配置文件，[阮一峰老师的博文](http://www.ruanyifeng.com/blog/2016/07/yaml.html)对这种语言进行了详细的介绍。

> YAML 是专门用来写配置文件的语言，非常简洁和强大，远比 JSON 格式方便。

虽然简洁和方便，但是对于习惯了JSON的我来说，还是不大习惯。

这里以`ylion`主题中的部分配置为例子，要想学习更多，还请翻阅阮一峰老师的博文，讲的清晰易懂。

```yaml

widgets:
- notification
- category
- archive
- popular
- tagcloud
- friends

```
转换为JSON格式就是：

```javascript
{
	widgets:[
    'notification',
     'category',
     'archive',
     'popular',
     'tagcloud',
     'friends' 
    ]
}
```
再以菜单栏部分为例子：

```yaml

menu:
- page: home
  url: /
  icon: fa-home
- page: rss
  url: /atom.xml
  icon: fa-rss
  
```

转换为：

```javascript
{ 
	menu: [
    { page: 'home', url: '/', icon: 'fa-home' },
    { page: 'rss', url: '/atom.xml', icon: 'fa-rss' }
    ]
 }
```

以上都是复合结构的应用。字符串数据类型的应用在ylion主题的应用也是广泛的。`YAML`还支持在字符串中插入HTML标记。

```yaml
cc: |-
        <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/" target="_blank">
        知识共享署名-非商业性使用-禁止演绎 3.0 未本地化版本许可协议（CC BY-NC-ND 3.0）
        </a>
```


**为了在模版引擎部分如EJS中更容易读取到自己所需要的数据，请选择合适的数据类型并组织好自己的配置文件结构！**


### 如何读取

为什么要在脑海中将 `YAML`格式转换为 `JSON` 格式？ 自然是为了方便已经习惯了 `JSON` 思维的我们，这也是为了能在`EJS`的逻辑部分方便获取。

以[sidebar](https://github.com/GeekaholicLin/hexo-theme-ylion/blob/master/layout/_partial/sidebar.ejs#L1-#L8)部分为例子，代码如下：

```ejs
<% if(theme.widgets&&theme.widgets.length>0){%>
<ul id="sidebar">
    <% theme.widgets.forEach(function(widget){ %>
    <%- partial('_widget/' + widget) %>
    <% }) %>
</ul>
<%}%>
```

如果主题配置文件中的`widgets`变量(`theme.widgets`)存在且给变量的长度大于0，则对其进行遍历，并将`_widget`目录下的对应名字的ejs文件加载进来。


如果获取到undefined或者运行`hexo g`命令生成预览的时候出错，很大的可能是你的配置文件出错(比如不适当的缩进)或者你获取的方式不对。


**Tips:** 利用[线上工具](http://nodeca.github.io/js-yaml/)对自己的配置进行转换看看，是否获取正确。如果你不想使用该种方法，也可以使用笨方法`console.log()`或者`console.dir()`，将获取的变量打印在Terminal，看是否准确。


## 第三方服务

Github Pages 提供给我们的是静态的网页，也就是说，并没有后台管理系统让我们对我们的博客、留言、阅读量等进行线上管理。但是我们可以通过集成第三方服务的方式达到目的。ylion主题中的第三方服务大致上有：

- leancloud: 阅读量的统计和热门文章
- 多说: 留言管理
- 不蒜子: 整站访客人数统计
- 百度和谷歌: 站点统计和管理

其实集成第三方服务，最主要的也还是看文档(这不是废话吗...)。在实现ylion主题的过程中，属leancloud的集成最为困难，而且坑比较多。所以就以`leancloud`的集成为例子作为该部分的例子进行讲解吧。


### Hexo与Leancloud

Leancloud的入门知识请查看[官方链接](https://leancloud.cn/docs/leanstorage-started-js.html)以及[JavaScript SDK安装指南](https://leancloud.cn/docs/sdk_setup-js.html)，我们制作主题一般是选用CDN的方式。SDK和Leancloud数据存储的初始化大致代码请见ylion主题的[相关代码](https://github.com/GeekaholicLin/hexo-theme-ylion/blob/master/layout/_partial/_head-sections/script.ejs#L7-L19)，制作主题阶段可以打开调试日志

```javascript
localStorage.setItem('debug', 'leancloud*');
```

但在应用发布的时候，删掉该行代码，即可关闭调试日志，以免暴露敏感信息。**如果删掉之后，在本地还是会显示的，这时请再清空Local Storage对应的数据即可。**


![删掉该行即可](http://olpvawdcl.bkt.clouddn.com/acecz5kpij00o4y6kpe9u43a5h)

初始化leancloud之后，接下来就是逻辑部分的代码了。但在逻辑部分开始前，让我们先明确几个leancloud需要用到的概念，为了更好的理解，从数据库的角度进行类比，但是这是不严谨的。


- 应用：为了方便管理不同的应用或者网站或者程序等。不同的应用对应着不同的数据库。

- Class: 在官方的说法中，Class是AV.Object的一个实例。个人认为Class对应着数据库中的表，用来存储信息，表与表之间也是可以进行"交互"的。在创建应用的时候，leancloud会为我们初始化一些表，比如`_User`、`_Role`等，在我们的主题中并不需要用到，就不展开讲了，如果你的应用需要用到这几个Class，还希望自己翻阅文档，leancloud的文档还算比较清晰的了。

- 属性：对应数据表中的列。

![leancloud后台界面](http://olpvawdcl.bkt.clouddn.com/2phdciysyieupd75ou6yzup8lq)




#### 创建Class

在`创建新的应用`后，在`存储`的菜单，选择`创建Class`，Class名字自己取，但是要在主题中的配置文件中添加(ylion主题自动把其挂载到全局对象中，方便获取)，以`BlogCounter`为例子，并选择`无限制`。(这种方式有风险，后面会讲到如何控制)，点击`创建Class`即可。

其实在后台初始化地建立列是可以的，但是会显得麻烦，我们把它移到我们的代码中。

```javascript
var newcounter = new Counter();
newcounter.set("title", title);
newcounter.set("url", url);
newcounter.set("times", 1);
newcounter.save(null, {
  success: function(newcounter) {},
  error: function(newcounter, error) {
    console.error('Failed to create!');
  }
});
```

在这里创建了`title`、`url`、`times`3个属性列，并设置其中的值为未有阅读量文章的相关信息。


说回安全控制，可使用如图所示的方法，这也是官方推荐使用的方法，这样就确保在一定域名下才能访问你的敏感数据。


![添加安全域名](http://olpvawdcl.bkt.clouddn.com/bmsz65rvvaryxq9mlgdxuvu4hi)





#### 统计阅读量

```javascript
for (var i = 0; i < arrLength; i++) { 
(function(index) {
    var query = new AV.Query(className);
    var item = null,
    url = "";
    item = $targetArr[index];
    url = item.getAttribute('data-leadcloud-url');
    query.equalTo("url", url);
    query.find().then(function(results) {
      if (results.length > 0) {
        var counter = results[0];
        var times = counter.get("times");
        item.innerHTML = times.toString().trim();
      } else {
        item.innerHTML = 0;
      }
    });
  })(i);
```

这里使用遍历是因为在归档页面有多个文章需要查询阅读量。核心代码解释如下：

- `var query = new AV.Query(className);` 新建一个[Query对象](https://leancloud.github.io/javascript-sdk/docs/AV.Query.html)，而className为你在leancloud后台新建应用的`Class对象`。

- `query.equalTo("url", url);`为查询条件设置。在ylion主题中，以文章的url比如`/2017/02/22/制作Hexo主题详细教程（1）/`作为查询条件。更多的查询方式和逻辑运算请看[官方文档相关内容](https://leancloud.github.io/javascript-sdk/docs/AV.Query.html)

- `var times = counter.get("times");`获取`Class对象`中的`times`列，并赋值。


#### 热门文章

```javascript
var query = new AV.Query(className);
query.descending("times");
query.limit(limits);
query.find().then(function(results) {
  for (var i = 0,
  length = results.length; i < length; i++) { (function(index) {
      var item = results[index];
      title = item.get('title') || 'No Title!';
      url = item.get('url');
      times = item.get('times');
      $result += '<li class="popular-item popular-item-' + (index + 1) + '">';
      $result += '<a href="' + url + '">' + title + '<sup>' + times + '</sup></a>';
      $result += '</li>'
    })(i);
  }
  $popularContent.innerHTML = $result;
```

如果理解了上面的查询过程，那么热门文章的获取也就很好理解了。先是获取Query对象，再对`times`进行降序，再选取`limits`篇文章，将其进行字符串拼接，最后更新`innerHTML`。

在这里只是对部分代码进行讲解，如果你想看完整代码，[Here](https://github.com/GeekaholicLin/hexo-theme-ylion/blob/master/source/js/app.js#L319-#L406)，之后的地址和代码可能会进行更改，而且我相信你会写出更加优美的代码而不是复制粘贴。

leancloud的集成还特别感谢"[使用LeanCloud平台为Hexo博客添加文章浏览量统计组件](http://crescentmoon.info/2014/12/11/popular-widget/)"该篇文章。

## 更强的自定义

在上一篇文章中，讲到有好多目录，其中有一个`scripts`目录，这个目录和`source`目录下的`js`目录是**不同**的，前者是在部署之前的脚本，后者是部署之后，前端使用的脚本文件。在官方的[API](https://hexo.io/zh-cn/api/)中的拓展有很多，比如`Console`、`Filter`、`Generator`和`Helper`等。本人接触的不多，只能将自己的见解写下来，如果有错误，还望指出~

在我个人的理解看来，Helper是为了代码的模块化和复用代码块而存在，Generator为了生成所需文件而存在，Filter是为了改变原先的文件内容而存在。除了写过Helper以及改写过`hexo-generator-search`外(因为该插件并不提供标签和分类搜索，已提交了[pr](https://github.com/GeekaholicLin/hexo-generator-search/pull/1))，其余的尚未接触过，就不误人子弟了。

很多人可能会问了，在前端模版引擎中照样可以写逻辑处理，为什么不那样？

其实可以是可以，但是当逻辑过于复杂或者代码量过大，写在ejs文件里面不利于复用和维护，就像内嵌的JavaScript一样。在前面的文章讲到，Hexo为我们提供了很多的辅助器，而这辅助器和`scripts`目录下的脚本文件一样的性质，只不过接口不同，代码的编写不同，但是大同小异，因为都是用的JavaScript。

### Hexo自带的辅助函数

是不是觉得Hexo提供给我们的辅助函数很好用？或者，你想根据自己的主题需要，想在原来的辅助函数上进行修改？

首先我们得找到文件所在，在博客目录下的`/node_modules/hexo/lib/plugins/helper`目录中，可以找到与Hexo自带的辅助函数同名文件。比如`<%- js(path, ...) %>`辅助函数对应`js.js`文件，其他的一般也是如此(但是`is_home`等都在`is.js`文件中)，`js.js`的代码如下：

```javascript
'use strict';
function jsHelper() {
  var result = '';
  var path = '';

  for (var i = 0, len = arguments.length; i < len; i++) {
    path = arguments[i];

    if (i) result += '\n';

    if (Array.isArray(path)) {
      result += jsHelper.apply(this, path);
    } else {
      if (path.substring(path.length - 3, path.length) !== '.js') path += '.js';
      result += '<script src="' + this.url_for(path) + '"></script>';
    }
  }

  return result;
}

module.exports = jsHelper;
```
这样就可以在原本的基础上，根据自己的需求进行修改了^-^

在ylion主题中，[my_paginator.js](https://github.com/GeekaholicLin/hexo-theme-ylion/blob/master/scripts/helper/my_paginator.js)文件就是在自己的需求上进行修改。原本的分页器在首页会隐藏"上一页"的按钮以及在末页会隐藏"下一页"的按钮，觉得不美观，就进行了更改，只让其不可点击，而不是隐藏。

至于自定义Helper的使用方法，也是和自带的Helper使用方法一样`<%- my_paginator()%>`。


### 如何编写Hexo Helper

但是在原本基础进行修改并不能解决所有的情况，比如提取post文件中的图片地址，比如让文章支持top置顶功能。在这里以`文章支持top置顶功能为例`。置顶功能查看过很多博文，都是提倡使用修改Hexo的排序算法。我在写ylion主题的时候也查看过Next主题的相应的源代码，但是看不懂...所以就决定根据[该博文](http://www.netcan666.com/2015/11/22/%E8%A7%A3%E5%86%B3Hexo%E7%BD%AE%E9%A1%B6%E9%97%AE%E9%A2%98/)的排序算法，自己写一个支持置顶功能的Helper。（Update: 该方法有个bug，文章页的上一篇和下一篇还是会是以时间为序，待解决）

先说大概的思路：

1. 对全部的文章进行排序
2. 问题还没解决。原本的Hexo分页是按照日期进行的，当点击下一页的时候，出现的文章还是原先的排序，而我们需要的是展示自己的排序，所以我们还需要改变一下遍历的变量。
3. 我们可以根据第一步排好的顺序，再根据当前页数，每页的文章数目就可以`slice`对应部分赋值给`curPosts`，并对其进行遍历，而不仅仅遍历`page.posts`。


先是实现了排序功能的Helper


{% codeblock sortPosts lang:javascript https://github.com/GeekaholicLin/hexo-theme-ylion/blob/master/scripts/helper/sortPosts.js sortPosts.js%}
function sortPostsFunc(posts) {
  var datas = posts.data.sort(function(a, b) {
    if (a.top && b.top) {
      if (a.top == b.top) return b.date - a.date;
      else return b.top - a.top;
    } else if (a.top && !b.top) {
      return - 1;
    } else if (!a.top && b.top) {
      return 1;
    } else {
      return b.date - a.date;
    }
  });
  return datas;
}
hexo.extend.helper.register('sortPosts', sortPostsFunc);
{% endcodeblock %}


`hexo.extend.helper.register('sortPosts', sortPostsFunc);`是核心部分，就像`nodejs`暴露接口一样，`sortPosts`为提供ejs文件使用的Helper名字，而`sortPostFunc`为Helper的逻辑处理函数，而参数`posts`则是在使用的使用所用到的,也就是实参是`site.posts`


而`curPosts`变量的获取使用了`getCurPosts`这个Helper，代码比较简短，相信大家可以看得懂，就不详细说明了。

```javascript
function getCurPosts(sortedPosts, config, page) {
    return sortedPosts.slice((page.current - 1) * config.per_page, page.current * config.per_page);
}
hexo.extend.helper.register("getCurPosts",getCurPosts);
```

可以发觉，实现一个Helper并没有什么难度，也是考察JavaScript的编写能力。两个Helper的使用方法可以查看[这部分代码](https://github.com/GeekaholicLin/hexo-theme-ylion/blob/master/layout/index.ejs#L5-L8)


制作Hexo主题详细教程系列基本上算是完结了。而[第一篇](/2017/02/22/制作Hexo主题详细教程（1）/)说会写`ylion主题的小功能及其实现思路`。但想想，好像与主题制作无关，只能算是彩蛋部分，所以**暂时移除**。后面再用一篇文章专门讲讲这个方面吧~


---