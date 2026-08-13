---
title: 5分钟看懂FlowJo！流式细胞术数据分析指南！
slug: FlowJo_1
description: 流式数据拿到手不会圈门？5 分钟快速上手 FlowJo，搞定补偿、圈门、亚群比例统计，流式分析不再一头雾水。
category: 科研绘图与分析
tags:
  - "#数据分析"
  - "#科研绘图"
  - "#FlowJo"
  - "#流式细胞术"
date: 2025-12-03
draft: false
---
在多色流式细胞术的分析过程中，数据质量的把控、门控策略的科学性以及统计结果的严谨性，直接决定了实验结论是否可靠。而作为流式数据分析的行业标准工具，**FlowJo** 凭借其强大的批量处理能力、灵活的可视化布局和符合科研发表需求的数据输出方式，成为免疫学、肿瘤学、干细胞、临床转化和多组学整合研究中不可或缺的分析平台。

本期内容将从数据导入、分组、补偿、注释、门控、数据变换，到表格输出和作图布局进行说明，帮助你快速掌握 **从原始FCS文件到可投稿图表** 的完整分析流程。

### 添加数据

向工作区（Workspace）添加数据的最简单方法是：将包含FCS数据文件的整个文件夹直接拖拽到FlowJo工作区中（参见 _Drag Samples Here_ 区域）。
![[Pasted image 20251201175319.png]]

> <font color="#de7802">📌补充说明 </font>
> FlowJo支持**FCS 2.0 / FCS 3.0**标准格式的流式细胞术数据文件（.fcs）。这些文件通常由流式细胞仪（如BD、Beckman、Sony等）采集后生成，包含通道信息、荧光补偿矩阵、采集事件数等元数据。

### 分组管理

分组是FlowJo中的**基本组织结构单元**。当你对某个分组进行操作时（例如建立门控、添加统计参数），这些操作会自动应用于该分组内的所有样本。

- 当你将一个FCS文件夹拖入FlowJo时，FlowJo会自动创建一个与文件夹同名的分组。
- 你也可以通过点击 **New Group {+}** 按钮手动创建新的分组。
- 双击分组名称可以设置该分组的筛选规则，从而让FlowJo根据设定条件自动将样本分配到相应分组中。

> <font color="#de7802">📌补充说明</font>
> 
> - 分组对于多组实验（如对照组 vs 处理组、不同时间点、不同细胞类型等）特别重要，可以显著加快分析效率。
>     
> - 常见的分组方式包括：样本名称关键字（如 Ctrl、DrugA、Day1、Day7）、管号（Tube ID）、补偿方案、实验批次等。
>     
> - 分组后在任意样本上建立门控策略（gating strategy）时，FlowJo会自动同步到整个分组，有利于**批量一致性分析**。
>
![[Pasted image 20251201180059.png]]
### 荧光补偿

FlowJo 会自动将文件名中包含 **“comp”** 或 **“unstained”（未染）** 的样本分配到 **Compensation Group（补偿组）** 中。你也可以将其他希望作为补偿控制（comp control）的样本拖入该组。

当补偿组文件准备好后，点击 **Compensation Group**，然后点击 **Compensation Wizard（补偿向导）** 按钮。补偿向导会自动执行补偿计算，但允许你作为实验分析者在必要时对结果进行人工优化和调整。

> <font color="#de7802">📌补充说明</font>
> 
> - 在多色流式细胞术中，由于荧光发射谱重叠，不同通道之间可能出现信号串扰（spillover），需要进行**荧光补偿（Compensation）** 以分离真实信号。
>     
> - 补偿通常基于 **单阳性管（single-stain controls）**  和 **未染对照（unstained control）** 生成。
>     
> - 建议补偿使用：
>     - 与实验样本**同批次、同仪器、同设置**采集的补偿管
>     - 使用与实验相同的荧光染料，而非等效替代染料
>     - 细胞型补偿优于微珠补偿（特别是表面标志与细胞内染色比例差异较大时）

### 功能区菜单

FlowJo v10 的工具界面采用 **功能区** 设计。共有 **6 个功能区**：**FlowJo、File、Edit、Workspace、Tools、Configure**，每个功能区包含一个或多个 **工具带**，每个工具带由相关功能工具组成。

用户可以通过以下方式自定义功能区：
- 拖动工具带离开或加入功能区
- 点击 **Customize Ribbons** 按钮，将工具带拖入任意功能区区域
![[Pasted image 20251201175453.png]]
### 注释与样本信息管理

在FCS文件列表上方的 **column header（列标题）** 处右键点击，可以选择哪些 **Keywords（关键字，实验元数据）** 作为列显示在工作区中。几乎所有已显示的关键字都可以通过双击对应单元格进行编辑。
![[Pasted image 20251201180227.png]]
你还可以通过工作区顶部功能区（Workspace ribbon）中的 **Keywords +** 工具，添加新的关键字或关键字集合。
![[Pasted image 20251201180301.png]]
📌<font color="#de7802">补充说明</font>

**Keywords（关键字）** 是FCS文件中附带的实验元数据，通常由流式细胞仪采集软件写入，包括：

|常见Keyword|说明|
|---|---|
|`$CYT`|仪器型号（如 BD FACSCanto II）|
|`$DATE`|数据采集日期|
|`$SMNO / Tube ID`|管号或样本编号|
|`$SRC`|样本来源（如 PBMC、spleen、tumor）|
|`Stain / Panel / Condition`|染色方案或实验处理条件|
|`$TOT`|采集事件总数（Total events）|

