---
title: Fiji 宏工具分享｜一键批量处理 Zeiss CZI 多通道图像：拆分、伪彩、Z 投影、合并与导出
slug: Fiji_15
description: Fiji 宏自动化处理蔡司 CZI 原始共聚焦文件，实现批量读取 CZI、通道拆分、Z‑stack 最大强度 MIP 投影、伪彩上色、通道合并、批量导出 TIF，标准化处理 LSM900 等产出的.czi 图像，减少手动重复操作，保证组间处理参数统一、结果可复现。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - Fiji
date: 2026-09-03
draft: false
---

> [!引言]
> 做显微成像的人，大概率都经历过这样的场景：  
> 一批 Zeiss `.czi` 文件需要逐个打开、拆分通道、改颜色、做 Z-stack 最大强度投影、增强对比度、分别保存单通道图，再导出一张合并图。  
> 
> 文件少的时候还能手动完成；一旦样本数上升，这套操作就会迅速变成重复、耗时，而且非常容易出现命名不统一、颜色设置错误、漏存文件等问题。
> 
> 为了解决这个问题，我写了一个 Fiji / ImageJ 宏工具：**Batch CZI Multi-Channel Processor**。  
> 它面向批量 Zeiss CZI 多通道显微图像处理，可以自动识别通道，并按统一参数完成单通道拆分、伪彩、Z 最大强度投影、对比度增强、RGB 合并及批量导出。


## 一、这个工具解决什么问题？

在荧光显微镜、共聚焦显微镜等实验中，我们经常会获得包含多个通道的 `.czi` 文件，例如：

- Channel 1：DAPI
- Channel 2：GFP
- Channel 3：mCherry
- Channel 4：远红通道
- ……

常规处理流程通常包括：

1. 用 Fiji 打开 CZI；
2. 拆分各个通道；
3. 为不同通道设置伪彩；
4. 对 Z-stack 做 Maximum Intensity Projection；
5. 适当增强显示对比度；
6. 分别保存各通道图像；
7. 再生成一张多通道 Merge 图；
8. 对下一张 CZI 重复以上全部操作。

问题在于：**这些步骤高度标准化，却又需要大量重复点击。**

如果一次需要处理几十甚至上百个视野，手工操作不仅耗时，也很难保证每一张图的处理规则完全一致。

因此，这个宏的设计目标非常明确：

> **把重复性的显微图像预处理流程标准化，并尽可能一次配置、整批执行。**


# 二、工具简介

**工具名称：** Batch CZI Multi-Channel Processor  
**版本：** v1.0.0  
**运行平台：** Fiji / ImageJ 1.53d 或更高版本  
**依赖：** Bio-Formats  
**输入格式：** Zeiss `.czi`  
**输出格式：** TIFF 或 PNG  

如果使用的是标准 Fiji，一般已经自带 Bio-Formats，因此通常不需要额外安装插件。

# 三、主要功能及使用

## Step 1：运行宏文件

在 Fiji 中选择“`Plugins -> Macro -> Run`”选择打开下载好的 `Batch_CZI_MultiChannel_Processor.ijm` 文件（🏷️文件可在文末获取）。

首先会看到主参数设置窗口。

![[Fiji-宏工具分享-一键批量处理-Zeiss-CZI-多通道图像-拆分、伪彩、Z-投影、合并与导出-001.jpeg]]

需要设置：

| 参数                                   | 作用                              |
| ------------------------------------ | ------------------------------- |
| Input CZI folder                     | CZI 原始文件所在目录                    |
| Output folder                        | 输出目录                            |
| Max Intensity Projection (Z)         | 是否进行 Z 最大强度投影                   |
| Auto enhance contrast                | 是否自动增强对比度                       |
| Saturated pixels (%)                 | Enhance Contrast 的 saturated 参数 |
| Convert individual LUT images to RGB | 单通道保存前是否转换为 RGB                 |
| Create merged RGB image              | 是否生成 Merge 图                    |
| Skip outputs that already exist      | 是否跳过已经完整输出的文件                   |
| Export format                        | TIFF 或 PNG                      |

### 参数说明

#### Max Intensity Projection (Z)

如果 CZI 文件包含 Z-stack，可以在主界面中勾选：`Max Intensity Projection (Z)`

宏会对每个需要处理的通道执行：

```text
Z Project → Max Intensity
```

也就是常用的 **Maximum Intensity Projection，最大强度投影**。

其逻辑是：

> 对 Z 轴不同层面中相同 XY 位置的像素进行比较，并保留其中最大强度值。

这非常适合用于：

- 共聚焦 Z-stack 快速展示；
- 细胞荧光信号整体观察；
- 神经突起、血管等空间结构展示；
- 组织切片多层信号压缩；
- 多层荧光图像的快速预览。

程序也做了一个判断：

```text
只有 nSlices > 1 时才执行 Z Projection
```

