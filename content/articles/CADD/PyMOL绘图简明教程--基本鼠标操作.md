---
title: PyMOL绘图简明教程--基本鼠标操作
slug: PyMOL_1
description: PyMOL 基础鼠标操作完整讲解，区分旋转、平移、缩放、选区操作，掌握鼠标左键 / 中键 / 右键不同模式，快速熟练分子视角调整，为论文配图打好基础。
category: CADD
tags:
  - "#科研绘图"
  - "#PyMOL"
date: 2026-02-24
draft: false
---
PyMOL 是一款广泛应用于结构生物学、药物设计与计算化学领域的分子可视化软件，适用于绘制**小分子结构**及**生物大分子（尤其是蛋白质）三维结构图像**。在正式发表的结构生物学文献中，约有四分之一的蛋白质结构图像使用 PyMOL 制作，其高质量渲染能力已成为科研绘图的行业标准。

在后续推文中，我们将系统介绍 PyMOL 的进阶绘图技巧。本期内容为大家讲解 **PyMOL 的界面构成与基础鼠标操作**。

### 1.PyMOL窗口界面

PyMOL 的界面属于“**单窗口 + 工具栏/面板可切换**”的布局。核心工作区为 **Workspace**（工作区），围绕 Workspace 分布多种工具栏（Toolbars）与功能面板（Panels）。关键界面模块为：**Action Toolbar、Toggle Toolbar、Panel Toolbar、Content Panel** 等。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-4.png]]

#### 菜单栏
菜单栏位于窗口顶部，包括：File、Edit、Build、Movie、Display、Setting、Scenes、Mouse、Wizard、Plugin及Help，常见功能如文件打开、导出、渲染、结构编辑、测量等均可在此找到。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-2.png]]

#### Workspace（工作区 / 3D 视图）
界面中央为分子三维显示区域，用于：旋转、缩放、平移、结构编辑、选择操作等。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-21.png]]

#### Content Panel（内容面板：对象/选择的核心控制区）
界面右侧的内容面板是 PyMOL 中最重要的对象控制区，面板中的**ASHLC**按钮分别表示Action、**Show、Hide、Label、Color**，其中：
- A（Action）：对该对象进行各种处理操作，如放大、重命名、寻找氢键、删除等；  
- S（Show）：显示该对象的某种样式，如lines、sticks、cartoon等显示方式；  
- H（Hide）：隐藏该对象的某种样式；  
- L（Label）：添加标签，如对氨基酸残基或肽链等进行标记；  
- C（Color）：对显示颜色进行更改，可选择多种配色方案，如按元素着色、按二级结构着色等。  

![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXywS7fbL6vZXJ7dMcPLw3ibvtRUo29iaCF8ibWzgibl9EOTcVBaqicwOSCt4Bp3eR2xMGKbtPaibpm4F6Gg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3)

#### Action Toolbar（动作工具栏：常用操作的快捷入口）
动作工具栏集成了操作PyMOL时的常用命令，**日常视角复位、对象取景（zoom/orient）、以及快速套用预设风格**通常从这里开始。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-5.png]]

**典型功能**：
- Selection Mode Menu（选择模式菜单）
- Undo / Redo
- Zoom / Orient / Rock
- Presets（预设样式，官方标注为 beta）

#### Toggle Toolbar（切换工具栏：开关“序列/命令/时间轴/鼠标菜单/向导”等视图）
PyMOL 把若干“可开关的功能视图”统一放进 Toggle Toolbar。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-6.png]]

主要包含以下内容：
- Mouse menus（鼠标菜单）
- Wizards menu（向导菜单）
- Sequence view（序列视图）
- Timeline panel（时间轴）
- Command panel（命令面板）

可通过 Toggle Toolbar 的图标来快捷的打开/关闭相对应的功能。

#### Command panel（命令面板 / 命令行视图）
PyMOL 的命令行可通过 Toggle Toolbar 控制显示，点击 Toggle Toolbar 的 Command 图标，再点一次可关闭。当选中后，命令面板显示在 Workspace 下方

![[PyMOL绘图简明教程--基本鼠标操作-20260223-7.png]]