💡<font color="#de7802">使用场景建议</font>

- 对于多组样本（批量实验），建议添加并使用：
    - **Group / Treatment / Time point**
    - **Patient ID / Sample ID / Replicates**
    - **Batch / Operator / Instrument setting**
        
- 设置好关键字后，可以利用 **自动分组** 快速构建工作区结构，提高分析效率。
    
- keywords 对于 FlowJo 的 **批量统计** 和 **批量导出** 非常关键，是标准化分析流程的重要组成部分。

### Gates（门控）

在工作区中双击任意 FCS 文件即可打开其 **Graph Window（图形窗口，GW）**。

在 Graph Window 中，你可以：
- 点击坐标轴标签来更换通道（参数）。
- 使用门控工具（Gating Tools）在图上绘制门（gate）。
- 双击绘制好的门，可打开一个仅显示门内细胞群的新图形窗口。
- 将某个门拖动到组（Group）上，以对该组内所有样本自动应用相同的门控策略。
![[Pasted image 20251201180723.png]]

> 📌<font color="#de7802">补充说明</font>
>  
> 常见门控工具包括：
> - **Polygon Gate（多边形门）**：最常用，可精确圈定群体
> - **Rectangle Gate（矩形门）**
> - **Ellipse Gate（椭圆门）**
> - **Quadrant（象限）**
> - **Interval（单轴区间）**
> 
> 流式分析常见的门控流程包括：
> 1. **FSC-A / SSC-A** 粗略筛除碎片（Debris）
> 2. **FSC-H / FSC-A** 或 **SSC-H / SSC-W** 筛除双ts（Doublets）
> 3. **Live/Dead 染料**选择存活细胞
> 4. 生物学特异性群体（如 CD3+、CD4+、CD8+ 等）
>     

### 数据重缩放与变换

在 FlowJo 中，对数据进行重缩放非常简单。坐标轴旁的 **T 按钮** 允许快速切换**线性（Linear）** 与**对数（Log）** 显示模式。

你还可以通过 **Customize Axis（自定义坐标）** 选项应用更复杂的数据变换，例如：
- **Logicle（Bi-exponential）***
- **Hyperlog**
- **Arcsinh（常用于 CyTOF / Mass Cytometry）**
![[Pasted image 20251201181041.png]]![[Pasted image 20251201181413.png]]
在 Transform 窗口中，你可以：调整变换参数与范围、批量应用到多个通道、保存并作为下次分析模板等。
![[Pasted image 20251201181505.png]]
### 统计表格分析

在完成门控后，可以使用 **Table Editor（表格编辑器，TE）** 来创建统计结果表。点击工作区上方工具栏中的 **Table Editor** 按钮即可打开 TE。

在 Table Editor 窗口中：
- 你可以将希望统计的细胞群（population）拖拽到表格区域中。
- 将统计参数拖入后，通过双击即可修改统计方式。
- 当所有需要的统计项已加入后，点击 **Batch（批量）** 按钮，即可自动生成所选分组内所有样本的统计表。
![[Pasted image 20251201181803.png]]
>  💡<font color="#de7802">实际应用技巧</font>
> 
> - 建议按 **Group（实验组）** 与 **Sample ID** 进行 Batch 输出，可快速生成用于统计分析的 CSV 或 Excel 文件。
>     
> - 数据导出后可直接用于：
>     - GraphPad Prism（绘图与统计）
>     - R / Python（多维分析、可视化）
>     - SPICE、tSNE、UMAP 进一步深度可视化
>         
> - 表格模板可以保存，适用于大型批次实验复用，提高一致性和效率。

### Layouts（布局与作图）

**Layout Editor（布局编辑器，LE）** 是用于为一个分组内的所有 FCS 文件批量生成图像（plots）的工作区域。你可以将任意细胞群（Populations）或统计参数（Statistics）拖放到布局编辑器中，并根据需要调整排列样式。完成布局后，点击 **Batch（批量生成）** 按钮，FlowJo 将为所选分组内所有样本自动生成对应图像。
![[Pasted image 20251201182859.png]]![[Pasted image 20251201182520.png]]
> 📌<font color="#de7802">补充说明</font> 
> 
> Layout Editor 常用于：
> - 生成 publication-ready（可用于发表）图像，如频率柱状图、散点图、直方图等
> - 制作 gating strategy 示意图（展示门控流程）
> - 为分组样本生成可视化结果比较（如对照 vs 处理组）
> - 导出为 PDF / TIFF / PNG 用于论文、汇报或实验记录

### 保存工作区与模板

可以通过点击 FlowJo 程序左上角图标保存整个工作区，包括：
- **LE（Layout Editor）**
- **TE（Table Editor）**
- 所有门控、注释与补偿设置

FlowJo 提供多种保存方式：
- **Workspace（工作区文件）**：适用于继续分析与多人协作
- **Template（模板）**：适用于重复实验，可自动匹配样本并复用门控策略
- **Archive（归档压缩包）**：包含所有 FCS 文件及工作区（便于备份或分享）
- **Excel Export（Excel 导出）**：导出表格数据用于统计分析
![[Pasted image 20251201183024.png]]
希望本教程能帮助你提高数据处理效率，构建稳定可靠的分析工作流，并在未来的实验与文章中得心应手。在后续的推文中，我们将持续分享更多实战技巧与进阶案例。