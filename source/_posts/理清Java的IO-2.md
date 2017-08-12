---
title: 理清Java的IO(2)--流
toc: true
date: 2015-12-27 20:09:13
categories: [编执狂, Java]
tags: [Java, IO操作, 流类型]
---
## 前言

这是本博客中第二篇关于`Java IO`的文章，主要补充上一篇文章没有讲完的知识点--具体的'流'。上一篇链接:

> [传送门][1]

先来召唤上次文章所用的图吧。

![图片来自网络--侵删][2]
<!--more-->
## 常见的'流'类型

### 文件流--File Stream
`FileInputStream` 继承自InputStream 和 `FileOutputStream` 继承自OutputStream.

这两个类类用于从/向文件读取/写入字节。它们的方法都是从InputStream和OutStream类继承的，没有引入新的方法。使用文件(`File`)对象或文件路径字符串来作为参数进行实例构造。

```java
// 文件输入流构造方法
FileInputStream(File file) 
FileInputStream(FileDescriptor fdObj)
FileInputStream(String name)

//文件输出流构造方法
FileOutputStream(File file)
FileOutputStream(File file, boolean append)
FileOutputStream(FileDescriptor fdObj)
FileOutputStream(String name)
FileOutputStream(String name, boolean append)
```
> 如果试图为一个`不存在的文件`创建FileInputStream对象，将会发生`java.io.FileNotFoundException`异常。

> 而对于FileOutputStream而言，如果要写入数据的File对象不存在，则会创建一个新的文件，如果文件存在，**可选**文件是否以追加形式写入。

### 转换流--字节流转换到字符流
注意小标题，它是**单向**的。有没有反向的？
> 计算机都是以二进制来存储文件的。

文本文件在计算机以二进制存着，当然可以直接读，也就是说，**不需要也没必要字符流转换为字节流**。

它们的用处是什么？
为了记忆方便，在上一篇文章中我们说有'-er'的是处理文本文件数据，'Stream'是处理二进制文件数据。**用来将字节数据以某种编码(如UTF-8)转换到字符数据**。
转换流有`InputStreamReader`(继承自**Reader**抽象类)和`OutputStreamWriter`(继承自 **Writer**抽象类)。这两个也是`常见的处理流`。
>- InputStreamReader 需要和 InputStream 抽象类的子类 "套接"(PS:废话~！它处理的对象是"字节数据"，当然套接在它上面啦，而且input与input相对应~。"套接"就意味着要以InputStream的子类实例为构造参数)。
>- 同理可得，OutputStreamWriter 需要和 OutputStream抽象类的子类 "套接".
>- 转换流在构造时可以指定其`编码集合`，若不指定，默认为Unicode编码。

其中带有指定编码参数的`InputStreamReader`对象的构造方法。
```java
InputStreamReader(InputStream in, CharsetDecoder dec)
Creates an InputStreamReader that uses the given charset decoder.
```

### 过滤器数据流--Filter Stream

`FilterInputStream`,`OutputStream`是过滤数据流的基类，它以及其子类都是`处理流`。在上一篇博客中已经介绍过，处理流是在节点流或其他处理流的基础上建立的，相当于一个大水管(处理流)"套接"在了其他小水管上面。需要"套接"在InputStream和OutputStream类型的节点流上。字节流中不是已经有了吗，怎么还需要一个过滤流。`存在即有理`。Filter Stream 是为某种目的过滤字节的数据流。

#### Data Stream

Data Stream 是数据过滤流(`Filter Stream`)的其中一个子类。基本字节注入流提供的读取方法**read()只能用来读取字节**，而没有**Java基本类型以及字符串**--这就需要数据流(`DataInputStream`/`DataOutputStream`)了，它们提供的方法很方便。
试想，如果在读取文件数据的时候，你是不是读取出来之后还要进行基本类型转换？

但Filter Stream的一些子类有提供便捷的方法。存取的时候直接以该类型进行操作。比如: `DataInputStream` 和`DataOutputStream`提供了存取与机器无关的Java原始类型数据(如:int,double等)的方法(readFloat()/writeFloat()等等)，无需转换就可以从内存复制到输出数据流中。

DataOutputStream 将一个输入流的数据过滤成合适的基本类型值或者字符串。而DataOutputStream 将基本类型值或者字符串转换成字节并且输出字节到输出流中。**这么看来，Data Stream 就像在程序和文件间的一个"转换器"**。

##### 谈谈字符编码
Data Stream中还有几组有意思的方法。在这里总结一下，也可以提一下醒。

