title: 理清Java异常(2)
toc: true
date: 2015-12-26 13:20:29
categories: [编执狂, Java]
tags: [马士兵, Java, 异常处理]
---
当一个语句在代码运行的时候可能会出错时(不可避免的错误，不为程序员在编写代码时可控制，比如文件不存在等)，我们应该如何处理？上一回讲到了[异常的概念和分类][1]，那我们来深入了解一下**异常的处理**。

## 异常的处理

在《理清Java异常(1)》中，我们简单地说了Java必检异常的处理方式。**主要有两种处理(但解决异常的方法主要有一种，就是try-catch)**。怎么知道是必检异常？查看Java API文档中类的继承，除了Error和RunTimeException及它们子类，其他Exception类就是必检异常。

>- 声明和抛出异常
>- try-catch块捕获异常

注意，还要区别"处理"这个词的上下文或者说意境。其实说**两种处理方式并不怎么准确，它可能会混淆视听**。(PS：好吧，当我咬文嚼字吧-.-!!)

> 当方法B调用会抛出异常的方法C，C出错抛出异常时，方法B使用try-catch捕获到异常，它有**两种处理手段**，可以选择在catch语句块中**继续抛出(throw)异常**(补充:'继续抛出'也可以不使用try-catch，直接声明异常即可)，让B的调用方法A用try-catch**解决异常**，也可以在方法B的catch语句块中**解决异常**。

简而言之，异常只需要"解决"一次，当一个异常对象被捕获并被解决时，它会"消失"。但一个异常对象可以有两种"处理手段"，**1.继续抛出**，**2.解决异常**。
<!--more-->
以上"咬文嚼字"的过程涉及三个操作--1.声明异常，2.抛出异常，3.捕获异常。
#### 代码实例
``` java 
    import java.io.IOException;//引入需要的包
    import java.io.File;
    import java.io.FileInputStream;
     public void A() {
         try{
            B();
        }catch(IOException e){
            // B选择的处理方法是抛出给A方法处理，A
             System.out.println(e);
        }
    }
    
        
    public void B() throws IOException/*声明IO异常,关键字throws*/{
        try{
        
            File mFile = new File("myFile.dat");
            FileInputStream input = new FileInputStream(mFile);
            //方法C
            //IO其他操作
            input.close();
        }
        catch(IOException e){
            //1.继续抛出,关键字throw
            //如果该方法无法解决该异常，或者只是简单地希望它的
            //用者(方法A)注意到该异常，可以抛出异常让A解决
            throw e;
            //2.解决异常,这里选择直接打印
            //System.out.println("出错+"e);
        }
    }
    
```


### 声明和抛出异常

#### 声明异常(关键字:throws)
每个方法都必须声明它可能抛出的**必检异常的类型**。这样，方法的调用者会被告知有异常抛出，必须处理(注意是'处理'哦，不是'解决')。**这也是为什么在使用某些对象的方法时，IDE会报错，一定要你处理抛出的异常**。

#### 抛出异常(关键字:throw)
检测到错误的程序可以创建一个合适的异常类型对象，并把它抛出，这就称为抛出异常。(一般使用if语句判断，对于无法处理的就抛出异常。**问题1？在文末讲**)

注意是抛出对象，所以使用 `throw new IllegalArgumentException("*")` 抛出异常对象。Java API 中有一些方法已经throw 异常，则不需要我们在自己的调用方法中**手动抛出**，但是，如果在一个声明了throws 异常的方法中，没有调用到有throw异常的方法，必须要手动抛出异常，即**实例化一个异常对象并抛出**。否则，在方法头声明异常的方法会报错。

一般来说，Java API中的每个异常类至少有两个构造方法 : 一个无参构造方法和一个带可描述这个异常的String参数的构造方法，该参数也称为 _异常信息_ 。

>异常信息可以使用异常对象的 `getMessage()` 获取。【见代码部分】

#### 捕获异常(关键字:try,catch,finally)
使用try语句块包含可能出错的方法，使用catch语句块捕获可能出现的异常。只有catch语句块中的异常对象相匹配，才会执行catch语句块中的语句。 

注意:catch异常对象只需声明引用，如Exception e;这样我们就可以直接使用了。那对象的初始化呢？异常在Java运行时系统抛出异常对象时已帮我们自动初始化对象，即'new Exception()'。

**_finally_ 关键字**

无论异常是否产生或者是否被捕获，finally子句总是会执行。finally 语句为异常处理提供了一个统一的出口，使得在控制流程转到程序的其他部分之前，**能对程序的状态作统一的管理**

通常在finally语句中可以进行资源的清除工作，如：
- 关闭打开的文件
- 删除临时文件
- ......

> 关于try-catch-finally 捕获异常的执行过程详见 [捕获异常的执行过程][2]

#### 代码
```java
public class Exc {

    //构造方法
     Exc() {
        setRadius(1);
    }

    Exc(double r) {
        setRadius(r);
    }
    
    public static void main(String[] args) {
        try{
            Exc circle = new Exc(5.0);
            Exc circle2 = new Exc(-5.0);
        }
        catch(IllegalArgumentException e){
            System.out.println("构造函数的参数为:"+e.getMessage());
            System.out.println(e);
        }
    }
    public void setRadius(double r) throws IllegalArgumentException {
        if (r >= 0)    System.out.println("正常");
        else throw new IllegalArgumentException("出错！半径小于0");
    }
}


```
运行结果如下：
> 正常
构造函数的参数为:出错！半径小于0
java.lang.IllegalArgumentException: 出错！半径小于0

### 何时使用异常

