---
title: Genymotion模拟器无法启动解决办法
toc: false
date: 2016-03-18 20:44:36
categories: [编程之外, 解决方法]
tags: [解决方法, Genymotion, Android, VisualBox]
---

Genymotion模拟器可谓是Android开发者最常用的模拟器之一，拥有启动速度快，有Android Studio IDE 的插件。但有时候启动Genymotion模拟器的时候会遇到错误。

不同的错误有不同的解决方法。不保证可以解决相同类型的错误，因为同种类型错误可以由多种不同的原因造成。但是如果遇到无法启动时，以下方法值得一试~

大概情况是，在启动Genymotion模拟器的时候，会发生错误。错误如下图所示：

![错误情况][1]

解决无法打开GM的办法之一如下。来自`stackoverflow`，原链接没有保存到(T-T)只保留住其中一个答案，以便笔记

> I have a same problem and I solve it with this :

    Open Windows Network Connections
    Right click on VirtualBox Host only adapter that created
    Choose properties
    Check "VirtualBox NDIS6 Bridged Networking driver"
    disable and Enable the adapter
    
在`网络和共享中心`中找到VisualBox的适配器。
![步骤1][2]    

**右键**，然后**属性**。

![步骤2][3]

勾上图中的选项，并且点击**确定**按钮退出。

再次启动Genymotion模拟器即可，完美解决。

![模拟器界面][4]
  


  [1]: http://7xobsp.com1.z0.glb.clouddn.com/2016-03-18_00003.jpg
  [2]: http://7xobsp.com1.z0.glb.clouddn.com/jm.jpg
  [3]: http://7xobsp.com1.z0.glb.clouddn.com/2016-03-18_00002.jpg
  [4]: http://7xobsp.com1.z0.glb.clouddn.com/2016-03-18_00004.jpg