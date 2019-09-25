---
title: 理清Java中的IO-Scanner
toc: false
date: 2015-12-28 20:24:13
categories: [编执狂, Java]
tags: [Java, IO操作, Scanner]
---


java.io.scanner 类用来从文件(包括'控制台')中读取字符串和基本类型数值.Scanner 可以将输入分为由空白字符分隔的标记。**为了能从键盘读取，需要为System.in创建一个Scanner实例**，即`Scanner input = new Scanner(System.in);`。不知道还记不记得上一篇文章讲到的"标准流"？

> 传送门

当然可以从文件中读取。`Scanner input = new Scanner(new File(filename))

**Scanner中常见的方法：**

> close() : void---关闭该Scanner
  hasNext() : boolean ---判断是否还有更多数据读取
  next(): String --- 从该Scanner中读取下一个标记作为字符串返回
  nextLine() :String ---从该Scanner中读取一行，以换行结束
  nextFloat() : float---从该Scanner中读取下一个标记作为float值返回(其他基本类型同理)
  useDelimiliter(String) :Scanner ---设置Scanner的分割符，并且返回该Scanner

<!--more-->

## Scanner 如何工作

当Scanner创建的时候，从指定的文件中(包括**字符串**，**控制台**)中**扫描标记**。Scanner中很多方法都和`标记`打交道，默认的标记是**空格**，可以使用上述的useDelimiliter()设置新的分隔符模式。这也可以在一定程度上解释了为什么当我们用空格分隔开输入的数据时，一般后面的数据不会被读取。

**那怎么样才算是一个标记呢**？无论前面有多少个分割符，都看成一个，且该数值以分隔符结尾。**简言之，被分隔符包围的都算一个标记**。而且，要注意next()和nextLine()的不要。虽然都是读取字符串，但是next()方法读取一个由分隔符分分隔的字符串，nextLine()读取一个以换行符结束的行。

### 代码实例

```java
import java.util.Scanner;

public class JavaIO {

    public static void main(String[] args) {
        String test = "这   是  一个  测试   字符串    ";
        Scanner input = new Scanner(test);
        System.out.println("该Scanner对象的分隔符为 ---->" + input.delimiter());
        System.out.println("结果如下");
        while (input.hasNext()) {
            System.out.println(input.next());
        }

        input = new Scanner(test);
        input.useDelimiter("个");
        System.out.println("该Scanner对象的分隔符为---->" + input.delimiter());
        System.out.println("新的结果如下");
        while (input.hasNext()) {
            System.out.println(input.next());
        }
        input.close();
    }

}
```
运行结果为：
> 该Scanner对象的分隔符为 ---->\p{javaWhitespace}+
结果如下
这
是
一个
测试
字符串
该Scanner对象的分隔符为---->个
新的结果如下
这   是  一
  测试   字符串

细心的应该会发现上述的方法中，有说到，"读取下一个标记作为float值返回"。对，是作为，不是读取**为float值的标记**，那如果该标记读取后无法转化为float类型怎么办？也就是如果标记和期望的类型不匹配。那就会抛出一个运行异常`java.util.InputMismatchException`。

> Scanner在使用之后一般要使用close()方法关闭，或者使用try-with-resources方法关闭，因为Scanner有实现AutoClosable接口。

```java
// 举例:Scanner 类(来自 Java API 文档)
public void close()

Closes this scanner.

If this scanner has not yet been closed then if its underlying readable also implements the Closeable interface then the readable's close method will be invoked. If this scanner is already closed then invoking this method will have no effect.

Attempting to perform search operations after a scanner has been closed will result in an IllegalStateException.
```
![侵删][1]


  [1]: http://old-image.geekaholic.cn/%E5%9B%BE%E7%89%87%20-%20Google%20%E6%90%9C%E7%B4%A2.jpg