上面在讲抛出异常的时候遗留了一个问题。相信有一部分人在看到**使用if语句判断然后抛出异常**，都会认为，既然可以判断了，为什么不直接将异常解决，还要抛出给调用方法呢？(答案在第三点)这其实也是我在第一次在Java课堂上接触了**异常处理**时候的一个疑惑。但在书中找到了答案(所以说，书还是要看，不能卷起袖管就开撸代码~)，[书中][3]讲得很清楚，而且还包括了很多要点。在理解的基础上整理的要点如下。

>1. 异常出现在方法中，如果想让该方法的调用者**解决**异常，应该创建一个异常对象并将其抛出。如果能在发生异常的方法**解决**异常，那么就不需要抛出或使用异常了。(这已经在上面的"咬文嚼字"详细地说明)
>2. 一般来说，一个项目中多个类都会发生的**共同异常**应该考虑作为一种异常。
>3.  **什么时候应该抛出异常？** 当错误需要被方法的调用者**处理**(不一定是'解决')的时候，方法应该抛出异常。为什么？以上面设置圆的半径为例，在用户输入圆的半径的时候，构造方法调用setRaidus()方法。假设某个调皮捣蛋的用户，或者说是闲着蛋疼没事干的用户，输入了小于0的数字，setRadius()方法会出现错误，因为半径不可以小于0。当然可以在setRadius()方法中处理，处理的方法有很多种，比如说1.if语句判断，然后打印出错提示信息。2.try-catch语句解决异常。
当然可以这么解决。但如果构造方法中，紧紧跟着调用依赖于setRadius()的其它方法，那构造方法会接二连三地出错。为什么？因为被调用方法setRadius()在**构造方法**不知情的情况下中断了程序的正常运行。所以，setRadius()要做的事是，**判断传入的参数是否符合要求，如果不符合，应该使用抛出异常告知调用方法，即构造方法，让构造方法去处理--继续抛出或者解决**。**当然，如果构造方法Exc()无法解决(同上所说)，就要继续抛出异常让main方法继续处理**
>4. **什么时候使用try-catch**？当处理不可意料的错误状况时应该使用。(尤其在网络环境的文件读写中，会出现断网，网络拒绝请求，请求文件不存在等不可预料的事件，这是程序员无法控制的)。**不要用try-catch块处理简单的，可预料的情况**。

如何理解要点的第四点呢？
``` java
    //伪代码
    if(setRadius() throws IllegalArgumentException)
        return null;
    
```
**假设第3点中，setRadius()抛出的异常可以在Exc()内部自己处理，不需要抛出异常给main方法**，那这一段代码不需要try-catch，因为太简单了，可以预料。那执意要使用try-catch呢？虽然说try-catch使得错误处理的代码和正常的代码分离，更易懂。但是
> 由于异常处理需要初始化新的异常对象，需要从调用栈返回，而且还需要沿着方法调用链来传播异常以便找到它的**异常处理器**，这个过程需要更多的内存和时间。

### 异常的其他知识点

#### 异常方法的继承和重写
> **重写方法需要声明的异常和原方法声明的异常类型一致或不抛出**。当一个类内的某方法没有声明异常时，不能在其子类的该方法重写声明异常。

#### 链式异常的产生和抛出
> 和其他异常一起抛出一个异常，构成链式异常

有时候我们需要在新异常的基础上，对原始异常进行信息附加，这样就可以产生一个 _链式异常_

#### 链式异常的代码示例
``` java
    public class Exc {
    public static void main(String[] args) {
        try{
            method1();
        }catch(Exception ee){
            ee.printStackTrace();
        }
    }
   public static void method1() throws Exception{
       try{
           method2();
       } catch(Exception e){
           // 利用构造方法:Exception(String message, Throwable cause)
           throw new Exception("info from method",e);
       }
    }
   public static void method2() throws Exception{
       throw new Exception("info from method2");
   }
}

```
运行结果(行数和包名不一定一样)：
> java.lang.Exception: info from method
	at exc.Exc.method1(Exc.java:21)
	at exc.Exc.main(Exc.java:11)
Caused by: java.lang.Exception: info from method2
	at exc.Exc.method2(Exc.java:25)
	at exc.Exc.method1(Exc.java:18)
	... 1 more

从程序代码中可以看到，链式的异常主要是利用Excepion的构造方法，将导致的原因"Caused by..."作为参数传入，然后附加成新的异常再抛出。

```java
 ee.printStackTrace();
```
这段代码用来打印堆栈信息。可以查看错误的抛出时的"路径"，经过哪些方法，抛出错误的源头在哪里。这个方法对于编写程序员调试出现异常的程序十分有用。与Java运行时系统自身抛出的异常信息十分相似。

---

### 总结

> 一个方法内部调用有抛出异常的方法时，或手动抛出异常时，必须做出处理。处理的方式有两种:1.继续向调用方法抛出异常 2.捕获异常并解决

> main方法也可以不捕获并解决异常，直接抛出。这时是抛给Java运行时系统，异常信息会被打印并终止程序的运行。也就是我们一般见到的情况。
 
![图片来自网络,侵删][4]


  [1]: http://garcin-lam.github.io/2015/12/26/%E7%90%86%E6%B8%85Java%E5%BC%82%E5%B8%B8-1/
  [2]: http://garcin-lam.github.io/2015/12/26/%E7%90%86%E6%B8%85Java%E5%BC%82%E5%B8%B8-3/
  [3]: http://book.douban.com/subject/6529833/
  [4]: http://7xobsp.com1.z0.glb.clouddn.com/%E5%88%9B%E6%84%8F%20-%20Google%20%E6%90%9C%E7%B4%A2%281%29.jpg