```java
//读取
readUTF() -- 从UTF格式中读取一个字符串
readLine()--从输入流中读取数据行。但目前官方不推荐使用DataInputStream对象的该方法。可以使用BufferedReader对象的readLine()方法读取文本行。
 BufferedReader d  = new BufferedReader(new InputStreamReader(in));/*来自官方API 文档*/

//输出
writeByte()--向输出流中写出Int类型的低八位字节
writeBytes()---向输出流写入一个字符串中字符的低位字节
writeChar()---向输出流中写入一个字符(由两个字节组成)
writeChars()--向输出流中依次写入一个字符串中的每个字符
writeUTF()---以UTF-8格式写入一个字符串

/*注意不要混淆Java的char,byte 以及C语言中的char
  Java中的char字符型是以统一码(Unicode)编码的，也就是说Java中的char虽说是一个字符，但它是两个字节组成的，而byte是Java中的char类型的低八位，也就是一个字节。至于C语言中的char类型，因为C语言的字符型是以ASCII码进行编码，所以每个字符是8位，一个字节。
  
  所以输出中的writeBytes()，writeChar(),writeChars()以及writeUTF()之间有什么区别和联系？应该在什么情况下使用？ 
  
  writeBytes方法适用于ASCII码组成的字符串，因为ASCII只储存统一码的低八位。
  而对于不是全部由ASCII码组成的字符串(比如含有汉字)，则要使用writeUTF()和writeChars()，都是将两个字节的长度信息写入输出流。但使用UTF编码格式来存储相对更省空间，它是变长的，对于ASCII字符它只会使用1个字节，但如果使用Unicode，则使用了两个字节。所以，如果一个长字符串的大多数字符都是普通的ASCII字符，采用UTF-8格式储存更加高效。
*/
/*注意，读写如果用到UTF,则必须成对出现。也就是说，如果在数据存储的时候，使用了writeUTF()格式写入数据，则读取的时候必须使用readUTF()*/

```
##### 关于UTF-8编码
> UTF-8是一种常用的字符编码，它是变长的，由统一码Unicode改进的编码。它根据字符的大小来使用1个字节，2个字节或者3个字节来存储字符。如果一个字符的编码值小于0X7F(即0111,1111 [逗号只是为了观看直观])，也就是ASCII码，则使用一个字节来存储。如果大于0X7F且小于等于0X7FF，则使用两个字节来存储。如果大于0X7FF则使用3个字节。UTF-8编码字符的起始几位标明这个字符是存储在一个字节两个字节还是三个字节中。如果是前4位是1110，则表明它是由3个字节序列组成的字符中的第1个字节。如果是0.则表明它是由一个字节组成的字符(ASCII)，更多具体的请查阅资料~~

##### 例子
>writeUTF("ABCDEF")写入文件的是8个字节(00 06 41 42 43 44 45 46 )[16进制表示]，其中**前两个字节用来存储字符串中的字符个数**。

[**注意，在Java中，当用UTF-8来存储中文汉字的时候，每个汉字占3个字节，而GBK是两个字节**][3] 可以改动下面的代码看看，将"ABCDEF"改成"ABCDEF测试"，再观察结果，就明了了。

```java
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.EOFException;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class JavaIO {

    public static void main(String[] args) {
        File mFile = new File("D:\\test.txt");
        FileInputStream mFileInputStream;
        DataInputStream in;
        try (FileOutputStream mFileOutputStream = new FileOutputStream(mFile)) {
            DataOutputStream data = new DataOutputStream(mFileOutputStream);
            data.writeUTF("ABCDEF");
            data.close();
            mFileOutputStream.close();
            mFileInputStream = new FileInputStream(mFile);
            in = new DataInputStream(mFileInputStream);
            System.out.println("文件字节数为" + mFile.length());
            System.out.println("readUTF()读取的数据:" + in.readUTF());
            mFileInputStream.close();
            in.close();
            mFileInputStream = new FileInputStream(mFile);
            in = new DataInputStream(mFileInputStream);
            System.out.println("readByte()读出的数据：");
            while (true) {
                System.out.printf("%x ",in.readByte());//16进制
            }
        } catch (EOFException eof) {
            System.out.println("\ndone!");//到达结尾抛出EOF异常，要捕获。
        } catch (IOException ee) {
            ee.printStackTrace();
        }

    }
}

```

#### 缓冲流--Buffered Stream
BufferedInputStream 和 BufferedOutputStream 类可以**减少磁盘读写次数**来提升输入和输出的速度。使用BufferedInputStream时，磁盘上的整块数据一次性地读入到内存中的缓冲区。然后从缓冲区中将**个别数据**传递到程序中。使用BufferedOutputStream时，个别的数据首先写入到内存中的缓冲区中，当缓冲区已满时，缓冲区中的所有数据一次性写入到磁盘中。