如果本身就是单层图像，则不会进行无意义的投影操作。

#### Auto enhance contrast

程序提供 `Auto enhance contrast` 选项。勾选以后，可以进一步指定 `Saturated pixels (%)`，默认值为：`0.35%` ，对应 Fiji 中：

```text
Enhance Contrast
```

命令的 `saturated` 参数。

例如：

```text
saturated=0.35
```

宏会在 Z 投影之后、应用 LUT 之前进行对比度增强。

因此典型流程为：

```text
原始 Channel
      ↓
Maximum Intensity Projection
      ↓
Enhance Contrast
      ↓
应用 LUT
      ↓
导出图像
```

需要特别说明的是，**自动增强对比度更适合用于图像展示或快速浏览**。

如果后续需要进行严格的荧光强度定量，建议根据自己的实验设计谨慎使用，并保留未经显示增强处理的原始数据。

#### Convert individual LUT images to RGB

LUT 在 ImageJ 中本质上可以只是显示映射，并不一定真正写入图像的 RGB 像素。因此程序提供了
`Convert individual LUT images to RGB`，默认开启。

开启后，在保存单通道图像之前会执行：

```text
RGB Color
```

这样导出的 TIFF 或 PNG 打开以后，可以直接看到设置好的：

- 蓝色 DAPI；
- 绿色 GFP；
- 红色 mCherry；
- 其他自定义 LUT。

如果希望保留原始灰度数据与 LUT 的显示逻辑，也可以取消这一选项。

#### Create merged RGB image

除了分别导出每一个 Channel，这个宏还可以自动生成 `Create merged RGB image`，默认同样为开启状态。

这里并不是简单调用 ImageJ 固定的 RGB 三通道合并方式。

程序采用的逻辑是：

1. 对每一个已选择 Channel 复制一份图像；
2. 应用对应 LUT；
3. 转换成 RGB；
4. 将不同 Channel 的 RGB 图像进行加法叠加；
5. 得到最终 Merge。

因此，即便实验中使用了：

- Cyan
- Magenta
- Yellow
- Fire
- Ice
- Spectrum

等 LUT，也可以保留其颜色效果参与最终合并。

这使 Merge 功能不仅局限于传统的：

```text
Red + Green + Blue
```

三个通道。

对于 4 色、5 色甚至更多通道的展示会更加灵活。

#### Export format

在运行宏时，可以选择 `Export format`

目前支持：

```text
Tiff
PNG
```

设置好所有参数后，点击 `OK` 进行下一步。

## Step 2：设置每一个 Channel

确认主参数后，程序会首先在输入文件夹中寻找第一张 `.czi` 文件，并检测 Channel 数量。

随后弹出 Channel 配置窗口，程序允许为每个 Channel 设置独立名称。

![[Fiji-宏工具分享-一键批量处理-Zeiss-CZI-多通道图像-拆分、伪彩、Z-投影、合并与导出-001 1.jpeg]]

例如：

| 原始通道 | 自定义名称 |
|---|---|
| C1 | DAPI |
| C2 | GFP |
| C3 | mCherry |
| C4 | Cy5 |

这些名称不仅用于帮助识别，也会自动写入最终的文件夹和文件名中。

例如：

```text
C1_DAPI_blue/
C2_GFP_green/
C3_mCherry_red/
```

最终输出文件也可以类似：

```text
Sample01_DAPI_blue.tif
Sample01_GFP_green.tif
Sample01_mCherry_red.tif
```

这样整理后的实验数据会比简单的 `C1`、`C2`、`C3` 更容易阅读和归档。

例如检测到 3 个 Channel，可以设置：

```text
Channel 1 name = DAPI
Channel 1 LUT  = Blue

Channel 2 name = GFP
Channel 2 LUT  = Green

Channel 3 name = mCherry
Channel 3 LUT  = Red
```

#### 每个通道独立设置 LUT 伪彩

每个 Channel 都可以单独选择伪彩 LUT。

目前宏中提供：

- Skip
- Red
- Green
- Blue
- Grays
- Cyan
- Magenta
- Yellow
- Fire
- Ice
- Spectrum

![[Fiji-宏工具分享-一键批量处理-Zeiss-CZI-多通道图像-拆分、伪彩、Z-投影、合并与导出-001 2.jpeg]]

例如可以设置：

```text
DAPI     → Blue
GFP      → Green
mCherry  → Red
Cy5      → Magenta
```

宏默认对前几个通道给出了较常见的颜色：

```text
C1 → Blue
C2 → Green
C3 → Red
C4 → Magenta
C5 → Cyan
C6 → Yellow
```

第 7 个及之后的通道默认使用 Grays。当然，所有颜色都可以在运行时重新选择。

此外，并不是每个实验都需要导出 CZI 中的全部通道。如果某个通道只用于辅助观察，或者当前分析不需要，可以直接把该通道的 LUT 设置成 `Skip` 即可。

