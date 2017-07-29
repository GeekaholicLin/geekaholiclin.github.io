---
title: 读书笔记--CSS设计指南(理论部分)
toc: true
date: 2016-03-11 23:36:41
categories: [黄金屋--读书笔记, CSS设计指南]
tags: [CSS设计指南, 读书笔记, 兼容性, polyfill]
---

## 说在前面

> 如果你看到这部分内容竟然和《css设计指南》的如此相似，不要惊讶，因为这个是我在看书时的笔记，权当是查漏补缺和加强自己的理论知识。当然，不是全书地照搬，还会增加个人的理解，还有一些很好的文章。比如`@font-face`的使用，找了很多不错的参考文章，作为对书中的补充。
如果你和我是从初级阶段，当过几次切图仔(本人目前还是)，想进阶到更高一个级别，那这部分内容你不容错过。因为在你使用的时候并不注意，一些坑坑洼洼会让你烦恼很久。如果你是大神级别，还不吝你能指出错误，感激不尽~


此部分为[CSS设计指南(第3版)][27]读书笔记的理论部分(**个人认为**)，除开第5章部分，第6章全章，第7章全章。


## 知识点大杂烩

### 那些坑儿

1. 不设置宽度的块级元素盒子会扩展到与父元素同宽

2. 有一点很重要，那就是 CSS 样式是通过``<style>``标签嵌入到页面里的。当浏览器遇到
开标签``<style>``时，就会由解释 HTML 代码切换为解释 CSS 代码。等遇到闭标签``</style>``时，它会再切换回解释 HTML 代码

3. 紧邻同胞选择符+,一般同胞选择符~

4. 一个冒号（:）表示伪类，两个冒号（::）表示 CSS3 新增的伪元素。尽管浏览器目前都支持对 CSS 1 和 CSS 2的伪元素使用一个冒号，但希望你能习惯于用双冒号代替单冒号，因为这些单冒号的伪元素最终可能都会被淘汰掉。~~~更多相关信息，可以参见这里：传送门~~~

5. 通过在上下文选择符中使用链接伪类，可以轻易地为 nav、 footer、 aside 和article元素中的链接应用不同的外观和行为。[技巧一]

6. link伪类四个同时使用的时候 ：为了好记，我建议大家可以这
么想：“ LoVe? HA!”大写字母就是每个伪类的头一个字母。【顺序问题困扰很久】

7. 新学习的伪类，**`:target`** 

> 如果用户点击一个指向页面中其他元素的链接，则那个元素就是目标target），可以用:target 伪类选中它。
对于下面这个链接`<a href="#more_info">More Information</a>`位于页面其他地方、 ID 为more_info 的那个元素就是目标。该元素可能是这样的：`<h2 id="more_info">This is the information you are looking for.</h2> ` 那么，如下CSS规则 `#more_info:target{background:#eee;}` 会在用户单击链接转向ID为more_info的元素时，为该元素添加浅灰色背景。

8. `:nth-child` 伪类最常用于提高表格的可读性，比如对表格的所有行交替应用不同颜色。

> `e:nth-child(n)`,括号里的n为第n个元素e元素

9. `font-variant`： 属性设置小型大写字母的字体显示文本

