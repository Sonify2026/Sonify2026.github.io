---
title: 在PyMOL中使用DSSP解析蛋白质二级结构！
slug: PyMOL_3
description: PyMOL 调用 DSSP 进行蛋白质二级结构指派，讲解 DSSP 安装、运行、二级结构重新赋值、显示与导出，解决 PDB 自带二级结构注释错误，获得准确的 α‑螺旋、β‑折叠、无规卷曲注释。
category: CADD
tags:
  - "#科研绘图"
  - "#PyMOL"
date: 2026-02-20
draft: false
---
在 **PyMOL** 中，蛋白质二级结构通常可以通过两种方式计算：
1️⃣ **PyMOL 内置 `dss` 命令**  
2️⃣ **DSSP 标准算法（需安装外部程序并通过插件或脚本调用）**

两者在**计算原理、一致性和适用场景**上存在差异，本期内容就为大家系统梳理这两种方法的使用方式及推荐场景。

### 1️⃣ PyMOL内置 `dss` 命令

#### 🔹 运行方式

在 PyMOL 命令行输入：

```text
dss
```

即可对当前对象重新计算并更新二级结构。
也可以指定对象或选择：

```text
dss object_name
```

#### 🔹 计算原理

- `dss` 基于**主链几何特征**与**氢键模式/几何判据**进行二级结构赋值。
- 属于**启发式快速算法**，主要用于结构可视化。
- 不依赖外部程序，直接在 PyMOL 内部完成计算。

需要注意的是：`dss` 的实现目标偏向**快速与显示友好**，其结果**不保证与 DSSP 或 PDB 官方注释完全一致**。

#### 🔹 主要优缺点

✅ **优点**：  
✔ **无需外部软件**，PyMOL内置，开箱即用。  
✔ **计算速度快**，适合快速查看或批量可视化处理。

❌ **局限性**
✖ 与 DSSP 标准结果可能存在差异  
✖ 在边界区域、无序区域或复杂 β-片层中可能与标准算法不一致  
✖ 不适合作为发表级标准二级结构定义

### 2️⃣ DSSP（标准算法）

DSSP（Define Secondary Structure of Proteins）是结构生物信息学中广泛使用的**标准化二级结构赋值算法**。

在 PyMOL 中通常需要：
- 安装外部 DSSP 可执行程序
- 通过插件或脚本调用该程序

#### Windows 示例：通过 DSSP 插件运行

##### ① 插件下载

- 从以下地址下载**DSSP Stride**插件脚本：https://ouchidekaiseki.com/dssp_stride.py，文件保存为`dssp_stride.py`;
- 从以下地址下载**DSSP可执行程序**：https://sourceforge.net/projects/pymod/files/third%20party/win32/dssp-2.0.4-win32.exe/download

##### ② 安装插件

- 打开PyMOL后，通过`Plugin - > Plugin Manager - > Install New Plugin - > Choose file...`选择下载好的`dssp_stride.py`文件来安装插件；

![[Pasted image 20250204135130.png]]

- 收到安装成功的提示后，重启PyMOL，可以在`Plugin - > Legacy Plugins - > DSSP Stride`启动插件。

![[Pasted image 20250204135434.png]]

##### ③ DSSP分析二级结构

- 在PyMOL中导入需要分析的蛋白结构，在`Plugin - > Legacy Plugins - > DSSP Stride`启动插件；
- 在`PyMOL selection/object`中指定需要分析的对象；
- 在`DSSP binary`中指定前面下载好的`dssp-2.0.4-win32.exe`程序路径；

![[Pasted image 20250204135748.png]]

- 点击`Run DSSP`按钮即可使用DSSP对二级结构进行分析，点击`Update ss`按钮可根据DSSP的结果改变二级结构；

![[Pasted image 20250204140246.png]]

- 还可以通过`Update color`按钮更改二级结构的颜色。

![[Pasted image 20250204140401.png]]
![[Pasted image 20250204140416.png]]

#### 🔹 计算原理

DSSP 的核心思想：
- 基于**主链氢键模式识别**
- 结合几何和能量阈值判定二级结构类型
- 按严格规则定义 α-螺旋、β-折叠、turn、bend 等结构

DSSP 的二级结构定义：在结构生物信息学中被广泛采用，常作为科研论文和数据库分析的对齐标准

#### 🔹 主要优缺点

✅ **优点**
✔ 结果标准化程度高  
✔ 与数据库和文献使用口径一致  
✔ 适合发表级结构分析  
✔ 在复杂氢键网络中更稳定

❌ **缺点**
✖ 需要额外安装外部程序  
✖ 配置稍复杂  
✖ 计算速度略慢于 `dss`（但通常影响不大）

### 🎯 总结

✔ **只做结构可视化、快速查看：使用 `dss` 即可**
✔ **用于论文发表、标准化统计分析或数据库一致性研究：建议使用 DSSP**