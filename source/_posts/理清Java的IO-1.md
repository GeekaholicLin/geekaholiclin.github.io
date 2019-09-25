---
title: 理清Java的IO(1)--流
toc: true
categories:
  - 编执狂
  - Java
tags:
  - Java
  - IO操作
  - 流类型
date: 2015-12-27 10:14:00
---
> **声明:由于I/O操作的`Scanner`类不在java.io包内，不属于文中的主角--'`流类型`'，故留着最后，防止解说过于混乱**

## 概念
### 相关包
> `java.io`、`java.util` (Scanner这个特殊的存在)

### `文件`
> 文件就是字节序列。**每一个I/O设备，包括磁盘，键盘，显示器，甚至网络都可以视为文件**。--摘自《CSAPP》

至于在文件中，文本文件和二进制文件的区别，可以看上一篇文章。

### `流`

在Java的`I/O操作`中，流是一个很重要的概念。在计算机的基础课程中，有学习过`数据流`，`控制流`等，这是一种类比的思想，将Java的I/O操作更加形象地描述出来。在视频或者书籍中，都喜欢用'流'来描述`文件读取`的过程。为了便于理解和记忆，姑且可以把'**流'看成'水流'**，而**涉及'I/O操作的类'看成'管道'**，**'文件和程序'看出'水池'**。

![来自马士兵的Java视频][1]

<br/>

<!--more-->

## 流的分类

`java.io` 包中定义了多个`流类型`(类或抽象类)来实现输入/输出功能。在刚开始学习`Java`的`I/O操作`时，着实给那么多的类和方法吓到了。也有时搞不清楚，为什么一些类的构造方法是其他的I/O类为参数，而一些类的构造方法是`File类`或者`文件路径字符串`为参数如果不细细地梳理，可能在使用的时候就会很混乱。(虽然可以查找`API 文档`)。


### 个人记忆方法

那我们开门见山吧~其实很简单。[**请紧记于心**]
``` java
就两个"大类"--文本I/O和二进制I/O。
最后的单词是'-er'的(包括Scanner)是处理文本文件数据，'-Stream'可以处理二进制文件数据**以及文本数据**。
```
**为什么这样分**？！

SDK 所提供的所有流类型位于包java.io内都分别继承自以下4种**抽象**流类型。

|流的类型  | `字节流` |`字符流`|
|------------- | -------------|-------------|
输入流  | InputStream|Reader|
输出流  | OutputStream| Writer|
[四种抽象流类型]


> 抽象类`InputStream`是读取二进制数据的根类，抽象类`OutputStream`是写入二进制数据的根类。

**字节流一般处理的是二进制文件(包括文本)，而字符流处理的是文本文件**。
再来看一副图。这幅图替我们总结了IO操作中的IO'流'类。**这只是常见的，并不是所有。请注意**

![网络图片--侵删][2]

<br/>

仔细看图中的类，可以看到**I/O处理的类大部分是对称的**。也就是大部分4个一起出现。

当然，也可以从不同的角度对其进行分类，关键是**怎么记忆怎么来**。比如:
``` java
 按照数据流的方向不同可以分为输入流和输出流
 按照处理数据单位不同可以分为字节流和字符流
 按照功能不同可以分为节点流和处理流
```
先来解释这3种不同分法的'流'。

### `输入流`和`输出流`(Input/Output Stream)

输入流和输出流
在程序和文件当中，**输入流和输出流是相对的**。当读取文件的时候，从程序的角度看，**文件数据**是输入流，从文件的角度看则是输出流。**输入输出是相对于参考体而已的，远离则为输出。**

### `字节流`和`字符流`(byte Stream/character Stream)
- 字节流的数据处理单位是字节(8bit)
- 字符流的数据处理单位是2个字节的Unicode 字符(16bit)

为什么存在字节流还需要字符流？因为存在二进制文件和文本文件。
### `节点流`和`处理流`

- 节点流为可以从一个特定的数据源(节点)直接读取数据。
- 处理流是"连接"在已经存在的流(**节点流或处理流**)之上，通过对数据的处理，为程序提供更为强大的读写功能。

看到`节点流`和`处理流`，应该知道为什么一些类的构造方法是其他的I/O类为参数，而一些类的构造方法是`File类`或者`文件路径字符串`为参数了吧？

#### 构造方法不同的原因

以"程序以`FileReader`类读取文件"的过程为例。按照前面所说的思维方法，把'**流'看成'水流'**，而**涉及'I/O操作的类'看成'管道'**，**'文件和程序'看出'水池'**。

> 1.文件读取流，首先是利用文件的地址字符串或者文件(File)对象，进行建立，成为了**节点流**。

这个过程可以看作是:

> 要从一个水池A(文件)中取水到另外水池B(程序运行时分配的内存空间)，首先把小的管道('节点流'类型的类,FileReader)插在水池的出水口。这个插的过程相当于**构造**一个'节点流'。所以，FileReader 对象的构造方法中要有File 对象 或者 "文件路径的字符串"。这时就是`节点流`。

```java
FileReader的3个构造方法：

FileReader(File file)
Creates a new FileReader, given the File to read from.
FileReader(FileDescriptor fd)
Creates a new FileReader, given the FileDescriptor to read from.
FileReader(String fileName)
Creates a new FileReader, given the name of the file to read from.
```
> 2.而为了更加方便地读写数据和操作文件(因为处理流提供了很多好用的方法，如BufferedReader的readLine()可以读取一行数据)，引入了处理流。处理流的构造方法参数为节点流或者处理流的子类。

这个过程可以看作是:
> 在取水的时候，发现水中有杂质。想要它先缓冲在一个地方进行过滤、沉淀，等到一定的水量之后再一次输入到水池B中。这时我需要一个带有过滤头并且具有缓冲功能的大水管('处理流'类型的类,BufferReader)。所以，BufferedReader中的构造参数要有'节点流'对象。这时候就是'处理流'。

```java
BufferedReader的2个构造方法：

BufferedReader(Reader in)
Creates a buffering character-input stream that uses a default-sized input buffer.
BufferedReader(Reader in, int sz)
Creates a buffering character-input stream that uses an input buffer of the specified size.

```

#### 代码实例
```java
public class JavaIO {

    public static void main(String[] args) {
        try {
            FileReader mFileReader ;
            char[] value = new char[2];
            File mFile = new File("D:\\test.txt");
            mFileReader = new FileReader(mFile);
            System.out.println("我是节点流对象mFileReader读取的数据");
            //一个字符一个字符地读取，当read()返回值为-1时，读取结束
            while (mFileReader.read(value, 0, 1) != -1) {
                System.out.print(value);
            }
            mFileReader.close();//读写结束后需要关闭
            System.out.println("\n~~~~~华丽丽的分割线~~~~~");
            mFileReader=new FileReader(mFile);//重新打开
            BufferedReader mBufferedReader = new BufferedReader(mFileReader);
            System.out.println("\n我是处理流对象mBufferedReader读取的数据");
            System.out.println(mBufferedReader.readLine());//只需要一句话
            mFileReader.close();//读写结束后需要关闭
            mBufferedReader.close();//关闭
        } catch (Exception ee) {
            ee.printStackTrace();
        }
    }

}
```
```
 运行结果

 我是节点流对象mFileReader读取的数据
 Hello,我是编执狂。欢迎来到Geekaholic的博客~
 ~~~~~华丽丽的分割线~~~~~
 我是处理流对象mBufferedReader读取的数据
 Hello,我是编执狂。欢迎来到Geekaholic的博客~
```

总结一下，**因为某一些流是处理流，是建立在其他节点流或处理流的基础之上，(相当于在节点流的"管道"基础上再套接一个管道)，所以构造方法需要某个'节点流'或'处理流'类型的对象为构造参数。**从程序中可以看到，更加方便地读写数据和操作文件。

#### 常见的`处理流`
**字节流-输入流**
ObjectInputStream(对象流)，SequenceInputStream(合并流)，FilterStream和它的子类(BufferedInputStream,DataInputStream等)。

**字节流-输出流**
ObjectOutputStream(对象流)，FilterStream和它的子类(BufferedOutputStream,DataOutputStream等)。

**字符流-输入流**
BufferedReader,InputStreamReader(转换流),FilterReader和它的子类。

**字符流-输出流**
BufferedWriterer,InputStreamWriter(转换流),FilterWriter和它的子类。

它们还是有一定的规律性的，比较对称。要查更多，请参照Java官方的`API文档`。要记住全部也不现实，但要记得一点。**处理流是在节点流或处理流的基础上构造的**，它可以(不是必须)用"节点流"对象做构造参数。

### 总结

从两大类--`文本I/O`和`二进制I/O`来梳理'流'。并从大的方向区分了各式各样的'流类型'，分享了记忆方法。
> 二进制I/O类中的所有方法都声明为抛出java.io.IOException或其子类。

【还有...】
因为IO操作的内容太庞大了，所以只能将它们分隔开来。这一篇主要从大的分类方向梳理I/O处理的"流"，第二篇会继续更新常见的具体'流'类，第三篇将更新Scanner的知识，比如工作原理。


  [1]: http://old-image.geekaholic.cn/sxt-javaio.jpg
  [2]: http://old-image.geekaholic.cn/javaio%E5%AD%A6%E4%B9%A0%E6%80%BB%E7%BB%93%20-%20-%20ITeye%E6%8A%80%E6%9C%AF%E7%BD%91%E7%AB%99.jpg