10. p::first-line {font-variant:small-caps;}`
可以把第一行以小型大写字母显示。
11. `::first-line`为伪元素。伪元素就是你的文档中**若有实无**的元素。类似的还有`::first-letter`，可以设置第一个字的样式.`::before `和`::after `伪元素。

"first-line"，"first-letter" 伪元素只能用于块级元素。

> **搜索引擎不会取得伪元素的信息（因为它在标记中并不存在）。因此,不要通过伪元素添加你想让搜索引擎索引的重要内容**。

11. color 是前景色，前景色既影响文本，也影响边框。但人们通常只用它设定文本颜色。
12. 要改变背景图片的起点，可以修改 background-position 属性。
13. 只给 background-position 设定一个关键字值，则另一个也会取相同的值。
    > /*center center 的简化写法*/
    p#center {background-position:center;}

14. `background-position:center center`设定**图片中心点与元素中心点重合**，然后再向各个方向重复。
15. 由14可知，通过把`background-position`设定为 `50% 50%`，把 `background-repeat`设定为`no-repeat`，实现了图片在背景区域内居中的效果。

16. `background-size `为我们控制背景图片提供了更多可能性。

~~~17. `font-size`,`height`,`line-height`三者的关系是：`height`将盒子撑开，`line-height`是从文本的**基线**处在文本行上下平均分配，**不影响标准文档流**，`font-size`是在从文本的**基线**处开始变大，会撑开盒子模型，但可以显示在其他元素上方。丝毫不影响标准文档流。不信可以在Chrome中将`font-size`调大进行观察~~~。(update:尚未熟悉)
18. 使用 Modernizr来检测浏览器对它们的支持情况，并为不支持它们的浏览器提供替代 CSS。

> Modernizr 是一个 JavaScript 库，用于检测用户浏览器支持哪些 HTML5 和 CSS3 功能。
更多信息，请参考这个网址： [http://modernizr.com][2]

19. 默认情况下，背景绘制区域是扩展到边框外边界的。
> 如果想使用更多的选择，使用CSS3中的`background-clip`属性。提供3个可选值。
background-clip: border-box;/*背景包括border*/
background-clip: padding-box;/*背景包括padding，不包括border*/
background-clip: content-box;/*背景包括content，不包括padding和border*/

20. `font-family` 用于设定元素中的文本使用什么字体。一般来说，应该给整个页面设定一种主字体，然后只对那些需要使用不同字体的元素再应用 `font-family`。要为整个页面指定字体，可以设定 body 元素的 `font-family` 属性。`font-family`是可以继承的属性，因此它的值会遗传给所有后代元素。

21. 小技巧:我们永远也不敢保证一定能用某种字体来显示网页。为此，在指定文本的字体时，需要多列出几种后备字体，以防第一种字体无效。这个字体的列表也叫**字体栈**。

22. 西方国家字母体系分为两类：`serif`以及`sans serif`。`serif`是有衬线字体,在每个字符笔画的末端会有一些装饰线。 `sans-serif`，也就是无衬线字体，字符笔画的末端没有装饰线。具体看下图。

![字体][3]

23. 字体大小
 
> 默认情况下， 1em等于 16 像素，这也是 font-size 的基准大小。如果需要重新设定了基准大小，则修改body 的字体大小。body的字体大小即为1em(比如重新设定为20px,则1em = 20px)

* 绝对字体大小。
    优点：它们是绝对单位，因此设定多大就多大，与祖先元素的字体大小无关。
    缺点：**使用绝对单位的缺点很明显，那就是在需要调整页面所有元素的字体大小时，必须一个一个地修改样式表中的 font-size**。

* 相对字体大小。如果你给某个元素设定了相对字体大小，则该元素的字体大小要相对于**最近的“被设定过字体大小的”祖先元素**来确定。
    优点：使用相对大小后，通过调整body元素的字体大小，可以成比例地改变所有元素的字体大小。或者，至少能通过改变某个祖先元素，只影响它的所有子元素。
    缺点：“牵一发而动全身”的事，出现连锁反应，所以使用相对字体大小时，必须事先规划好。
【请看下面例子】

```java
    <body>
        <p>This is <strong>very important!</strong></p>
    </body>
    
    p {font-size:.75em;}
    strong {font-size:.75em;}
    
    //计算
    
    font-size(p) = 0.75*16px = 12px;
    font-size(strong) = 12px * 0.75 = 9px;
    
