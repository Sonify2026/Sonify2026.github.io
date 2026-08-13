---
title: PyMOL批量分析PDB结构的二级结构，自动输出CSV文件！
slug: PyMOL_4
description: 几十个 PDB 要统计二级结构一个个手动跑太麻烦！PyMOL+DSSP 脚本批量解析，一键输出 CSV 表格，省去重复复制粘贴。
category: CADD
tags:
  - "#科研绘图"
  - "#PyMOL"
date: 2026-02-19
draft: false
---
在蛋白质研究中，**二级结构（Secondary Structure）** 是理解蛋白质折叠方式、稳定性和功能的重要因素。二级结构包括**α螺旋（Alpha-helix, H）、β折叠（Beta-strand, S）和无规卷曲（Loop/Coil, L）**，它们决定了蛋白质的整体空间构象，并影响与配体、DNA 或其他蛋白的相互作用。

在实验或计算机模拟（如**分子动力学模拟**）后，我们经常需要分析蛋白的二级结构变化，然而，**手动分析多个 PDB 文件的二级结构不仅费时，还容易出错**。

💡 **今天，我们分享一个Python + PyMOL脚本，它可以自动遍历当前目录下所有 `.pdb` 文件，计算二级结构，并导出 `.csv` 文件，极大提高数据处理效率！** 🚀

### 📌 为什么要自动化二级结构分析？

✅ **批量处理多个PDB文件**，避免手动点击或输入命令  
✅ **准确提取蛋白质二级结构信息**（螺旋、折叠、环结构）  
✅ **导出CSV方便统计和可视化分析**，可直接用于Excel或Python处理  
✅ **适用于分子动力学模拟、结构生物学、药物设计等研究**

**🎯 适用场景：**
- **比较不同蛋白或突变体的二级结构差异**
- **分析蛋白在不同实验条件下的结构变化**（如温度、pH 影响）
- **研究小分子或蛋白-蛋白相互作用对结构的影响**

### 📜 代码解析

#### 1️⃣ 加载 PDB 并计算二级结构

```pyhton
cmd.load(pdb_file, 'structure')  
cmd.dss()  # 运行DSS算法，计算二级结构
```

🔹 `cmd.dss()` 是PyMOL的二级结构计算命令，会在 `ss` 属性中存储二级结构信息。

#### 2️⃣ 读取二级结构数据

```python
def store_ss(chain, resi, resn, ss):
    if ss:  # 只存储有二级结构的残基
        residue_ss[(chain, resi, resn)] = ss

cmd.iterate("structure", "store_ss(chain, resi, resn, ss)", space={"store_ss": store_ss, "residue_ss": residue_ss})
```

🔹 **PyMOL `cmd.iterate()` 直接遍历所有原子**，提取 `ss`（二级结构）信息，并存入 Python 字典，确保每个残基只记录一次。

#### 3️⃣ 输出 CSV

```python
with open(output_csv, 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerow(['Chain', 'Residue Number', 'Residue Name', 'Secondary Structure'])
    
    for (chain, resi, resn), ss in residue_ss.items():
        csv_writer.writerow([chain, resi, resn, ss])
```

🔹 **所有数据都将写入 `.csv` 文件**，方便Excel或其他工具处理！

### 📌 代码完整版

```python
import pymol
from pymol import cmd
import csv
import os

def analyze_secondary_structure(pdb_file, output_csv):
    """分析单个 PDB 文件的二级结构，并保存到 CSV 文件"""
    cmd.reinitialize()  # 重新初始化 PyMOL，避免文件冲突
    cmd.load(pdb_file, 'structure')
    cmd.dss()

    # 存储二级结构信息
    residue_ss = {}

    # 解析二级结构
    def store_ss(chain, resi, resn, ss):
        if ss:  # 只存储有 `ss` 值的残基
            residue_ss[(chain, resi, resn)] = ss

    cmd.iterate("structure", "store_ss(chain, resi, resn, ss)", space={"store_ss": store_ss, "residue_ss": residue_ss})

    # 将数据写入 CSV
    with open(output_csv, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['Chain', 'Residue Number', 'Residue Name', 'Secondary Structure'])

        for (chain, resi, resn), ss in residue_ss.items():
            csv_writer.writerow([chain, resi, resn, ss])

    print(f"Processed {pdb_file} -> {output_csv}")

def batch_process_pdb_files():
    """遍历当前目录所有 .pdb 文件，批量分析并保存结果"""
    pdb_files = [f for f in os.listdir() if f.endswith('.pdb')]
    
    if not pdb_files:
        print("No PDB files found in the current directory.")
        return

    for pdb_file in pdb_files:
        output_csv = pdb_file.replace('.pdb', '_ss.csv')  # 生成对应的 CSV 文件名
        analyze_secondary_structure(pdb_file, output_csv)

# 在 PyMOL 里运行：
# run pdb_ss_analyzer.py
# batch_process_pdb_files()
```

### 💡 运行方法

1️⃣ **将 `pdb_ss_analyzer.py` 放入包含 PDB 文件的文件夹**  
2️⃣ **打开 PyMOL 终端**，运行：

```python
run pdb_ss_analyzer.py
batch_process_pdb_files()
```

3️⃣ **PyMOL 会自动处理所有 `.pdb` 文件**，并在当前目录生成多个 `.csv` 文件，如：

~~~
protein1.pdb  ->  protein1_ss.csv
protein2.pdb  ->  protein2_ss.csv
protein3.pdb  ->  protein3_ss.csv
~~~

假设我们有一个 `protein1.pdb` 文件，运行脚本后会生成 `protein1_ss.csv`，内容如下：

~~~
Chain, Residue Number, Residue Name, Secondary Structure
A, 1, MET, H
A, 2, GLY, H
A, 3, ALA, H
A, 4, THR, L
A, 5, LEU, L
A, 6, ASP, S
A, 7, PHE, S
A, 8, VAL, L
~~~

🔹 **`H`（Helix）：α螺旋结构**  
🔹 **`S`（Strand）：β折叠结构**  
🔹 **`L`（Loop）：无规卷曲**

### 📊 进一步数据分析

导出的CSV文件可以用**Excel、Pandas或R**进行统计分析，例如：
- **统计α螺旋/β折叠/Loop在不同蛋白中的分布比例**
- **比较突变体和野生型的二级结构变化**
- **可视化蛋白二级结构随时间（MD轨迹）的变化趋势**

总的来说，这个**PyMOL + Python自动化脚本** 可以帮助研究人员**高效分析蛋白二级结构**，大大减少手动处理的时间。无论是单个蛋白还是大规模PDB数据集，都可以轻松搞定！💯