---
title: Image J进行荧光共定位的定量分析--强度分布曲线
slug: Fiji_9
description: 只算 Pearson 系数还不够！用 Fiji 强度分布曲线直观展示两种荧光信号的共定位重合情况，为共定位结果增加可视化证据。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - Fiji
date: 2024-03-15
draft: false
---
**荧光共定位**是一种技术，通过不同波长的荧光染料标记细胞内的不同成分，然后观察这些成分在空间上是否重叠或相邻。这项技术对于研究蛋白质间的相互作用及其在细胞内的分布非常有价值。  
  
**Line Intensity Profile，也称为强度分布曲线，** 是通过沿着图像上特定直线路径（用户自定义）收集的强度信息。换句话说，就是**在图像的一个切线上测量并绘制该线上各点的亮度值**。这通常用于对比荧光标记物的局部强度，以确定它们在空间上是否有共定位趋势。
![[Pasted image 20251119171058.png]]  
例如，假设你有一个细胞样本，用两种不同颜色的荧光染料分别标记了两种蛋白质。你可以选择一条穿过感兴趣区域的线，然后用**Line Intensity Profile**来描绘沿这条直线的荧光强度。如果这两种不同色彩的强度分布曲线在图表上显现出**高度重叠**，那么可以推断这两种蛋白在那个局部区域有**较高的共定位程度**。
![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSG133jXH24NQbp4CxxUHsiaD68j1clgXia3VialvVd54RvBpJZ82ZhT4KjQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1)
本期内容小编就为大家分享**如何在Fiji (ImageJ)中快速绘制出文献中常见的荧光共定位图像中的Line Intensity Profile**。

将需要分析的图像导入至ImageJ中，本例中为两张荧光图像，分别为红色和绿色通道荧光图像；  
![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSG4UeiaC3HqiasRUSNGibQz83rIs3E6nbNPn8kNUenhoavBl8dnnec1aEkw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2)
使用直线工具在图像需要分析的部分画一条ROI直线；  
![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGHXZ4gFRCAq0ic2Iic7hWLib7CMdFwFw2H7uqWHqrCPrFavcOC8shB4Kmg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3)
点击“<font color="#de7802">Analyze -> Plot Profile</font>”即可绘制强度分布曲线；
![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGtaeTWHKHdLdCq2HhicxgianTtRsvw1TfU3LVibDGfyueibSvWjiczrKlsmg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=4)
这里对应的是绿色荧光图像，因此我们将曲线的颜色更改为绿色。在图像下方的工具栏点击“<font color="#de7802">More -> Contents Style</font>”，在打开的窗口中更改“<font color="#de7802">Color</font>”为“<font color="#de7802">green</font>”；
![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGB468rfytRDWklQzHqbhlwANgMUqzKzIEKr9VnZKPz9lHTkgtEzUAfA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=5)
接下来，对红色荧光图像也进行分析，可以使用"<font color="#de7802">ROI Manager</font>"控制在两张图像同样的位置绘制直线。  

绘制完成后，在图像下方的工具栏点击“<font color="#de7802">Data -> Add from Plot</font>”将红色荧光的曲线添加至第一张图像中并修改颜色为红色；  
![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGFKCZHQ1OEtnCaTItaQgoW2LWtjVzIYIf4cibb94uFJ2ZbAheo5t8ibrQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=6)
根据绘图需要可以对图像进行细节上的修改，点击“<font color="#de7802">More -> High-Resolution Plot</font>”生成清晰的图像，之后进行保存即可。  
![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGk7Zn21HTmlMsbuiaGhvR9LWY5Usu0mebTtWhTNuFZ6iaoT9hyVM5SbFA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7)
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/kaukJDVZNXwPTuL2quguH2DfU4WQbjSG8febYtDwBDia8eMEKVq9AWLkj7jSiczezG9ulnrj93YYHCgoUEGC9kMg/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=8)