```

24. 默认值并不是无用，它可以用来有选择地覆盖某个默认或你设定的全局属性。

25. 由于浏览器对数字值的实现各不相同，所以从常规字体到粗体的切换可能发生在不同的数值上——通常是 400左右。总之，对于 font-weight 属性来说，最好只用 `bold` 和 `normal`这两个值。

**26**. 粗体和斜体：两个都有两种方法，一种是标签来控制显示，一种是用css来控制。

   * 斜体：`font-style:italic;`或`font-style:oblique;`或`<em>`
(emphasized)标签或`<i>`(italic)标签。
   * 粗体: `font-weight:bold;`或`<strong>`(strong)标签或`<b>`(bold)标签。
   
**那应该如何选择？**

> 其实，个人认为，如果不是特别强调的，不要轻易使用`<em>`,`<strong>`两种分别显示斜体和粗体。因为他们在搜索引擎中更受重视，将会影响SEO。也就是说，在一般情况下，使用css来控制字体样式(推荐)或者`<b>`和`<i>`。

27. **text-indent的那些坑**
【坑1】
`text-indent` 是可以被子元素继承的。如果你在一个 `div` 上设定了 `text-indent` 属性，那么 `div` 中的所有段落都会继承该缩进值。然而，与
所有继承的 CSS 值一样，**这个缩进值并不是祖先元素中设定的值，而是计算的值**。(注意)【请看下面例子】

> 假设有一个 400 像素宽的 div，包含的文本缩进 5%，则缩进的距离是 20 像素（400 的 5%）。
在这个 div 中有一个 200 像素宽的段落。作为子元素，它继承父元素的 `text-indent `值，所以
它包含的文本也缩进。但继承的缩进值是多少呢？不是 5%，而是 20 像素。也就是说，子元素
继承的是根据父元素宽度计算得到的缩进值。结果，虽然段落只有父元素一半宽，但其中的文
本也会缩进 20 像素。这样可以确保无论段落多宽，它们的缩进距离都一样。当然，在子元素
上重新设定 text-indent 属性，可以覆盖继承的值

【坑2】

> 一个容易疏忽的点，就是，`text-indent`对于块级文本元素有效，比如`<p>`，`<li>`。如果一个段落很长，则只会对首行缩进，要实现每行都缩进，可以使用多个`<p>`，或者`margin-left`属性(看需求)。


【坑3】

> 在设定缩进和外边距时**最好同时使用em**，以便在改变字体大小时，
它们的长度能够按比例变化。

28. 文本修饰的一些建议。

>  * blink 是为文本添加闪烁效果的，实际上很讨厌，应该少用，最好不用。
>  * 上网的人都习惯了把带下划线的文本当成链接。如果你给本来不是链接的文本加上下划线，很容易导致困惑和无效点击。
>  * 利用下划线的出现和隐藏，呈现有效的视觉反馈。


29. 间距的那些事儿~

> * `letter-spacing`对英文字母、汉字及其他字符都起作用。`etter-spacing` 的值是在浏览器默认值**基础上增加或减少**的值。

> * 纯汉字文本一段之中没有空格，因此`word-spacing`对中文网页几乎没有用，但对中英混排段落可能有用。【见下图】

![中文word-spacing][4]

30. 自定义字体库@font-face(css3属性，IE9+才支持)

使用@font-face 规则在网页中嵌入可下载字体的 CSS 功能，为设计师提供了系统自带字体以外的广泛选择，不必再依赖用户机器中的字体。有3种使用方法。

1. 使用 [Google Web Fonts][5] 或 Adobe 的 Typekit 等公共字体库。
2. 使用事先打好包的@font-face 包。
3. 使用 [Font Squirrel][6] 用你自己的字体生成@font-face 包

> 小缺陷: 使用@font-face的一个问题是不同浏览器要求的字体格式不一样。比如， Firefox、Webkit 核心的浏览器（Safari 和Chrome），以及 iOS 4.1 版之后的移动Safari使用OTF（OpenType）或TTF（TrueType）字体。 Internet Explorer 使用 EOT（Embedded OpenType）。另外， iOS 4.1 之前版本中的移动 Safari 以及其他浏览器使用 SVG（Scalable Vector Graphics）格式。

讲那么多很难描述清楚，书中也是忽略而过。看下面的链接，已经讲得够详细。但需要提醒的是，在定义好自己的`font-family`之后，**在css中的选择器上使用才可以显示效果**。


> [传送门][7]


### 继承

CSS 中有很多属性是可以继承的，其中相当一部分都跟文本有关，比如颜色、字体、字号。然而，也有很多CSS属性不能继承，因为**继承这些属性没有意义**。这些不能继承的属性主要涉及元素盒子的定位和显示方式，比如边框、外边距、内边距。【继承对自身有意义的属性】

举个例子吧，假设我们想创建一个边栏，在其中放一组链接。为此，我们用 nav 元素嵌套该组链接，并给nav应用了一种字号和一个边框效果，比如 2 像素宽的红色边框。不难想象，nav中的所有链接都继承它的字号正常，可要是也继承它的边框就不合适了。当然，这些链接不会继承边框效果，因为 border 属性不能继承。

### 层叠

层叠，就是层叠样式表中的层叠，是一种样式在文档层次中逐层叠加的过程，目的是让浏览器面对某个标签特定属性值的多个来源，确定最终使用哪个值。这就涉及到了优先级。
优先级的大概计算如下[通俗易懂][8]
如果优先级的值一样，则以后者为先。

### 样式缩写

如果哪个值没有写，那就使用对边的值。
E.G. `{margin:12px 10px 6px;}`
对这个例子来说，由于没有写最后一个值（左边的值），所以左边就会使用右边的值。

> 叠加的只是垂直外边距，水平外边距不叠加。对于水平相邻的元素，它们的水平间距是相邻外边距之和。

## 盒子模型（加强）

### 盒子模型两大结论
> 盒模型结论一：没有（就是没有设置width的）宽度的元素始终会扩展到填满其父元素的宽度为止。添加水平边框、内边距和外边距，会导致内容宽度减少，减少量等于水平边框、内边距和外边距的和。[**其实也可以看成是结论二的特殊情况，因为最大宽度被父级宽度所限制，不会再增加**]

> 盒模型结论二：为设定了宽度的盒子添加边框、内边距和外边距，会导致盒子扩展得更宽。实际上，盒子的width属性设定的只是**盒子内容区的宽度**，而非盒子要占据的水平宽度。
（**补充：宽度高度都适用**。）
> 这两种盒子所表现出来的完全不同的行为，对将来构建多栏布局具有重要的启示。因为在多栏布局中，每一栏都必须时刻维护自己的宽度.
> CSS3 新增了一个 `box-sizing` 属性，通过它可以将有宽度的盒子也设定成具有默认的auto状态下的行为。【IE8+支持】
具体是怎么一回事？[box-sizing][9]

`box-sizing`的默认值是`content-box`，也就是上面的两个结论。
`box-sizing`的另外一个值，是CSS3的内容，`border-box`。就是将结论1的特性应用到结论2，无论是否有设定具体的高度和宽度，为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制，不会再增加元素的宽度和高度。

### 两大结论的好处


这两个结论有什么用？

> 在三栏布局的时候，最外层**固定宽度**，要在不改变盒子的宽度的前提下，需要增加外层和内容间的间距，如果使用内边距`padding`则会增加盒子的宽度。(见盒子模型结论2)。一个好的办法是使用`box-sizing:border-box;`，还可以增加一个`div`，不设置宽度。但考虑到那两个神一般存在的浏览器(IE6,IE7)，还是推荐使用方法2--增加一个`div`，不设置宽度【虽然方法1可以用JS的方式来实现，使用borderBoxModel.js】

```
<body>
<!-- HTML 标记 -->
<!-- 只让 IE8 之前的 IE 加载它 -->
<!--[if lt IE 8 ]>
<script src="helpers/borderBoxModel.js"></script>
<![endif]-->
</body>
```
但使用JS的方式有所局限，比如，宽高必须使用px作为单位。不支持` onresize, min/max-width等不固定属性`，如果布局复杂，还需要更多的测试来保证布局没有被破坏。[具体可以看这个github项目][10]

### 盒子模型的一些坑
盒子模型中还有一个巨坑。[坑在这~][11]

简单一句话（引自:《css权威指南》）

> 非替换元素的内边距，边框和外边距对行内元素及其生成框没有垂直效果；也就是说，他们不会影响行内框的高度。

什么是非替换元素和可替换元素？用一句话来区别~

> 可替换元素是**浏览器根据元素的标签和属性，来决定元素的具体显示内容**。

比如图像，浏览器根本不知道显示的是什么图片，只知道图片的地址，并且将其显示出来。

典型的可替换元素有 `<img>`、 `<object>`、 `<video>` 以及 `<textarea>`、 `<input>` 。还有，**使用了 CSS content 属性插入的对象被称作匿名的可替换元素**，比如`:before`和`:after`伪类。

需要注意的是，非替换元素和可替换元素，与 块级元素和行内元素，没有关系，两者是对元素的不同划分方式。

### 盒子模型和三列布局的优化

这一部分来自《css设计指南》第五章。
Tip 1
> 关于通配符`*`，它会导致浏览器遍历整个DOM结构去查找所有匹配的元素。但也发现这一点性能影响几乎可以忽略不计。除非页面有成千上万个元素。

这一部分还是不大同意作者所说，毕竟大家都已经习惯使用自己的重置样式表`reset.css`让自己的页面在各大浏览器尽量在间距等可控方面表现一致。况且对于大型网站而言，优化还是十分重要的。如果有时间，当然提倡根据自己的网站进行自定义。比如网站中没有使用到表格，就没有必要对表格进行消除间距。如果没有时间，**使用通配符达到目的也未尝不可**。

Tip 2

> `* {box-sizing:border-box}`

使用通配符和CSS特性，使得页面中的盒模型就全都符合逻辑。

Tip 3 保护布局

> * img{max-width:100%;} --限制图片的宽度不超过其父元素
> * 给内容包装`div`添加 `overflow:hidden` 声明,任何超出容器边界的部分剪切掉，保护布局。
> * 给所有栏的外包装元素应用 `word-wrap:break-word` 声明,保护布局不会被
长 URL或长文本顶得支离破碎。

## 浮动和清除浮动

浮动元素**脱离了常规文档流**之后，原来紧跟其后的元素就会在空间允许的情况下，向上提升到与浮动元素平起平坐。

CSS 设计 float 属性的主要目的，是为了实现文本绕排图片的效果。后来，也成了创建多栏布局的方式。

对于`float:right;`的元素，它脱离文档流向右移动，直到它的右边框碰到包含框。如果包含框太窄，则自动向下浮动，直到有足够的空间(此时可能导致'卡住'的情况)。

### 清除浮动的方法

**清除浮动是清除浮动对被影响元素本身的影响，而不是浮动本身**。对影响的元素使用`clear:left;`是**清除浮动在左边的元素对该元素的影响，不去围绕着它浮动的元素**。

* 1. 给父级元素添加overflow:hidden,迫使父元素包含其浮动的子元素,但对于父元素中高度超过浮动元素的其他内容，会进行截断。
* 2. 浮动父级元素。浮动父级元素后，不管其子元素是否浮动，它都会紧紧地包围（也称收缩包裹）住子元素。
* 3. 添加非浮动的清除元素。（注意此时父元素未浮动）
    * 3.1 在(未浮动的)父元素最后一个非浮动子元素添加一个非浮动的
子元素，然后清除该子元素。常做的做法是添加一个空的`<div>`标签。(例子1)
    * 3.2 利用浮动元素的**下面的兄弟元素**清除。（例子1中的`<p>`），如果浮动元素下面没有兄弟元素，则不可使用该方法。
    * 3.3 使用`:after伪元素`。`:after`会在元素内容后面而不是元素后面插入一个伪元素，在例子2中是**the footer element…**后面添加一个点，而不是在`<section>`父级元素后面添加。但设置`height:0;`后因为没有高度，父级元素不把它包含住，所以显示是在父级元素后面添加，其实不是的。**可以自己将`visibility:hidden`去掉，调整高度进行观察**。
```java
/*例子1--html*/
<section>
<img src="images/rubber_duck.jpg">
<p>It's fun to float.</p>
<div class="clear_me"></div>
</section>
<footer> Here is the footer element…</footer>

