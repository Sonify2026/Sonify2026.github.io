---
title: 用ImageJ的3D Surface Plot可视化荧光图像！
slug: Fiji_13
description: 荧光信号强弱看不出差异？试试 ImageJ 的 3D Surface Plot，把荧光强度变成立体曲面，信号高低一目了然，SCI 配图又多一个高级画法。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - Fiji
date: 2024-03-12
draft: false
---
在生物医学领域，图像分析是一项关键的任务，旨在获取准确的生物标记物表达信息并从中提取有关细胞或组织状态的重要信息。ImageJ是一个强大的开源软件，广泛用于处理和分析科学图像，包括生物学领域中的图像。**3D Surface Plot（三维曲面图）是一种用于可视化三维数据的图表类型** 。   ImageJ就提供了绘制3D Surface Plot的工具，它提供了**从二维图像中提取的三维数据的视觉表示**。这个工具在你想分析图像数据的地形或强度分布时特别有用。

例如，如果你在处理荧光显微镜图像，3D Surface Plot可以帮助可视化细胞或组织切片中荧光信号的强度。这种可视化可能会揭示某些蛋白质、细胞器或其他细胞成分的分布和密度。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGxOMG2Lrt3awRcz9DgFws7ewygsqk5uVz284cjx340ojI3icRStyqibHA/640?wx_fmt=png)
本期内容小编为大家分享在Fiji（ImageJ）中快速绘制3D Surface Plot的方法！

## ▌ImageJ绘制3D Surface Plot

在ImageJ中可以非常轻松的实现3D Surface Plot的绘制，首先，使用ImageJ打开需要分析的图片；
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGvr3lckhyV1jp3LzVNhWG5tSRI9YWaJQqbeicYUz5Ywk0Kr1e2G5wygw/640?wx_fmt=png&from=appmsg)
在菜单栏点击“==Analyze -> 3D Surface Plot==”即可绘制3D Surface Plot；
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXwPTuL2quguH2DfU4WQbjSGAEqp9WnCnCIDXhcKTK6JuM0RIm9xrAWqSIKGgAZia4icEcXgpM67j4AA/640?wx_fmt=png&from=appmsg)
默认视图以原始LUT颜色（在本例中为灰色）显示图像。根据原始图像中的分辨率和强度范围，更改网格大小（**Grid Size**）和平滑（**Smoothing**）可以更好地展示数据。

在界面上方的工具栏可以更细致的对图像进行调整。如更改曲面图的显示模式：
- **Dots（点模式）：** 所有像素都绘制为小点；
- **Lines（线模式）：** 在x方向将像素连接；；
- **Mesh（网格模式）：** 所有像素在 x 和 y 方向上连接；
- **Filled（填充模式）：** 所有像素相连，连接成完整的面。

还可以随心所欲地转换显示颜色，从原色到灰度，再到各式各样的LUT选择，只要一键切换，即可带来截然不同的视觉效果。还可更改其它的图像属性，如网格大小、绘图高度、坐标轴、背景等，大家可自行尝试调节。
![](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXxmaEoKS9H49ApnnDbabCibcDVhBIUb5YBHOecpl9rXYFF1PtoVtd2Tibe0bzdI81JicSEtiagZymapaQ/640?wx_fmt=png&from=appmsg)
修改完成后，点击“==Save Plot==”即可保存图像。