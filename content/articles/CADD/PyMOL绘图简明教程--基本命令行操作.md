---
title: PyMOL绘图简明教程--基本命令行操作
slug: PyMOL_2
description: 不想点点点鼠标？学会 PyMOL 基础命令，绘图全程脚本化，图片可复现，方便重复实验与论文作图。
category: CADD
tags:
  - "#科研绘图"
  - "#PyMOL"
date: 2026-02-25
draft: false
---
PyMOL 是一款广泛应用于结构生物学、药物设计与计算化学领域的分子可视化软件，适用于绘制**小分子结构**及**生物大分子（尤其是蛋白质）三维结构图像**。在正式发表的结构生物学文献中，约有四分之一的蛋白质结构图像使用 PyMOL 制作，其高质量渲染能力已成为科研绘图的行业标准。

在后续推文中，我们将系统介绍 PyMOL 的进阶绘图技巧。上期内容我们为大家分享了PyMOL使用的基本鼠标操作，今天这期内容为大家介绍PyMOL的基本命令行操作。

#### 1.命令输入窗口

PyMOL的命令输入窗口可供命令输入，位于软件界面底部，如下图所示：

![[PyMOL绘图简明教程--基本命令行操作-20260224-1.png]]

#### 2.查看与切换工作目录

默认打开和保存文件，都是在工作目录中，建议修改工作目录以便查看和导入项目更加方便。  

查看当前工作目录，命令如下：  

```
PyMOL>pwd
```

修改工作目录，如修改工作目录为E盘下面的PyMOL文件夹：  

```
PyMOL>cd E:/PyMOL
```

#### 3.载入数据

可以从文件中载入PDB，语法为：

```
load data-file-name
```

例如：  

```
PyMOL>load E:\PyMOL\1fpu.pdb
```

PyMOL支持Tab键命令补全，命令输入后，PyMOL会打开读取“1fpu.pdb”，创建并命名相应的对象，在Viewer中显示图像。  

![[PyMOL绘图简明教程--基本命令行操作-20260224-2.png]]

默认状态下，PyMOL会在文件读取后命名对象，也可以自己重命名对象，语法为：  

```
load data-file-name,object-name
```

例如，将对象重命名为“test”  

```
PyMOL>load E:\PyMOL\1fpu.pdb,test
```

#### 4.下载蛋白

fetch 命令可以根据PDB ID编号下载蛋白结构到工作路径，并载入到PyMOL中显示，例如：

```
fetch 1FPU    #下载PDB ID为1FPU的蛋白结构，文件格式为cif
```

type 支持的文件格式有：cif、mmtf、pdb、pdb1、2fofc、fofc、emd、cid、sid、cc

#### 5.操控对象

##### ① 改变对象的表示形式（representation）

语法为：  

```
hide representation,object-name   #隐藏对象某种样式（不加对象默认为所有）
```

例如：  

```
PyMOL>hide cartoon,test
```

其他的表现形式还有lines、ribbon、dots、sphere、mesh以及surface等。  

当使用show命令时，新的表现形式出现，但原来的表现形式不会消失。

![[PyMOL绘图简明教程--基本命令行操作-20260224-3.png]]

可通过以下命令解决，语法为：  

```
as representation,object-name
```

例如：  

```
PyMOL>as cartoon,test    #不论原来显示多少种表示形式，命令后只显示cartoon一种
```

![[PyMOL绘图简明教程--基本命令行操作-20260224-4.png]]

##### ② 选择目标进行操作 

选择并命名目标，语法为：  

```
select selection-name,selection-expression
```

例如：  

```
PyMOL>select s1,resi 300+301   #选择序号为300和301的残基，并命名为s1
```

对目标进行居中并放大显示，语法为：  

```
zoom selection-name   #也可直接用selection-expression代替selection-name
```

例如：  

```
PyMOL>zoom s1   #对已命名为s1的对象进行放大
```

![[PyMOL绘图简明教程--基本命令行操作-20260224-5.png]]

删除目标，语法为：  

```
delete selection-name   #删除了selection-name,其对应得数据仍然存在，只是不再组织起来
```

例如：  

```
PyMOL>delete s1   #只删除s1的组织形式，对应的原子和化学键仍然存在
```

##### ③ 对象和选择的着色

语法为：  

```
color color-name,selection-expression    #对selection进行着色，不加选择则整个object被着色
```

例如：  

```
PyMOL>color white     #对所有对象着色
```

![[PyMOL绘图简明教程--基本命令行操作-20260224-6.png]]

##### ④ 对象和选择的可见/隐藏

语法为：  

```
enable object-name     #使对象可见
```

例如：  

```
PyMOL>enable 1fpu     #1fpu可见
```

#### 6.选择表达式