#### Mouse menus（鼠标菜单：查看/编辑模式与鼠标映射）
鼠标菜单可自定义/查看 3-button 鼠标控制映射。在 Toggle Toolbar 里选择 **3-Button Viewing** 或 **3-Button Editing**，然后点击该切换项右侧的下拉箭头打开鼠标菜单。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-9.png]]

#### Wizards menu（向导菜单）
PyMOL 的各种向导（如测量、突变、构建等）同样通过 Toggle Toolbar 开关，点击 Toggle Toolbar 的 Wizards 图标，弹出 Wizards 菜单；可通过界面上的 X 关闭。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-13.png]]

#### Sequence view（序列视图）
序列视图类似的可通过 Toggle Toolbar 控制显示，Sequence (SEQ) 显示在 Workspace 顶部。**序列视图让你可以从序列层面对残基进行定位、选择与标注，并与三维结构联动。**

![[PyMOL绘图简明教程--基本鼠标操作-20260223-8.png]]

#### Timeline panel（时间轴/剪辑式动画工作流）
Timeline 可用于更轻松生成“分子电影式序列”，点击 Toggle Toolbar 的 Timeline 图标，再点一次关闭。包含 Composition tab、Track section（Objects 等）、以及 Camera 类轨道入口等。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-10.png]]

#### Scenes panel（场景面板：场景缩略图与场景组织）
Scene 会保存“对象活动状态、显示方式、设置与颜色信息、以及相机位置”等，从而捕捉工作区在某一时刻的状态。
- **用途**：快速创建/组织 scenes，并用于后续做电影/动画
- **打开/关闭**：点击 Panel Toolbar 的 “Scenes” 按钮，再点一次关闭

![[PyMOL绘图简明教程--基本鼠标操作-20260223-11.png]]

#### Draw/Ray panel（渲染与光线追踪相关面板）
用于控制结构外观与渲染（包括光线追踪相关的 Draw/Ray 设置）。可自定义 Workspace 中结构外观、与渲染相关参数。点击 Panel Toolbar 的 “Draw/Ray” 按钮即可打开该面板进行相关参数设置。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-12.png]]

### 2.设置工作路径

在External GUI中的菜单栏选择`File>Working Directory>Change`来设置新的路径为工作目录。默认文件的打开和保存都从工作目录开始，下载文件的保存位置也是在工作目录。

建议在进行不同项目时设置不同的工作目录，方便内容的整理和查找。  

![[PyMOL绘图简明教程--基本鼠标操作-20260223-14.png]]

### 3.打开PDB文件

在External GUI中的菜单栏选择`File>Open`，选取本地对应文件夹（路径不要出现中文）中的PDB文件打开；或者使用命令行：`load file-name`；或者菜单栏选择`File>Get PDB...`，在弹出框中输入所需下载的PDB ID，可自动将该蛋白结构从网站上下载到本地并打开。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-15.png]]

### 4.操控视图

在PyMOL中，鼠标是控制的主要设备，通常使用键盘的Shift、Ctrl、Shift+Ctrl来辅助操作。  

在External GUI菜单栏Mouse选项中可以更改鼠标模式和选择模式。下面为鼠标的常用操作：
- 任意旋转图像：对准图像的任意处点住鼠标左键然后移动鼠标；  
- 移动图像：对准图像的任意处点住鼠标中键或者滚轮，然后移动鼠标；  
- 放大/缩小图像：对准图像的任意处点住鼠标右键然后移动鼠标，向上是缩小，向下是放大；  
- 设定图像旋转中心：Shift+Ctrl+鼠标中键或滚轮；
- 剪切平面：滚动鼠标中键， 建议将蛋白渲染成surface模式，然后滚动鼠标中键；
- 移动剪切平面：Shift+鼠标右键，鼠标上下移动调整前剪切平面；鼠标左右移动调整后剪切平面。

![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXywS7fbL6vZXJ7dMcPLw3ibv27JH5zclp8OWuUyqTaIf6cJAj1tdvGw892q6tNryDbXP8yyBvoL1jw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=6)

