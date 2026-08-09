---
title: 用 Fiji 实现细胞划痕实验自动化分析
slug: Fiji_2
description: 还在用鼠标手动画划痕算愈合率？Fiji 全自动分析划痕实验，批量出数据、减少人为误差，细胞迁移实验发图发数据更省心。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - Fiji
date: 2026-01-29
draft: false
---
在细胞迁移与伤口愈合研究中，划痕实验（Wound Healing Assay）几乎是最常见的体外模型之一。然而，实验后对划痕面积的量化往往成为科研人员的“隐形工作量”——  每张图都要手动描线、测距、计算，既耗时又主观。

幸运的是，借助 **ImageJ 的自动化分析插件 Wound_healing_size_tool**，我们可以用标准化、批量化的方式快速获得准确的愈合面积数据。本文将带你一步步掌握如何使用该工具，从图像导入到数据导出，让你的细胞迁移实验分析更智能、更 reproducible。

### 🔧 一、工具准备

首先，我们需要准备三样东西：

1️⃣ **ImageJ 或 Fiji 软件**（免费开源的生物图像分析平台）  
2️⃣ **插件 Wound_healing_size_tool.ijm**  
👉 下载地址：[GitHub - Wound-healing-size-tool](https://github.com/AlejandraArnedo/Wound-healing-size-tool/wiki)  
3️⃣ **你的实验图像**（支持格式：.tif, .jpg, .png, .zvi, .oif 等）

> 💡 如果你是拍的时间序列图像（time-lapse），它也能一键处理整个堆栈数据！

### 🧩 二、安装与运行插件

1. 安装路径：`Plugins → Macros → Install...`  
    选择下载好的 **Wound_healing_size_tool.ijm** 文件。
    
> 也可将下载好的**Wound_healing_size_tool.ijm**文件放在软件安装目录下的macros/toolsets文件夹，然后重启ImageJ即可完成安装。

![[Pasted image 20251011155304.png]]

### 🧫 三、打开图像与通道处理

1. 启动 **ImageJ/Fiji**，点击 `File → Open` 打开图像。这里我们以网上的一张划痕照片为例。

![[Pasted image 20251011155921.png]]
    
> 若是多通道图像，选择 `Image → Color → Split Channels`，只保留需要分析的那个通道（通常是明场或特定染色通道）。
> 若是堆栈（stack）图像，使用 `Image → Stacks → Stack to Images` 拆分。
> 校准比例：`Analyze → Set Scale` → 输入比例（像素/微米）。这样你的结果才能与实际物理尺度对应。

2. 点击ImageJ工具栏的 **>>** 按钮，勾选**Wound_healing_size_tool** 即可运行插件；

![[Pasted image 20251011160200.png]]

此时，可以看到软件界面工具栏右侧出现三个图标，分别代表**批量图片分析**、**单张图片分析**、**倾斜角度调整**。点击相应的图标即可对图像进行分析。

![[Pasted image 20251011160604.png]]

3. 点击**单张图片分析**按钮运行宏，然后选择需要分析的图片，会弹出参数设置窗口；

![[Pasted image 20251011160918.png]]

#### ⚙️ 参数详解

|参数名|作用|建议设置|
|---|---|---|
|Variance window radius|控制方差滤波的半径，决定划痕区域检测精度。半径过小会受噪声影响。|根据图像大小，通常 10–30|
|Threshold|将方差图像二值化的阈值。|视图像亮度而定，可多次尝试|
|% Saturated pixels|控制图像对比度的增强程度。值越大，对比度越高。|>0，一般 0.3–1.0|
|Set Scale global?|是否将比例校准应用到所有图像。|若为同一实验批次选“Yes”|
|Scratch is diagonal?|判断划痕是否有角度倾斜。|有倾斜选“Yes”，否则“No”|

4. 设置完成后点击 **OK**，等待插件运行。程序会自动识别划痕区域，识别后检查所选 ROI 是否正确覆盖创伤区域，根据结果调整参数设置。

### 📊 五、数据分析与导出

宏运行完成后，会自动弹出 **Results 窗口**，显示每张图像的分析结果：包括 **伤口面积、面积百分比、平均宽度、宽度SD** 等。

![[Pasted image 20251011161458.png]]

你可以直接复制结果表格到 Excel 或 GraphPad Prism，  
计算愈合速率或绘制折线图：

![[Pasted image 20251011161226.png]]

> 其中 A<sub>t=0​ </sub>为初始划痕面积，A<sub>t=Δt</sub> 为某时间点的划痕面积。

💡 **小贴士**：  

在进行堆栈分析前，建议先用堆栈中的一张复制图像进行单张图像分析，以验证参数设置是否合适。
如果需要保存带有划痕标记的图片，可以在ROI Manager窗口点击 **Properties** 按钮对标记的属性进行修改，之后点击 **Flatten [F]** 按钮，最后对图像保存需要的格式即可。

![[Pasted image 20251011162538.png]]

![[Pasted image 20251011162609.png]]

参考文献：

Suarez-Arnedo, A., Torres Figueroa, F., Clavijo, C., Arbeláez, P., Cruz, J. C., & Muñoz-Camargo, C. (2020). An image J plugin for the high throughput image analysis of in vitro scratch wound healing assays. PloS one, 15(7), e0232565.
