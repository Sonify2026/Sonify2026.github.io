---
title: 在UCSC快速提取基因启动子序列（Promoter）
slug: Bioinformatics_3
description: 做转录调控必备！UCSC提取启动子全流程
category: 生物信息学
tags:
  - "#生信分析"
date: 2026-03-31
draft: false
---
做转录调控、ChIP-seq、报告基因实验的同学，一定绕不开一个核心问题：**如何准确获取目标基因的启动子序列？** 上期内容为大家介绍了[[如何在NCBI精准获取基因启动子（Promoter）序列？]]，今天再继续为分享另一种方法，用**UCSC Genome Browser**搞定基因启动子序列查询，科研效率直接拉满⚡

### ✅ Step 1：进入UCSC Genome Browser 数据库

**UCSC Genome Browser** 是由 University of California, Santa Cruz 基因组研究团队开发的一个**综合性基因组信息整合与可视化平台**。它的核心功能可以概括为：**将基因组序列 + 多组学注释 + 公共数据库数据进行统一整合，并以“轨道（tracks）”形式可视化展示**。

进入首页：https://genome.ucsc.edu/index.html
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-1.png]]
### ✅ Step 2：定位基因组区域

在搜索框中输入目标基因名称，我们以 `TP53` 为例，点击 `Search` 按钮进行检索，会进入下图所示的**Search Results 页面**；

页面顶部图中红框部分为 **“MANE Select Plus Clinical”**，这是当前最推荐使用的转录本来源：
- ✔ 由 RefSeq + GENCODE 联合定义
- ✔ 保证临床与研究一致性
- ✔ 每个基因通常只有一个“标准转录本”

📌 对于TP53：该条目代表“标准参考转录本”，适用于大多数分析（包括启动子提取）。在该页面中选择 `TP53 - chr17:7668421-7687490`；
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-2.png]]
此时进入了基因浏览器页面，该页面的顶部信息栏分别展示了标题（标明了参考基因组版本）、功能（缩放、移动基因组显示位置）、基因组位置坐标及长度以及染色体条带图。
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-3.png]]
信息栏下方为**基因结构轨道**，这里包含了多个数据库的信息。其中 `GENCODE / RefSeq Tracks` 中的蓝色结构分别表示：
- **粗块 → exon（外显子）
- **细线 → intron（内含子）
- **箭头方向** → 转录方向（strand）

👉 在本例中 TP53 的箭头是 **←（向左）**，表明 TP53 位于 **负链（minus strand）**。
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-4.png]]
### ✅ Step 3：提取上游序列（Promoter）

接下来在基因浏览器页面中点击 `TP53`;
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-7.png]]
在新打开的GENCODE详情页的 `Sequence and Links to Tools and Databases ` 是**用于提取序列的入口**，点击 `Genomic Sequence (chr17:7,668,421-7,687,490)` 进入序列提取页面；
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-6.png]]
下面选择启动子区，在 `Get Genomic Sequence Near Gene` 中填写 `Promoter/Upstream by 2000 bases`，表示以 **TSS（转录起点）为基准**向“上游”提取 **2000 bp**，系统自动计算 promoter 区域。

在本例中TP53 是 **负链基因**，UCSC会向右取上游序列。

参数设置完成后，点击 `Submit` 按钮进行序列提取。
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-8.png]]
在新打开的页面中就可以得到启动子序列信息，可以看到和我们上期在NCBI获取到的序列是一致的。
![[在UCSC快速提取基因启动子序列（Promoter）-20260325-9.png]]
以上就是本期关于在UCSC快速提取基因启动子序列的全部内容了。如果对你有所帮助，欢迎点赞、收藏或转发，也可以留言交流你的问题或研究需求，我们下期再见 👋