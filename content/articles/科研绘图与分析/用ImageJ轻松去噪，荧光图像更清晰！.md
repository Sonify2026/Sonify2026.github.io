---
title: 用ImageJ轻松去噪，荧光图像更清晰！
slug: Fiji_10
description: 荧光图片背景噪点多、颗粒感重？ImageJ 降噪方法实操，降低杂讯，同时守住 SCI 图片处理红线，不破坏真实信号。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - Fiji
date: 2024-01-23
draft: false
---
荧光显微镜的限制之一就是系统固有的噪点，这往往成为影响图像质量和获取真实信息的主要挑战。Fiji是ImageJ的一个增强版，包含了众多功能强大的插件和工具，可用于更高级的图像处理。本期内容小编为大家分享一个超实用的技巧，让你轻松用ImageJ去除荧光图像上的噪点，让你的图像更清晰更专业！快来看看吧！

## 插件安装

在菜单栏点击**Help -> Update**打开**ImageJ Updater**窗口，点击右下角的**Manage update sites**；
![[Pasted image 20240123103033.png]]
找到名称为**TensorFlow**这一行， URL是 [https://sites.imagej.net/TensorFlow/](https://sites.imagej.net/TensorFlow/)，勾选该站点，点击**Apply and Close**等待软件更新完成。
![[Pasted image 20240123103408.png]]
更新成功后，重启软件。在菜单栏点击**Edit -> Options -> TensorFlow**；
在新弹出的窗口中选择合适的**TF版本**，这里就根据自己系统的情况进行选择；
![[Pasted image 20240123103915.png]]
比如小编这里是**CUDA 11.4**所以直接选择了最新的**TF 1.15.0 GPU**；需要注意的是，**Mac系统只支持CPU**。
![[Pasted image 20240123104144.png]]
选择完成后，软件会有安装成功并重启软件的提示，关闭软件。
下面我们就可以安装去噪插件啦，首先从GitHub上下载插件，地址如下：

[网站] [https://github.com/ND-HowardGroup/Instant-Image-Denoising/tree/master/Plugins/Image_Denoising_Plugins_Journal/Plugin_Targets](https://github.com/ND-HowardGroup/Instant-Image-Denoising/tree/master/Plugins/Image_Denoising_Plugins_Journal/Plugin_Targets)
![[Pasted image 20240123104954.png]]
将下载好的​​ **.jar**文件复制到Fiji软件安装目录下的**Plugins**文件夹下。
重新打开软件，就可以在 **”Plugins“** 菜单栏下找到安装号的去噪插件：**Noise2Noise Denoising**以及**DnCNN Denoising**。
![[Pasted image 20240123111638.png]]
现在导入图像至Fiji中，运行插件即可实现图片的去噪，下面是一张灰度图像的去噪效果，还是挺明显的。
![[Pasted image 20240123111835.png]]
下面是使用Noise2Noise denoising插件对彩色图像去噪的效果。
![[Pasted image 20240123112152.png]]

>Mannam V, Zhang Y, Zhu Y, et al. Real-time image denoising of mixed Poisson–Gaussian noise in fluorescence microscopy images using ImageJ[J]. Optica, 2022, 9(4): 335-345.