---
title: 【译】Map 与 FlatMap 的对比
date: 2017-9-27 17:22:05
tags: [Javascript, RxJS, Translation]
categories: [他山之石, Web]
translation: https://namitamalik.github.io/Map-vs-FlatMap/
---

This blog discusses difference between Map and FlatMap in RxJS.
[id.]
这篇博客主要讨论RxJS中Map和FlatMap的区别。

Anyone who has worked upon/read about **RXJS** must be aware about various operators that this library includes, some of them are:
[id.]
阅读或在工作使用**RxJS**的人一定会遇到RxJS中各式各样的操作符(operators)。包括但不限于：

1.  **0f** - It simply converts a list of arguments into an **Observable** sequence.[id.]**of** - 该操作符将参数列表简单地转换为**Observable**序列
2.  **from** - Creates an **Observable** sequence from an array or an object that can be iterated.[id.]**from** - 从一个数组或者可迭代的对象中创建**Observable**序列。
3.  **map** - Transforms each element of the **Observable** sequence. Can be considered similar to **map** function of **Array**.[id.]**map** - 转换**Observable**序列中的每一个元素。可以简单地将该方法比作Array实例的**map**方法。
4.  **subscribe** - This operator is basically the connecting point between an **Observer** and **Observable**. An **Observer** receives item/error/completion notification from **Observable** using the **subscribe** operator. A **cold observable** would start emitting value only when an **observer** subscribes to it.[id.]**subscribe** - 这个操作符主要是**Observer**和**Observable**两者的连接点

The above ones are like most commonly used and you would get to know many new ones.
[id.]
上面这些是最常用的，你可以知道更多新的操作符。

Well, I encountered a situation where I had **Observable** of **Observables** and I wanted a single stream out of them and to solve this I got introduced to another interesting operator:
[id.]
我之前遇到过一种使用**Observables**中的**Observable**(嵌套Observable)的情景，我想要获取单流输出。为了解决这个问题，接下来介绍另外的有趣操作符。

**flatMap** - It basically **merges an observable sequence of observable sequences into a single observable sequence.**
[id.]
**flatMap** - 它主要将observable序列中的observable序列合并成单个observable序列。


So, let's take a sample snippet to see how the it works. We have an array of visitors as given below:
[id.]
所以，让我们来看看一段代码，看其是如何工作的。我们有一个访问者数组，如下：

``` javascript
    let visitors = [
        "Namita",
        "Amit",
        "Rohit",
        "Neetika"
    ];
```
Now, we want this array to be converted into an **Observable** sequence, so it can be done something like:
[id.]
现在，我想要这个数组被转换为一个**Observable**序列，所以它可以像下面一样解决：

``` javascript
    let source = Rx.Observable.from(visitors)
        .map(x => 'Hello ' + x);
```

We will now have to subscribe to this sequence:
[id.]
让我们来订阅这个序列：

``` javascript
    source.subscribe(x => document.getElementById('flatMap').innerText += x + "\n");
```

And view would look like this:
[id.]
视图将会如下所示：

![map-flatMap.png](https://raw.githubusercontent.com/NamitaMalik/Map-vs-FlatMap/master/assets/map-flatMap.png)

But what we wanted to see was how to work with **observable of observable sequence**, so for that let's make some changes as given below:
[id.]
但是我们想解决的是如何使**observable序列中的observable**能正确处理，所以我们给上述代码做点改变：

``` javascript
    let source = Rx.Observable.from(visitors)
        .map(x => Rx.Observable.of('Hello ' + x));
```

... and our view would look something like this:
[id.]
然而我们的视图将会如下面图片一样（不正确地显示）：

![Map-error.png](https://raw.githubusercontent.com/NamitaMalik/Map-vs-FlatMap/master/assets/Map-error.png)

So how to fix this up? Well, now we'll have to use our **flatMap** operator as given below:
[id.]
所以应该如何修复？ 那我们就要使用**flatMap**操作符了：

``` javascript
    let source = Rx.Observable.from(visitors)
        .flatMap(x => Rx.Observable.of('Hello ' + x));
```

and now one can simply subscribe to it as we were doing earlier and our view as per our expectations:
[id.]
现在我们就可以像之前那样简单地订阅，即可得到我们期望的结果：

![map-flatMap.png](https://raw.githubusercontent.com/NamitaMalik/Map-vs-FlatMap/master/assets/map-flatMap.png)

So what's the exact difference between **map** and **flatMap**:
[id.]
所以，**map**和**flatMap**的区别是什么：

**map** transforms items emitted by an Observable by applying a function to each item whereas **flatmap**:
[id.]
**map**将方法应用于Observable发射(emit)出的items转换为单个元素的item，而**flatmap**是：

1.  Applies a specified function to each emitted item and this function in turn returns an Observable for each item.[id.]发射出的每一个值运用特定方法，该特定方法将每一个值处理为一个Observable(序列)并依次返回
2.  flatMap then merges all these sequences to make a new sequence.[id.]flatMap然后将所有这些序列合并成一个新的单一序列。

So let's make a small ASCII marbel to make our understanding more clear:
[id.]
让我们来使用ASCII珠宝图梳理一下上述的区别，或许更加通熟易懂。

```
    ----Namita---Amit---Rohit---Neetika----- //Input Stream
    .map(x => 'Hello ' + x);
    ---Hello Namita---Hello Amit---Hello Rohit---Hello Neetika--- //Map's function result

    ----Namita---Amit---Rohit---Neetika----- //Input Stream
    .flatMap(x => Rx.Observable.of('Hello ' + x))
    --Hello Namita--     //transforming each input element into an Observable
    --Hello Amit--
    --Hello Rohit--
    --Hello Neetika--
    ---Hello Namita---Hello Amit---Hello Rohit---Hello Neetika--- // Flatmap's final result
```

There is also another operator named as **.mergeAll** which we can use with **map** when we are in observable of observables situation instead of directly using **flatMap**. **RxJS** has numerous operators and hopefully this learning voyage will take us to each one of them.. till then happy learning!
[id.]
当需要处理observables中的observable(嵌套)的情况的时候，也可以使用另外的操作符**mergeAll**，和**map**搭配使用。这与直接使用**flatMap**的效果是一样的。
RxJS有着大量的操作符，希望这次学习之旅能帮到我们每一个人...继续快乐地学习。