/*例子1--css*/
section {border:1px solid blue;}
img {float:left;}
.clear_me {clear:left;}
footer {border:1px solid red;}

/*例子2--html*/
<section class="clearfix">
<img src="images/rubber_duck.jpg">
<p>It's fun to float.</p>
</section>
<footer> Here is the footer element…</footer>

/*例子2--css*/
.clearfix:after {
content:".";
display:block;
height:0;
visibility:hidden;
clear:both;
}

```
在方法2和方法3中，由于包含元素一定会包围非浮动的子元素，而且清除会让这个**子元素位于（清除一侧）浮动元素的下方**，因此包含元素一定**会包含这个子元素——以及前面的浮动元素**。【特别注意这部分的描述】

且方法3.1和方法3.2不同，3.1的p元素还是会受浮动的影响，围绕在图片周围，而3.2的p元素不会受到浮动的影响，因为是p元素是块级元素，所以它**在图片下面独自一行**。

### 使用哪一种？

这三种方法的使用要因地制宜。比如，不能在下拉菜单的顶级元素上应用
overflow:hidden，否则作为其子元素的下拉菜单就不会显示了。因为下拉菜单会显示在其父元素区域的外部，而这恰恰是 `overflow:hidden` 所要阻止的。再比如，不能对已经靠自动外边距居中(`margin:0 auto;`)的元素使用“浮动父元素”技术，否则它就不会再居中。而是根据浮动值浮动到左边或右边了。



## 布局

因为文章篇幅的原因，布局就移到另外一篇文章(实战部分)进行总结。这里大概给出几种常见，并且重要的布局方式。

### 响应式布局(可变的固定布局)

使用一项叫媒体查询的CSS功能，很容易检测出用户设备的屏幕大小。然后，据以提供替代或额外的CSS，可针对相应屏幕实现更加优化的体验。使用这种方式创建对设备有感知力的网站，被称为响应式设计。实际上真正的设计原则是“移动先行”，屏幕从小到大。

一种布局不能适应多种屏幕尺寸。我们需要一种能够检测屏幕大小的方法，然后相应地修改布局。简言之，就是需要让页面能够自己响应屏幕变化。

* 需要的技术
    * 媒体查询：是一种CSS语法，可以根据浏览器的特性，一般是屏幕或浏览器容器宽度提供CSS 规则，将布局变为百分比或者改变html结构。
    * 流式布局：是使用em或百分比等相对单位设定页面总体宽度，让布局能够随屏幕大小而缩放；
    * 弹性图片：是使用相对单位确保图片再大也不会超过其容器。


#### 媒体查询

> 移动设备的媒体查询:http://pugetworks.com/blog/2011/04/css-media-queries-for-targetingdifferent-mobile-devices/

#### 媒体类型

常用的媒体类型如下。

> all：匹配所有设备；
handled：匹配手持设备（小屏幕、单色、带宽有限）；
 print：匹配分页媒体或打印预览模式下的屏幕；
 screen：匹配彩色计算机屏幕；
 其他媒体类型还有 braille（盲文点字触觉反馈设备）、 embossed（盲文分页打印机）、projection（投影仪）、 speech（语音合成器）、 tty（电话机屏幕等固定宽度字符栅格设备）和 tv（电视机）。
 
 **任意时刻浏览器窗口中只能使用一种媒体类型**。

#### 媒体特性

媒体特性也就是媒体某一方面的特征，一般带有 min-或 max-前缀。
常用的媒体特性如下：

> min-device-width 和 max-device-width：匹配设备屏幕的尺寸；
min-width 和 max-width：匹配视口的宽度，例如浏览器窗口宽度；
orientation（值为portrait(竖屏)和landscape(横屏)）：匹配设备是横屏还是竖屏。
如果想通过媒体查询来根据用户对浏览器窗口的缩放重新调整布局，应该使用 min-width 和max-width。 

还可以使用逻辑运算符 and、 not、 or 及关键字 all、 only 组合媒体类型和媒体特性。

> 	`media="only screen and (max-width: 480px)"`

#### 使用方法

> 把 CSS 规则嵌套在了一个@media 规则中。

```java
    @media screen and (max-width:568px) {
        .column {float:none; width:96%; margin:0 auto;}
    }
