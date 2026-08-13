---
title: ImageJ实用技巧：快速掌握为图像添加比例尺的方法！
slug: Fiji_12
description: 还在 PPT 手动画比例尺？ImageJ 一键给显微图片加标尺，单位精准不翻车，再也不怕审稿人指出标尺错误。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - Fiji
date: 2024-03-21
draft: false
---
在科研研究中，不论是做汇报还是论文发表，为了正确的呈现图像，包含比例尺都是至关重要的。在图像中添加比例尺，以便读者看到所呈现图像的比例，以获得准确的结论。本期内容小编将向大家介绍如何**利用ImageJ软件轻松为科研图像添加比例尺**，让你的研究工作更加精确和可靠！

## ▌校准图像--已知像素大小

**在Image J中，默认使用的长度单位是像素，即Pixel；** 我们需要对其进行校准，即使用通用的长度单位μm，mm等。这里小编所说的“已知像素大小”就是指已知像素长度和通用长度的比例。

首先导入一张图片至Image J（Fiji）中；
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwqr4A3MfDMO75vrnSKdj8tzagByic1FjqiaJFdCNdym1dliccwprmmKsmmg/640?wx_fmt=png&from=appmsg)
在图像的左上角会显示**图像的尺寸、位深度**和**文件大小**。在本例中图像的尺寸为**1360x1024像素**，我们需要将其校准，长度单位**转换为μm**。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwqHsjG9mjngmo8aqNTK25Dp29DWKz9Mlt4xjIRr3NWud2QQohc20thHw/640?wx_fmt=png&from=appmsg)
点击“==Image -> Properties==”，输入单位像素对应的比例尺单位的大小，本例中一个像素对应0.6μm，就如下输入，然后点击“==OK==”。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwq5yfz4pJyy7NjiaPxAyVJknoYDUVtTdIOxh1FgQ3jTdLSVKmIP2C7UIg/640?wx_fmt=png&from=appmsg)
现在可以发现图像已经被校准，显示为816.0x614.4μm，长度单位改为了我们常用的“μm”。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwqH57ibticGW0P44JCkN6dDXB3bN9TPkJ2ZtSdTBRsUP7dtm8dnEpiazgSQ/640?wx_fmt=png&from=appmsg)
需要注意的是在图像属性窗口，如果需要将属性应用于所有打开的图像直到关闭软件，可以将“==Global==”选项勾选。

## ▌校准图像--未知像素大小

如果像素大小未知，我们就需要一张已有比例尺的图像或其它已知长度的参考图像，可以用它来计算像素大小。

如下图已有一个100μm的比例尺，我们可以**使用直线工具沿着比例尺进行划线**，注意按住“==Shift==”键可保持直线，结果更准确。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwqdr6nUfSCGZxOicWoCX2NwlhUu6FmO7senpTqqWlmaHyUwynhb9dZQicw/640?wx_fmt=png&from=appmsg)
然后点击“==Analyze -> Set Scale…==”，其中“<font color="#d83931">Distance in pixels</font>”指的就是刚刚划的直线的长度；这里在“<font color="#d83931">Known distance</font>”输入已知的距离，本例中比例尺是100μm，所以就输出“==100==”；在“<font color="#d83931">Unit of length</font>”输入长度单位，本例中为“==μm==”；然后点击“==OK==”即可。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwqiaJibfunkJkNvNcyAKGjt5xMb7IklmccmEvAdUiaRv345aMwO8AgEric5w/640?wx_fmt=png&from=appmsg)
同样的可以勾选“==Global==”设置全局应用该设置。现在图像就校准好了，可以添加比例尺啦。

## ▌添加比例尺

导入图像后，点击“==Analyse -> Tools -> Scale Bar==”，在打开的对话框中输出比例尺的详细信息。本例中设置了一个6像素粗细（Thickness in pixels）100μm（Width in μm）的比例尺，字体的大小为14（Font size），并加粗（Bold Text）。

还可以选择添加一个垂直的比例尺，本例中为50μm（Height in μm），注意勾选“==Vertical==”。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwqemC7cKUQQcRAcuwjHibaEBFWlia5BTOIpfBMYWtsI1hphoUeIVOVMBxA/640?wx_fmt=png&from=appmsg)
大家可根据自己的需要进行设置，下图为本例添加完成的比例尺，之后进行图像保存即可。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzYycyicK3JdMpR8IPYM6cwqD3ex1sb2hFMEfsa40os9P2o3ibiaVJdbgO8Ejc21D3lkfjNX7ZYj7u7w/640?wx_fmt=png&from=appmsg)
如果不喜欢比例尺默认的位置，可以在图像上画一条ROI线，然后在“==Location==”的下拉菜单中选择“==At Selection==”即可。