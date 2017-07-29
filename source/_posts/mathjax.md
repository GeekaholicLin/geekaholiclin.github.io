---
title: mathjax
date: 2017-02-19 14:51:32
mathjax: true
categories: [编程之外, hexo]
tags: [Hexo主题, ylion, Mathjax]
top: 9999
---

## 这是一个测试mathjax公式的页面

> 例子参考来自[wikipedia](https://zh.wikipedia.org/wiki/Help:%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8F) [请自备梯子]

**说明：** 主题是否要支持Mathjax，其实思考了挺久的。因为在Hexo下的默认markdown渲染会与
Mathjax的渲染冲突，而其他大部分的渲染并不如此。为了和其他的Markdown渲染引擎兼容，
[需要做一些工作](http://shomy.top/2016/10/22/hexo-markdown-mathjax/)。

~~如果是其他主题迁移到本主题，或者将以前在其他地方的文章放在本主题，为了更大的兼容性和减少工作量，还请使用上述链接中的[修改Hexo渲染源码](http://shomy.top/2016/10/22/hexo-markdown-mathjax/#修改hexo渲染源码)。~~

~~如果是第一次在本主题编写的Latex，还请做出一些妥协。为了通用性和减少工作量，你可以使用修改Hexo渲染源码的方法，但这本人并不推荐。
本主题参考[该网址](http://gohugo.io/tutorials/mathjax/)的做法，使用`<div></div>`包裹`Displayed Equation`，使用
`<code>`标签的点符号包含 `Inline Equation`，比如 '$inline Equation$'（此处为了演示，使用了单引号）~~

因为各种原因，还请各位自己参考[上述链接](http://shomy.top/2016/10/22/hexo-markdown-mathjax/)，自行寻找适合自己的解决方案。

本测试文件使用`hexo-renderer-pandoc`插件进行Markdown文件渲染。



### 函数、符号及特殊字符

#### 声调/变音符号


$$
\acute{a} \grave{a} \hat{a} \tilde{a} \breve{a}
\\
\check{a} \bar{a} \ddot{a} \dot{a}
$$



#### 标准函数


$$
\sin a \cos b \tan c\\
\sec d \csc e \cot f\\
\arcsin h \arccos i \arctan j\\
\sinh k \cosh l \tanh m \coth n\!\\
\operatorname{arsinh}r\,\operatorname{arcosh}s\,\operatorname{artanh}t\\
\lim u \limsup v \liminf w \min x \max y\!\\
\inf z \sup a \exp b \ln c \lg d \log e \log_{10} f \ker g\!\\
\deg h \gcd i \Pr j \det k \hom l \arg m \dim n
$$


#### 模代数

$s_k \equiv 0 \pmod{m}$` `$ a\,\bmod\,b $

#### 微分
$\nabla \, \partial x \, \mathrm{d}x \, \dot x \, \ddot y\, \mathrm{d}y/\mathrm{d}x\, \frac{\mathrm{d}y}{\mathrm{d}x}\, \frac{\partial^2 y}{\partial x_1\,\partial x_2}$

#### 分数、矩阵和多行列式

$$
\frac{2}{4}=0.5
$$
$$
\tfrac{2}{4} = 0.5
$$
$$
\cfrac{2}{c + \cfrac{2}{d + \cfrac{2}{4}}} = a
$$
$$
\dfrac{2}{4} = 0.5 \qquad \dfrac{2}{c + \dfrac{2}{d + \dfrac{2}{4}}} = a
$$
$$
\dbinom{n}{r}=\binom{n}{n-r}=\mathrm{C}_n^r=\mathrm{C}_n^{n-r}
$$
$$
\tbinom{n}{r}=\tbinom{n}{n-r}=\mathrm{C}_n^r=\mathrm{C}_n^{n-r}
$$
$$
\binom{n}{r}=\dbinom{n}{n-r}=\mathrm{C}_n^r=\mathrm{C}_n^{n-r}
$$
$$
\begin{Bmatrix}
x & y \\
z & v
\end{Bmatrix}
$$
$$
f(n) =
\begin{cases}
n/2,  & \mbox{if }n\mbox{ is even} \\
3n+1, & \mbox{if }n\mbox{ is odd}
\end{cases}
$$
$$
\begin{alignat}{3}
f(x) & = (m-n)^2 \\
f(x) & = (-m+n)^2 \\
& = m^2-2mn+n^2 \\
\end{alignat}
$$
$$
\begin{cases}
3x + 5y +  z \\
7x - 2y + 4z \\
-6x + 3y + 2z
\end{cases}
$$