**构造方法**
>- 1.BufferedInputStream(InputStream in)
Creates a BufferedInputStream and saves its argument, the input stream in, for later use.
>- 2.BufferedInputStream(InputStream in, int size)
Creates a BufferedInputStream with the specified buffer size, and saves its argument, the input stream in, for later use.

如果不指定缓冲区大小，默认大小为512个字节。不管对于多大的文件，**都应该使用**缓冲区I/O来加速输入输出。
### 对象流 -- Object Stream

对象类可以用来读写可序列化的对象，所谓可序列化对象是指该类实现了可序列化Serializable接口，这样可以将对象直接转换为字节流。

#### 对象流和数据流的关系

- 在前面我们已经知道，DataInputStream 类 和 DataOutputStream类可以实现**基本数据类型与字符串的输入和输出**，但ObjectInputStream 和 ObjectOutputStream 除了**基本数据类型与字符串的输入和输出**外，还可以实现对象的输入和输出。可以看出，ObjectOutputStream 和 ObjectInputStream 包括了 DataInputStream和DataOutStream的所有功能，完全可以使用前两者代替后两者。
- ObjectInputStream 和 DataInputStream 都扩展了InputStream抽象类，前者实现了接口ObjectInput，后者实现了接口DataInput。ObjectInput 接口 是 DataInput接口的子接口，并且多了一个readObject()的抽象方法(ObjectOutputStream 和 DataOutputStream同理)。除了ObjectInput接口外，ObjectInputStream和ObjectOutputStream还实现了接口ObjectStreamConstants，从名字中就可以看出来，该接口包含了ObjectInputStream 和 ObjectOutputStream所使用的**常量**。
- 都要遵循以数据写入文件时的顺序和格式从文件中读取这些数据。

#### serializable关键字

- serializable
"可序列化的"。它是一个接口，一种标记接口，因为没有方法。实现这个接口可以启动Java的序列化机制，自动完成存储对象和数组的过程。在ObjectOutStream中完成将可序列化的对象写入文件，这个过程称为`序列化`。在ObjectInputStream中完成将文件中的可序列化对象读取出来，这个过程称为`反序列化`。
当储存一个可序列化对象时，会对该对象的类进行编码。编码包括类名、类的签名、对象实例变量的值以及该对象引用的任何其他对象的`闭包`，但是**不存储对象静态变量的值**。

-  externailzable 接口
Serializable的子接口，它的作用是让程序员自定义序列化过程。**已经超出本人目前能力之外，不予讨论。**

#### 非序列化的数据域

已经知道，对象的静态变量的值不会存储。如果一个对象是Serializable的实例，但它包含了非序列化的实例数据域，那么就不可以序列化这个对象。一个对象保证能够被序列化，就要**必须保证其数据域都可被序列化**。还有一种方法是`transient`关键字，它的作用是告诉Java虚拟机将对象写入流的时候，**忽略这些数据域**。

#### 重复的对象处理

> **来自《Java语言程序设计(基础篇)》**
> 如果一个对象不止一次写入对象流，会存储对象的多个副本吗？答案是不会。第一次写入一个对象的时候，就**会为它创建一个序列号**。Java虚拟机**将对象的所有内容和序列号一起写入**对象流中。以后每次存储时，如果再写入相同的对象，就只存储序列号。读出这些对象时，它们的引用相同，因为在内存中实际上存储的只是一个对象。

### "标准"输入流

System.in 是"standard" InputStream(标准输入流)，这里的InputStream是父类指向子类引用对象(`多态性`)，其实**System.in是BufferedStream的一个实例**。也就是InputStream的一个子类。可以把它看成获取键盘的输入。
```java
public class JavaIO {

    public static void main(String[] args) {
        System.out.println(System.in.getClass().getName());
    }
}
```
> 运行结果：
> java.io.BufferedInputStream

**为什么是BufferedInputStream**?在我迷惑的时候，去翻过Java API文档，但找不到答案。最终还是在`StackOverFlow`上找到了答案。其实"答案"在Java源码中可以看得到。

用`NetBeans`或者其它IDE，ctrl+点击"in"进入'System.java'，当然其他方式也可以。

> 83. public final static InputStream in = null;

> 257. private static native void setIn0(InputStream in);

> 1188. FileInputStream fdIn = new FileInputStream(FileDescriptor.in);

> 1191. setIn0(new BufferedInputStream(fdIn));//就是在这里

