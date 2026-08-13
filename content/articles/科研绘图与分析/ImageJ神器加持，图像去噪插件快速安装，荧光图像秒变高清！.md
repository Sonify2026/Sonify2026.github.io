---
title: ImageJ神器加持，图像去噪插件快速安装，荧光图像秒变高清！
slug: Fiji_11
description: 荧光图噪点多画质差？Fiji 专业降噪插件一键安装上手，弱荧光共聚焦图片秒变高清，避开 SCI 图片处理雷区。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - Fiji
date: 2024-01-25
draft: false
---
在上一期“[[用ImageJ轻松去噪，荧光图像更清晰！]]”的推文中，小编为大家分享了使用ImageJ插件--**Noise2Noise Denoising**以及**DnCNN Denoising**进行荧光图像去噪的方法，有小伙伴留言**ImageJ软件内更新失败，无法成功安装插件**。本期内容就为大家分享这两款插件的另一种安装方法。

1. 首先在GitHub上下载“**step1 files.zip**”，地址如下：

```
https://github.com/ND-HowardGroup/Instant-Image-Denoising/blob/master/Plugins/Installation_steps/step1%20files.zip
```

下载好压缩包后，解压，step1 files文件夹中包含以下文件：
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzl23CdwHBic1TyiclnJ6X3tjSic2bSibCjXVsCxBAyhR8wws5ia1icyQeviaKfNeFMhO8NS68TaFLBoEPsg/640?wx_fmt=png&from=appmsg)
复制文件夹中的所有文件至**Fiji或imageJ的plugins文件夹**中（plugins文件夹可在Fiji或imageJ的安装路径中找到）。

2. 在GitHub上下载“**step2 files.zip**”，地址如下：

```
https://github.com/ND-HowardGroup/Instant-Image-Denoising/blob/master/Plugins/Installation_steps/step2%20files.zip
```

下载好压缩包后，解压，step2 files文件夹中包含以下文件：
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzl23CdwHBic1TyiclnJ6X3tjiau0ltiaiaNSqkibEHQNWGGWRibXdMbyZ8VtTdhkNGLCiajVd9vHCVsarJPQ/640?wx_fmt=png&from=appmsg)
这两个文件夹是两款插件的模型，我们需要将这两个文件夹复制至**Fiji或imageJ的models文件夹**中。

注：如果你的安装路径没有models这个文件夹，就新建一个新的文件夹命名为“models”即可。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzl23CdwHBic1TyiclnJ6X3tjFnFVzNa9zInJmjhJ7ic2fkbbWKlzRXklMZ4QvlKLvXUPq7vLdamKibHw/640?wx_fmt=png&from=appmsg)
之后**重启Fiji/ImageJ**软件，就可以使用这两款插件啦。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXzl23CdwHBic1TyiclnJ6X3tjP5gayF8wwLSIjib13ml7CMenIQ6ibSkwSdJhugOT75lCD9icgoRyJhclA/640?wx_fmt=png&from=appmsg)
不方便使用GitHub的小伙伴也无需担心，小编已经替大家下载好了这两款插件，需要的小伙伴可以在留言区自取！
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwlzJfic0v2wdabGwkevaFibg2lzYsobQhZ7d60GpDlibiahCcdyA2wIswhgVQeOMKcKqzqsGs3uUGCoA/640?wx_fmt=png&from=appmsg)
> 参考资料：
> 
> Mannam V, Zhang Y, Zhu Y, et al. Real-time image denoising of mixed Poisson–Gaussian noise in fluorescence microscopy images using ImageJ[J]. Optica, 2022, 9(4): 335-345.