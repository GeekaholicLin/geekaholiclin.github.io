---
title: Java基础之线程
toc: true
date: 2016-02-09 14:56:28
categories: [编执狂, Java]
tags: [Java, 线程, InterruptedException, 异常]
---


## 线程的基本概念

线程是一个程序内部的顺序控制流。

### 线程与进程的区别

每个进程都有独立的代码和数据空间(进程上下文)，进程间的切换会有较大的开销，线程可以看成是轻量级的进程，**同一类线程共享代码和数据空间**，一个进程的内存空间是共享的，每个线程都可以使用这些共享内存。每个线程都有独立的运行栈和程序计时器，线程切换的开销小。

> 多进程: 在操作系统中能同时运行多个任务(程序)
> 多线程: 在同一应用程序中有多个顺序流同时执行。

进程和线程的关系初步可以理解成：进程是加载到内存里的程序，而一个进程至少拥有一个线程(Java中的Main()方法)，当然可以使用代码进行开启多线程。

<!--more-->

### Java中线程的知识点

> JAVA的线程是通过java,lang.Thread类来实现的。
> 在Java中可以通过创建Thread的实例来创建新的线程。
> 每个线程都是通过某个特定Thread对象所对应的方法run()来完成其操作的，方法run()称为线程体。
> 通过调用Thread类的start()方法来启动一个线程。

**run()方法是执行的代码，而start()方法是开启线程，注意两者的区别**。

## Java中的线程

在Java中可以有两种方式创建新的线程。

### Java中线程的创建方法

> 1. 第一种
>   * 定义线程类A实现Runnable接口
>   * 实例化Runnable线程类A的对象B
>   * 实例化Thread对象: Thread mThread = new Thread(B);
>   * 实现Runnable接口中的线程运行体，也就是run()方法
>   * 使用Runnable接口的类可以为多个线程提供共享的数据。
>   * 在实现Runnable接口的类的run方法定义中可以使用Thread的静态方法。比如currntThread()方法，该方法可以获取当前线程的引用。

> 2. 第二种
>   * 可以定义一个Thread的子类并重写run()方法
>   * 实例化Thread对象。

### 代码示例

**方法1**

```java
public class MyThread{
    public static void main(String[] args) {
        MyRunnableClass mrc = new MyRunnableClass();
        Thread mThread = new Thread(mrc);//实际是多态的运用
        mThread.start();//开启线程
        for (int i = 0; i < 50; i++) {
            System.out.println("这是主线程中第"+(i+1)+"行");
        }
    }
}

 class MyRunnableClass implements Runnable {

    @Override
    public void run() {
        System.out.println("=====开启子线程======");
        for (int i = 0; i < 50; i++) {
                   System.out.println("这是子线程中第"+(i+1)+"行");
        }
    }

}

```

运行结果
```java
//不贴出来了，两者是同时两个线程一起执行，而不是先等run()方法执行完成之后
//再执行main()中其他语句。因为线程的开启时间有快有慢，以及两个线程分得的
//时间片不一样，所以每次运行的结果有可能有区别。
//但当把 mThread.start(); 替换成 mThread.run(); 时，
//此时实际上是main()方法对run()方法进行调用，而不是开启线程执行run()方法
```

**方法二**

与上面方法一类似，只需要适当修改一下。
```java

public class MyThread{
    public static void main(String[] args) {

        MyRunnableClass mThread = new MyRunnableClass();
        mThread.start();//开启线程
        for (int i = 0; i < 50; i++) {
            System.out.println("这是主线程中第"+(i+1)+"行");
        }
    }
}

 class MyRunnableClass extends Thread {

    @Override
    public void run() {
        System.out.println("=====开启子线程======");
        for (int i = 0; i < 50; i++) {
                   System.out.println("这是子线程中第"+(i+1)+"行");
        }
    }

}
```

在两个方法中，推荐使用实现接口的方法，即方法一。原因是**可以实现多个接口**但继承只能是单继承，不利于该类的扩展。

### Java中线程的状态

![Java线程的状态转换图][1]

从图中可以看出，Java中线程大致有5中状态，在Java的API中也提供了操作Java线程的方法。让我们先睹为快。

> isAlive() 判断线程是否还未被终止。
> getPriority() 获得线程的优先级数值
> setPriority() 设置线程的优先级
> Thread.sleep() 静态方法，将当前的线程指定毫秒数进行睡眠。会抛出interruptedException异常。
> join() 调用某线程的该方法，将当前线程与该线程"合并"，即等待该线程结束，再恢复当前线程的运行。
> yield() 让出cpu，当前线程进入就绪队列等待调度。
> wait() 当前线程进入对象的wait pool
> notify()/notifyAll() 唤醒对象的wait pool中的一个/所有等待线程

让我们使用sleep()方法实现子线程每隔1s打印出当前的时间。偷一下懒，还是使用该类，不新建其他类了。sleep()方法会抛出`InterruptedException`异常，我们需要进行捕获，关于异常的知识点在之前的博客中已经详细地讲解过了，这里不再叙述。

#### sleep()&&interrupt()
```java
public class MyThread {

    public static void main(String[] args) {

        MyRunnableClass mThread = new MyRunnableClass();
        mThread.start();//开启线程

    }
}

class MyRunnableClass extends Thread {

    @Override
    public void run() {
        try {
            while (true) {
                System.out.println("当前时间" + new Date());
                Thread.sleep(1000);
                interrupt();//粗鲁地调用方法打断当前的线程，只为演示效果
            }
        } catch (InterruptedException ex) {
            System.out.println("别打断我睡觉~！");
        }
    }
}
```

运行的结果为：

