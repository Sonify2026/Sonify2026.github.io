---
title: 如何在NCBI精准获取基因启动子（Promoter）序列？
slug: Bioinformatics_1
description: 在NCBI中获取启动子序列的关键不在“找”，而是在“理解”。
category: 生物信息学
tags:
  - "#生信分析"
date: 2026-03-25
draft: false
---
**启动子（Promoter）** 是位于基因**转录起始位点（TSS）上游**的一段DNA序列，是RNA聚合酶和转录因子结合的区域。在基因调控研究、转录因子预测、报告基因实验（如Luciferase assay）中，**启动子序列**是最基础也是最关键的素材之一。本期内容为大家分享如何在NCBI数据库中查询基因的启动子序列。

### ✅ Step 1：进入NCBI Gene数据库

首先进入NCBI主页，选择 `Gene` 数据库，在搜索框中输入基因名称，这里以 `TP53` 为例，输入后点击 `Search` 按钮进行检索；
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-1.png]]
### ✅ Step 2：定位基因组区域

在检索结果中找到目标基因，要注意种属，这里我们选择 `Homo sapiens (human)` ，即人类；点击基因名称来查看详细信息；
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-2.png]]
在“**Genomic context（基因组定位信息）**”模块，可以看到目的基因在不同参考基因组中的精确坐标信息，也就是：“这个基因在染色体哪里？方向是什么？范围是多少？”
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-3.png]]
👉 <mark style="background:#fff88f">Location: 17p13.1</mark>：染色体细胞遗传学位置
- **17** → 第17号染色体
- **p** → 短臂（q是长臂）
- **13.1** → 区域细分

👉 <mark style="background:#fff88f">Exon count: 13</mark>：这个基因有 **13个外显子**（TSS通常在第一个外显子附近）

表格的含义为：

|字段|含义|
|---|---|
|Annotation release|注释版本|
|Status|是否当前版本|
|Assembly|基因组版本|
|Chr|染色体|
|Location|精确坐标|

本例中 <mark style="background:#fff88f">GRCh38.p14（GCF_000001405.40）</mark> 为人类主流参考基因组，与大多数数据库一致，推荐使用。

👉 <mark style="background:#fff88f">NC_000017.11 (7668421..7687490, complement) </mark>这是我们需要重点关注的信息：
- NC_000017.11 染色体的RefSeq编号；
- 7668421..7687490 表示基因在染色体上的范围，起点为7668421，终点为7687490，单位是bp（碱基）；
- complement 表示该基因在负链（reverse strand），必须取**反向互补序列**

💡 需要注意区分基因为正链还是负链。==正链TSS位置在起点，promoter方向往左（上游）负链TSS位置在终点，promoter方向往右（上游）==。

本例中**基因范围：7668421 → 7687490（负链）**，如果取 -2000 bp promoter，那么上游2000bp的序列位置为7687490 + 2000，即7689490；

接下来查看“**Genomic regions, transcripts, and products**”模块，注意 `Genomic Sequence` 参考基因组版本要与上一步中一致，然后点击 `FASTA` 按钮显示母的基因序列；
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-4.png]]
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-5.png]]
### ✅ Step 3：提取上游序列（Promoter）

下面在 `Change region shown` 的 `Selected region` 选项中手动输入序列位置， 启动子区一般取基因上游2000bp区域内比较稳妥，也就是我们上步骤中计算得到的数值，`from 7687490 to 7689490`;

此外，本例中目标基因在负链上，所在需要勾选 `Show reverse complement` 选项，如果基因在正链上，则要确定不勾选。
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-6.png]]
设置完成后，点击 `Update View` 按钮，左侧界面即显示为启动子序列了。
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-7.png]]
点击 `Send to` 按钮，可以将序列保存为FASTA格式，可以使用记事本打开，以保存待后续使用。
![[如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-8.png]]
以上就是本期关于在NCBI中获取基因启动子序列的全部内容了。如果对你有所帮助，欢迎点赞、收藏或转发，也可以留言交流你的问题或研究需求，我们下期再见 👋