### 5.结合位点预设

利用Name Panel中A（Action）按钮的preset选项可对打开的结构图像进行预设，点击**A**选择`preset>ligands`，如下图形式显示配体、氢键和周围残基：  

![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXywS7fbL6vZXJ7dMcPLw3ibvDEhpmwV6K4vDgAr5kraQmyfDO6dn5eqkAJTNI9789NQjf0V2T3EWzQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7)

点击**A**选择`preset>ligands sites>cartoon`，如下图显示结合位点：

![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXywS7fbL6vZXJ7dMcPLw3ibvosRj9wDia7kZFudibvOf4bbw5jBYzBVxlgVzcU2vOcOBhrKiaYYAFRDqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=8)

点击**A**选择`preset>ligands sites>solid surface`，则会显示活性口袋：

![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXywS7fbL6vZXJ7dMcPLw3ibvIHJicfC9SE7rbFXa7wpTtNq0OFQ8Hibb1Za4Xt6K0pIzGA59c7dFMyCg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=9)

当然，还有其他的预设，可以去尝试。  

### 6.添加并移动label

选择需要添加label的对象，然后点击对象上的**L**按钮，根据需要，可以标记残基的名字，原子的名字，范德华半径、元素的名字等；

移动label时，点击Mouse Mode 切换为 editing 模式，然后按住ctrl键不放，然后将鼠标移动到残基标签上方，并按下鼠标左键不放，然后移动鼠标，就可以调整标签的位置。

### 7.距离、角度测量

在Toggle Toolbar工具栏中点击Wizard图标，选择Measurement ，界面右侧的窗口右下方会出现Measurement 栏，依次点击两个原子则能测量它们之间的距离，并显示虚线和label；

![[PyMOL绘图简明教程--基本鼠标操作-20260223-16.png]]

在Toggle Toolbar工具栏中点击Wizard图标，选择Measurement ，界面右侧的窗口右下方会出现Measurement 栏，点击Measuremnet 面板中Distances按钮，切换到Angles按钮，依次点击三个原子，即可测量角度。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-17.png]]

![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXywS7fbL6vZXJ7dMcPLw3ibvlpLD0Mu5vyEsywQeus3SDfFaibQhQBib6ibXlTuytKPgcm6Wk72On5VRQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=10)

### 8.参数设置

在菜单栏选择`Setting>Edit All`，在打开的PyMOL Setting窗口中能够对各项参数值进行修改，如dash项的dash_color、dash_radius参数，更改并回车即生效。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-18.png]]

此外，选择Setting栏的Label、Cartoon、Surface、Transparency等选项，可以对相应内容如label字体、显示样式细节、透明度等参数进行调整。  

![[PyMOL绘图简明教程--基本鼠标操作-20260223-19.png]]

### 9.设置光照模式

PyMOL中预设了5种不同的光照模式：default(默认)，metal(金属)，plastic(塑料)， rubber(橡胶)，X-ray。

在菜单栏选择`Plugin>lighting Settings`进行设置不同的光照，通过调节参数面板的滑块可得到不同的效果。

![[PyMOL绘图简明教程--基本鼠标操作-20260223-20.png]]

![图片](https://mmbiz.qpic.cn/mmbiz_png/kaukJDVZNXxfAEQ0RpJiaWqnVNoa0NCkTP31jicScdEDCF2OaEffWlRWAKPgSqJiat6SM1AU05q4nxlVprFS5fGpw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=14)

### 10.保存文件

在菜单栏选择`File>Save Session As`，能对当前会话文件进行保存，保存文件为.pse格式，下次打开此文件即能恢复到当前所在状态；

选择`File>export molecule`，然后从selection的下拉框中选择需要导出的object, all 代表所有的object；enable 代表的可见的object；保存格式可以为pdb、mol2、sdf等；  

选择`File>export image as>png`，能对当前窗口中的图像进行保存，保存格式为.png；

选择`File>export movie as`可对动画进行保存，自行下载ffmpeg，可以保存多种格式，如gif、mov、mpg等。

以上就是为大家分享的PyMOL基本鼠标操作教程啦~