### print流
PrintWriter 和 PrintStream都属于输出流，分别针对字符和字节。
两者都提供了重装的print
PrintWriter和PrintStream的输出操作不会抛出异常，用户通过检测错误状态获取错误信息。(方便)？什么来的
PrintWriter和PrintStream有自动flush的功能。

PrintfWriter的构造方法有点特殊。它可以有Writer的子类或者OutputStreamd的子类作为构造参数。所以它也是一种处理流。

**注意**:System.out是PrintfStream类型。System.in是InputStream类型。System.out.print()默认的输出是DOS窗口(标准输出)，但如果在方法中使用了System.setOut(PrintfStream)，会将默认的输出改变成设置的PrintStream目标，而不再是DOS窗口(屏幕)。**屏幕也是一种'文件'**

例子
```java
//用print流实现将test.txt文件中的字符串打印到new.txt中
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.Scanner;

public class JavaIO {

    public static void main(String[] args) {
        File mFile = new File("D:\\test.txt");
        File mNewFile = new File("D:\\new.txt");
        Scanner in;
        try {
            PrintStream mOut = new PrintStream(mNewFile);
            in = new Scanner(mFile,"UTF-8");
            while (in.hasNext()) {
                System.out.print(in.nextLine());
            }
            in.close();
            in = new Scanner(mFile,"UTF-8");
            System.setOut(mOut);
             while (in.hasNext()) {
                System.out.println(in.nextLine());
                 System.out.println("这句话也会在new.txt文件中");
            }
             in.close();
        }
        catch (FileNotFoundException ex) {
            System.out.println("找不到文件");
        } 

    }
}
```
## try-with-resources

### 两种方式
这个是什么东西？其实，使用它来声明和创建输入输出流，从而在使用后可以自动关闭。
我们都知道，Java I/O操作都会抛出异常，需要我们进行关闭。而我们也知道，在操作完流之后，需要使用close()方法将它关闭。不关闭`流`可能会在输出文件中造成数据受损，或者导致其他的程序出错。但除了这种方法之外，还有一种简洁的方法。就是`try-with-resources`。

### 代码实例

```java
// 方法一
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
                System.out.print(Arrays.toString(value));
            }
            mFileReader.close();//读写结束后需要关闭
        } catch (Exception ee) {
            ee.printStackTrace();
        }
    }
}
```
```java
//方法2 try-with-resources

public class JavaIO {
    public static void main(String[] args) {   
        File mFile = new File("D:\\test.txt");
        try(FileReader mFileReader=new FileReader(mFile)) {         
            char[] value = new char[2];            
            System.out.println("我是节点流对象mFileReader读取的数据");
            //一个字符一个字符地读取，当read()返回值为-1时，读取结束
            while (mFileReader.read(value, 0, 1) != -1) {
                System.out.print(Arrays.toString(value));
            }
            mFileReader.close();//读写结束后需要关闭
        } catch (Exception ee) {
            ee.printStackTrace();
        }
    }
}
```
### 原理解说
> **来自《Java语言程序设计(基础篇)》**
程序使用了`try-with-resources` 来声明和创建输入输出流，从而在使用后可以自动关闭。java.io.InputStream和java.io.OutputStream实现了`AutoClosable接口`。该接口定义了close()方法，用来关闭资源，任何AutoClousable类型的对象都可以用于try-with-resources语法中，实现其自动关闭。

其实实现该接口的还有Scanner,Reader,Writer。目前接触涉及I/O的类都有close()方法，都有实现AutoClosable接口。


## 吐吐槽

花了3天的时间来写关于I/O的，那感觉，满脑子都是'流'啊，'Scanner'等等的概念。估计要疯了。。。因为实在是太多了，整理的过程中总要想着如何排版更加合理，怎么说才能尽可能地述说完整。。。加上自己是菜鸟，总怕说错，不断地查文档和搜索，结果下来，发现还有很多琐碎的关于I/O的知识点等着T^T，还是加油吧~~！其实有很多类我们只需要了解就好，常见的I/O操作也就Scanner，Object Stream，Data Stream，File Stream，Buffered Stream.那为什么要将其他的像print流。
> 因为它在那里。


(**PS：这篇文章那么长，难免会出错。如果哪里有错还望指出，记得轻拍**。)


  [1]: http://garcin-lam.github.io/2015/12/27/%E7%90%86%E6%B8%85Java%E7%9A%84IO-1/
  [2]: http://7xobsp.com1.z0.glb.clouddn.com/javaio%E5%AD%A6%E4%B9%A0%E6%80%BB%E7%BB%93%20-%20-%20ITeye%E6%8A%80%E6%9C%AF%E7%BD%91%E7%AB%99.jpg
  [3]: http://www.iteye.com/topic/47740