之后程序会跳过这一通道：

- 不进行图像处理；
- 不导出单通道文件；
- 不加入 Merge 图。

因此，无需为了不同实验条件重新修改宏代码。

## Step 3：等待批处理完成

之后程序会自动完成整批 CZI 的处理。在处理期间，Fiji 状态栏会显示当前文件名和进度。

为了提高效率，宏使用：

```text
setBatchMode(true)
```

进行批处理，因此不会把每一步中间图像都持续显示在桌面上。处理完成后，会显示：

```text
Total CZI files
Successful
Skipped
Failed
Log
```

方便快速检查结果。

#### 自动创建结构化输出文件夹

程序不会把所有导出图片全部堆在同一个目录中，而是根据 Channel 自动创建独立文件夹。

例如，一个三通道实验设置为：

```text
C1 = DAPI     / Blue
C2 = GFP      / Green
C3 = mCherry  / Red
```

输出文件夹可能为：

```text
Output/
│
├── C1_DAPI_blue/
│   ├── Sample01_DAPI_blue.tif
│   ├── Sample02_DAPI_blue.tif
│   └── Sample03_DAPI_blue.tif
│
├── C2_GFP_green/
│   ├── Sample01_GFP_green.tif
│   ├── Sample02_GFP_green.tif
│   └── Sample03_GFP_green.tif
│
├── C3_mCherry_red/
│   ├── Sample01_mCherry_red.tif
│   ├── Sample02_mCherry_red.tif
│   └── Sample03_mCherry_red.tif
│
├── Merge/
│   ├── Sample01_Merge.tif
│   ├── Sample02_Merge.tif
│   └── Sample03_Merge.tif
│
└── batch_log.txt
```

这种目录结构非常适合后续：

- 按 Channel 统计；
- 批量导入其他分析软件；
- 整理实验数据；
- 自动化拼图；
- 后续 Python / R 图像分析。

# 四、完整处理流程

如果开启所有主要功能，一张 CZI 的实际流程可以概括为：

```text
读取 CZI
   ↓
Bio-Formats Import
   ↓
读取 C / Z / T 信息
   ↓
Split Channels
   ↓
逐个处理选中的 Channel
   ↓
Z Maximum Intensity Projection（可选）
   ↓
Enhance Contrast（可选）
   ↓
应用指定 LUT
   ↓
生成 RGB Merge 素材
   ↓
单 Channel RGB 转换（可选）
   ↓
保存 TIFF / PNG
   ↓
所有 Channel RGB 加法合并
   ↓
保存 Merge
   ↓
写入 batch_log.txt
```

整个过程基本不需要人工逐图干预。

# 五、使用前需要注意的几个问题

## 1. 默认假设同一批 CZI 的结构一致

宏会使用输入目录中的 **第一张 CZI** 来确定 Channel 数量，并据此生成整批数据的 Channel 配置。

因此比较理想的情况是：

> 同一个输入文件夹中的 CZI 具有一致的 C / Z / T 结构。

如果后面的某个文件 Channel 数量不同，宏会在日志中记录：

```text
WARN
```

因此，不建议把完全不同实验设置的 CZI 混在同一个文件夹中运行。

更推荐按照：

```text
相同显微镜设置
相同 Channel 数
相同实验批次
```

分别建立输入目录。

## 2. 建议先用少量代表性数据测试

虽然程序支持直接批量运行，但正式处理大量数据之前，建议先复制：

```text
2～3 个代表性 CZI
```

测试：

- Channel 顺序；
- LUT；
- Z Projection；
- 对比度；
- 输出文件名；
- Merge 效果。

确认无误后，再运行完整批次。

这也是任何显微图像自动化流程都值得坚持的习惯。

## 3. Enhance Contrast 不等于定量分析

自动增强对比度的目的主要是改善显示效果。

如果实验需要比较不同样本之间的：

- Mean intensity；
- Integrated density；
- Fluorescence intensity；
- Signal/background ratio；

则不应简单以自动增强后的 RGB 图像作为定量依据。

更规范的做法仍然是：

> **保留原始 CZI，并基于原始或经过明确标准化处理的数据进行定量。**

这个宏更偏向于：

```text
标准化批处理
+
图像导出
+
可视化准备
```

而不是替代完整的定量分析流程。

## 4. Merge 使用的是 RGB 加法叠加

这个宏为了保留任意 LUT 的颜色，将每个选中 Channel 先转换为 RGB，再进行加法合并。

它的优势是颜色自由度高。但也意味着：

> Merge 图主要定位于可视化结果，而不是用于恢复原始多通道定量信息。

因此原始 CZI 文件一定要保留。


> ✨ 工具获取：后台私信发送关键词“**Fiji001**”，就可免费获取这款 Fiji 宏工具啦！