```java
当前时间Tue Feb 09 16:31:03 CST 2016
当前时间Tue Feb 09 16:31:04 CST 2016
别打断我睡觉~！
```

#### sleep()与interrupt()的解惑
**注意此处打印了两次！哎哎哎，为什么呀？不是应该只打印一次吗？那究竟interrupt()是何时作用的呢？InterruptedException是什么时候抛出的**？让我们先看下面的修改版代码。


#### sleep()代码示例
```java
public class MyThread {

    public static void main(String[] args) {

        MyRunnableClass mThread = new MyRunnableClass();
        mThread.start();//开启线程

    }
}

class MyRunnableClass extends Thread {

    @Override
    public void run() {
        int i = 0;
        try {
            while (true) {
                i++;
                System.out.println("当前时间" + new Date());
                System.out.println("第" + i + "次睡前");
                System.out.println("该线程的状态是否中断？" + isInterrupted());
                Thread.sleep(1000);
                System.out.println("第" + i + "次睡后");
                System.out.println("该线程的状态是否中断？" + isInterrupted());
                interrupt();//调用方法打断当前的线程
                System.out.println("该线程的状态是否中断？" + isInterrupted());
            }
        } catch (InterruptedException ex) {
            System.out.println("异常获取到"+ex);
            System.out.println("别打断我睡觉~！");
            System.out.println("该线程的状态是否中断？" + isInterrupted());
        }
    }
}

```

对原来的代码进行微小的修改，运行结果如下：

```java
当前时间Tue Feb 09 17:38:34 CST 2016
第1次睡前
该线程的状态是否中断？false
第1次睡后
该线程的状态是否中断？false
该线程的状态是否中断？true
当前时间Tue Feb 09 17:38:35 CST 2016
第2次睡前
该线程的状态是否中断？true
异常获取到java.lang.InterruptedException: sleep interrupted
别打断我睡觉~！
该线程的状态是否中断？false
```
从结果可以看到，当我们开启线程的时候，先执行打印当前时间，在之后便进入第一次睡眠(sleep)，此时的线程状态并未被打断(此时尚未执行`this.interrupt();`)(`isInterrupted()`是用来判断线程的中断状态)，当执行完`this.interrupt();`之后，线程的状态已经变成**中断标志**，但**并非退出运行**，**它只是一种标识，程序还会继续执行**。sleep完成之后由于是while(true)死循环，所以继续执行run()方法体的代码，再次打印时间，但当sleep()方法再次调用的时候，它抛出异常了`InterruptedException`异常，并且中断状态清除。WHY?

我在遇到这个问题的时候，也Google和百度过，但可能关键字的问题，愣是没找出来。

还是回归官网的文档吧~在IDE中双击sleep()方法，找到它的文档(已经在NetBeans中配置好文档的显示)

![IDE截图][2]

> InterruptedException - if any thread has interrupted the current thread. The interrupted status of the current thread is cleared when this exception is thrown

这下全都明白了吧~~

> 如果该线程被任何的线程所阻塞(在文档中还说明线程可被自身阻塞)，则该线程的阻塞状态会清除并抛出InterruptedException异常。

小结一下：interrupt()可以阻塞线程自己本身，但它不是真正意义上中断该线程，只是打上**中断标志**，线程还会执行。当sleep()遇到interrupted为true的线程时，会清除状态为false，并抛出`interruptedException`异常。

**当run()方法执行结束之后，该线程也为终止状态**。上面的程序修改，可以使用一个布尔型值变量来控制while循环，而不是简单粗暴的**中断加异常处理**。


#### join()&&yield()

join()方法用来合并线程，相当于方法调用，等到子线程中的run()执行结束之后，main()方法中的其余部分才会继续执行。

，yiled是"退让"的意思。yield()方法让出CPU，给其他线程执行的机会。
#### join()代码示例
```java
public class MyThread {

    public static void main(String[] args) {

        MyRunnableClass mThread1 = new MyRunnableClass("张三");
         MyRunnableClass mThread2 = new MyRunnableClass("李四");
         mThread1.start();
        mThread2.start();//开启线程
    }
}

class MyRunnableClass extends Thread {
    MyRunnableClass(){

    }
    //通过super(String)为线程起名,可以使用getName()获取名字
    MyRunnableClass(String name){
        super(name);
    }
    @Override
    public void run() {
        for (int i = 1; i <= 50; i++) {
            try {
                sleep(1000);
                System.out.println(getName()+"拍"+i);
                if(getName().equals("张三")&&i%5==0){
                    System.out.println(getName()+"说:每拍5次我让你一下");
                    yield();
                }
            } catch (InterruptedException ex) {
                System.out.println(ex);
            }


        }
    }
}

```

运行结果过长，就不贴了，该代码是两人每隔1s就拍一次，每5s，张三调用了yield()方法。

### 线程的优先级

Java提供一个线程调度器来监控程序中启动后进入就绪状态的所有线程，线程调度器按照线程的优先级决定应调度哪个线程来执行。

线程的优先级用数字来表示，范围从1~10，一个线程的缺省优先级是5.

> 三个优先级常量。

```java
/**
     * The minimum priority that a thread can have.
     */
    public final static int MIN_PRIORITY = 1;

   /**
     * The default priority that is assigned to a thread.
     */
    public final static int NORM_PRIORITY = 5;

    /**
     * The maximum priority that a thread can have.
     */
    public final static int MAX_PRIORITY = 10;
```
优先级越高，得到CPU调度的时间片越多。



  [1]: http://old-image.geekaholic.cn/2016-02-09_00001.jpg
  [2]: http://old-image.geekaholic.cn/2016-02-09_00003.jpg