```
注意该@media规则是放在css文件中或者`<style>`标签中使用，如图：

![@media使用][12]


> 如果要通过媒体查询应用的CSS规则非常多，那么就可以考虑使用<link标签的media 属性设定条件，有选择地加载独立的样式表。

```java
<link type="text/css" media="print" href="css/print_styles.css" />
<link type="text/css" media="screen and (max-width:568px)"
href="css/iphone_styles.css" />
```
**断点**是指区分不同宽度设备的临界点。
比如:`@media screen and (max-width:640px) { /*CSS 规则*/ }`，断点是640px。

> 一个匹配的技巧是，不要去用断点一下子去匹配特定设备的屏幕宽度。而是**慢慢地缩小窗口，在发现当前布局不合适的时候再确定断点**，编写新的样式。可以确保一个样式在特定宽度范围内都适用。减少工作量。

#### viewport(视口)

用<meta>标签设定视口。比如：`<meta name="viewport" content="width=device-width; maximumscale=1.0" />`。这个<meta>标签告诉浏览器按照屏幕宽度来显示网页，不要缩小网页。


### 流动布局
流动布局的大小会随用户调整浏览器窗口大小而变化。这种布局能够更好地适应大屏幕，但同时也意味着放弃对页面某些方面的控制，比如随着页面宽度变化，文本行的长度和页面元素之间的位置关系都可能变化。Amazon.com 的页面采用的就是流动中栏布局，在各栏宽度加大时通过为内容元素周围添加空白来保持内容居中，而且现在的导航条会在布局变窄到某个宽度时收缩进一个下拉菜单中，从而为内容腾出空间。

### 弹性布局

弹性布局与流动布局类似，在浏览器窗口变宽时，不仅布局变宽，而且所有内容元素的大小也会变化，让人产生一种所有东西都变大了的感觉。

### 圣杯布局(略)
### 双飞翼布局(略)

## 兼容性之后备代码

### 同一表现的前后顺序

已经知道的兼容属性放在前面，而部分浏览器不兼容的新属性放在后面。浏览器不支持新属性时，会自动忽略后面的新属性。而如果浏览器支持新属性，由于`[css的层叠][13]`会自动覆盖。如下面的书中举例。


IE9 之前的浏览器都不支持多背景，因此后备代码就是在多背景
声明之前简单地再加一条单背景声明，比如：
```
.someElement {background-image:url(images/basic_image.jpg);}
.someElement {background-image:
url(images/cool_image1.jpg),
url(images/cool_image2.jpg),
url(images/cool_image3.jpg);
}
```

### 条件注释

#### IE浏览器

如果你真想单独为 **IE浏览器**做点什么，可以使用如下所示的条件注释来添加后备代码。

```
<!-- 在为 IE8 及更低版本的 IE 加载额外的样式 -->
<!--[if lte IE 8]> <!-- IE 条件注释 -->
<link src="ie_only.css" rel="stylesheet" />
<![endif]-->
```
lte（less than or equal to，小于等于）、 lt（less than，小于）、gte（greater than or equal to，大于等于）、 gt（greater than，大于），甚至只写一个浏览器版本号，如 IE 6。以此为不同版本的 IE 提供后备代码。



**注意**：这种条件注释只对**指定版本的IE浏览器**有效，而不满足版本的IE浏览器和其他非IE浏览器都会自动忽略该条件注释。

#### 特定标签
不算是条件注释的一部分，但个人感觉有一定的逻辑在里面。故把这个十分有用的标签放在这一部分。
noscript 元素用来定义在脚本未被执行时的替代内容（文本）。
这个标签可被用于可识别`<script>`标签但无法支持其中的脚本的浏览器。用法和普通的html标签一样。

### 腻子脚本

> 腻子脚本（polyfill）指的是**一段JavaScript代码**，能够赋予浏览器未曾有过的功能。

[一份完整的腻子脚本列表][14]，配合[modernizr][15]使用效果更佳。前者负责修复，后者负责通过检查支持情况添加相应的类，便于前者操作。

![Modernizr添加了大量的表明浏览器功能的类--来自adobe][16]

实现'古老浏览器'对HTML5和CSS3的支持的大概过程如下。

> 1. **Modernizr**脚本能够帮你检测用户浏览器对 HTML5 和 CSS3功能的支持情况。
> 2. 为顶级的<html>标签添加一组类(为 CSS 提供便利)，标明浏览器支持什么功能。
> 3. 设定一个 JavaScript对象modernizr的属性，以便通过JavaScript 来测试这些功能。

更详细的用法见[使用Modernizr 检测HTML5和CSS3浏览器支持功能][17]

以下是[CSS设计指南(第3版)][18]列出的常见polyfill（腻子脚本）

* [html5shiv.js][19]：让 IE8 及更低版本的 IE 识别section、 article、 nav 等 HTML5 元素。
* [selectivizr][20]：让 IE（6/7/8）支持::first-child 等高级
CSS 选择符。
* [IE9.js][21]：修复从 IE6 到 IE9 的很多 bug 和缺损功能。
* [CSS3Pie][22]：让 IE6 到 IE9 支持圆角、背景渐变、边框图片、盒阴影、 RGBa 颜色等可视化的 CSS3 功能。
* [Respond.js][23]：让旧版本浏览器支持媒体查询。
* [-prefix-free][24]为需要厂商前缀的 CSS3 声明添加前缀。【这一条还是使用IDE自己添加比较好，webstorm就有某个属性全部添加的功能】
* [borderBoxModel.js][25]：让 IE6 和IE7 支持 CSS3 的 box-sizing 属性。

---

**参考文章与书籍**：

[Airen的博客--CSS3 @font-face][26]

[CSS优先级特性][8]

[CSS设计指南(第3版)][27]

[使用Modernizr 检测HTML5和CSS3浏览器支持功能][28]


  [1]: http://www.w3.org/TR/2005/WD-css3-%20selectors-20051215/#pseudo-elements
  [2]: http://modernizr.com
  [3]: http://7xobsp.com1.z0.glb.clouddn.com/2016-03-14_00001.jpg
  [4]: http://7xobsp.com1.z0.glb.clouddn.com/2016-03-14_00002.jpg
  [5]: https://www.google.com/fonts/
  [6]: http://www.fontsquirrel.com
  [7]: http://www.w3cplus.com/content/css3-font-face
  [8]: http://liunian.info/css-specificity.html
  [9]: http://www.w3school.com.cn/cssref/pr_box-sizing.asp
  [10]: https://github.com/albertogasparin/borderBoxModel
  [11]: http://www.cnblogs.com/pomoho/p/4381753.html
  [12]: http://7xobsp.com1.z0.glb.clouddn.com/2016-03-15_00001.jpg
  [13]: #%E5%B1%82%E5%8F%A0
  [14]: https://github.com/Modernizr/%20Modernizr/wiki/HTML5-Cross-Browser-Polyfills
  [15]: http://%20modernizr.com
  [16]: http://7xobsp.com1.z0.glb.clouddn.com/2016-03-18_00001.jpg
  [17]: http://www.adobe.com/cn/devnet/dreamweaver/articles/using-modernizr.html
  [18]: https://book.douban.com/subject/23123255/
  [19]: http://code.google.com/p/html5shiv
  [20]: http://www.selectivizr.com
  [21]: http://code.google.com/p/ie7-js
  [22]: http://css3pie.com
  [23]: https://github.com/scottjehl/respond
  [24]: http://lea.verou.me/projects
  [25]: https://github.com/albertogasparin/borderBoxModel
  [26]: http://www.w3cplus.com/content/css3-font-face
  [27]: https://book.douban.com/subject/23123255/
  [28]: http://www.adobe.com/cn/devnet/dreamweaver/articles/using-modernizr.html