选择表达（selection-expression）表示的是一些被选中的部分，它们可以是一些原子、残基、Helix等，或者它们的混合物。选择表达由“selector”和“identifier”组成，其中“selector”定义了某类属性，而“identifier”则定义了在该属性下需要被选择的部分。  

下表为常用的selector类型：

|          |     |                                                                                                                                                   |
| -------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selector | 简写  | ldentifier及例子                                                                                                                                     |
| symbol   | e.  | chemical-symbol-list，周期表中的元素符号<br><br>Pymol>select polar，symbol o+n                                                                               |
| name     | n.  | atom-name-list，pdb文件中的原子名字<br><br>Pymol>select carbons，name ca+cb+cg+cd                                                                           |
| resn     | r.  | residue-name-list，氨基酸的名字<br><br>Pymol>select aas，resn asp+glu+asn+gln                                                                             |
| resi     | i.  | residue-identifier-list，pdb文件中基团的编号<br><br>Pymol>select mults10，resi 1+10+100<br><br>residue-identifier-range<br><br>Pymol>select nterm，resi 1-10 |
| chain    | c.  | chain-identifier-list，一些单字母或数字的列表<br><br>Pymol>select firstch，chain a                                                                             |
| segi     | s.  | segment-identifier-list，一些字母（最多4位）的列表<br><br>Pymol> select ligand，segi lig                                                                        |
| ss       | ss  | secondary-structure-type，代表该类结构的单字母<br><br>Pymol>select allstrs，ss h+s+l+""                                                                       |

在选择表达中，selector还可以配合逻辑操作子（logical operator）使用，这样可以表达更加复杂的选择，下表为常用的操作子：  

|   |   |   |
|---|---|---|
|Operator|简写|效果与例子|
|not s1|! s1|选择原子但不包括s1中的原子<br><br>Pymol>select sidechains,! bb|
|s1 and s2|s1 & s2|选择既在s1又在s2中的原子<br><br>Pymol>select far_bb,bb & farfrm_ten|
|s1 or s2|s1 \| s2|选择s1或者s2中的原子（也就是包含全部的s1和s2原子）<br><br>Pymol>select all_prot，bb l sidechain|
|s1 in s2|s1 in s2|选择s1中的那些原子，其identifiers（name，resi，resn，chain，segi）全部符合s2中对应的原子<br><br>Pymol>select same_atom，pept in prot|
|s1 like s2|s1 l. s2|选择s1中的那些原子，其identifiers（name，resi）符合s2中对应的原子<br><br>Pymol>select similar_atom，pept like prot|
|s1 around X|s1 a. X|选择以s1中任何原子为中心，X为半径，所包括的所有原子<br><br>Pymol>select near_ten，resi 10 around 5|
|s1 expand X|s1 e. X|选择以s1中任何原子为中心，X为半径，然后把s1扩展至该新的范围所包含的所有原子<br><br>Pymol>select near_ten_x，near 10 expand 3|
|s1 within Xof s2|s1 w. X of s2|选择以s2为中心，X为半径，并包含在s1中的原子<br><br>Pymol>select bbnearten，bb w. 4 of resi 10|
|neighbor s1|nbr. s1|选择直接和s1相连的原子<br><br>Pymol>select vicinos，nbr. resi 10|

这些逻辑选择还可以组合使用，如：  

```
PyMOL>select chain b and (not resi 88)    #选择chain b但不选择其中的88号残基
```

#### 7.参数设置

可以通过“set”来改变设置，例如:

```
PyMOL>set cartoon_color,green     #cartoon颜色显示为绿色
PyMOL>set cartoon_oval_width,0.2     #cartoon厚度设置为0.2
PyMOL>set cartoon_transparency,0.5     #cartoon透明度设置为0.5
PyMOL>set surface_color,red     #设置表面的颜色为红色
PyMOL>set label_size,14     #label大小设置为14
PyMOL>set label_font_id,5     #label字体设置为id为5的字体
PyMOL>set label_position,(x,y,z)     #设置label离默认位置的三维偏移值
PyMOL>set label_digits,2     #设置label的小数点位数为2位
PyMOL>set valence,1     #开启双键模式
PyMOL>set valence,0     #关闭双键模式
PyMOL>set mesh_radius,0.2     #设置mesh的粗细为0.2
PyMOL>set sphere_scale,0.5     #设置小球的大小
```

#### 8.保存图片

保存图片前，可先进行渲染，语法为：  

```
ray x,y     #光线追踪，图片分辨率为x×y，不输入分辨率则默认为当前窗口大小
```

例如：  

```
ray 1024，480
```

保存图片，语法为：  

```
png file-name
```

例如：  

```
PyMOL>png test.png
```

以上就是为大家分享的PyMOL基本命令行操作教程啦~