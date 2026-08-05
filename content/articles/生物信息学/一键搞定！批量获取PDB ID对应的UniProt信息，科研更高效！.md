---
title: 一键搞定！批量获取PDB ID对应的UniProt信息，科研更高效！
slug: Bioinformatics_4
description: PDB 批量匹配 UniProt 实操，生信批量 ID 转换神器。
category: 生物信息学
tags:
  - Python
  - "#生信分析"
date: 2026-04-10
draft: false
---
## 引言

在生物信息学研究中，蛋白质结构和功能的研究至关重要。结构数据库（如PDB）提供了大量的蛋白质结构信息，但研究人员往往需要从这些结构中获取更详细的功能性数据，而这些数据通常保存在UniProt数据库中。为了简化这一过程，我们可以编写一个Python脚本，用来批量处理多个PDB ID，获取对应的UniProt信息，并将这些信息保存到Excel文件中。

比如我们通过反向分子对接确定潜在的靶点蛋白，通过对接获得了多个PDB ID，就可以使用该脚本快速获取这些蛋白的功能性信息，如蛋白质名称、基因名称和物种等。

## 代码详解

首先先提供完整的代码，下面是详细的代码及其说明：

```python
import requests
import pandas as pd
from xml.etree import ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed

# 从PDB ID获取UniProt ID
def get_uniprot_id_from_pdb(pdb_id):
    url = f"https://data.rcsb.org/rest/v1/core/polymer_entity/{pdb_id}/1"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        identifiers = data.get('rcsb_polymer_entity_container_identifiers', {})
        uniprot_ids = identifiers.get('uniprot_ids', [])
        return uniprot_ids
    else:
        print(f"Error fetching data for PDB ID {pdb_id}: {response.status_code}")
        return None

# 获取详细的UniProt信息
def get_uniprot_info(pdb_id, uniprot_id):
    url = f"https://www.uniprot.org/uniprot/{uniprot_id}.xml"
    response = requests.get(url)
    if response.status_code == 200:
        root = ET.fromstring(response.content)
        info = {
            'PDB ID': pdb_id,
            'UniProt ID': uniprot_id,
            'Entry Name': None,
            'Protein Name': None,
            'Organism': None,
            'Gene Names': []
        }
        entry_name = root.find(".//{http://uniprot.org/uniprot}name")
        if entry_name is not None:
            info['Entry Name'] = entry_name.text
        protein_name = root.find(".//{http://uniprot.org/uniprot}protein//{http://uniprot.org/uniprot}recommendedName//{http://uniprot.org/uniprot}fullName")
        if protein_name is not None:
            info['Protein Name'] = protein_name.text
        organism = root.find(".//{http://uniprot.org/uniprot}organism//{http://uniprot.org/uniprot}name[@type='scientific']")
        if organism is not None:
            info['Organism'] = organism.text
        gene_names = root.findall(".//{http://uniprot.org/uniprot}gene//{http://uniprot.org/uniprot}name")
        for gene_name in gene_names:
            info['Gene Names'].append(gene_name.text)
        return info
    else:
        print(f"Error fetching data for UniProt ID {uniprot_id}: {response.status_code}")
        return None

# 处理单个PDB ID
def process_pdb_id(pdb_id):
    uniprot_info_list = []
    uniprot_ids = get_uniprot_id_from_pdb(pdb_id)
    if uniprot_ids:
        for uniprot_id in uniprot_ids:
            uniprot_info = get_uniprot_info(pdb_id, uniprot_id)
            if uniprot_info:
                uniprot_info_list.append(uniprot_info)
    return uniprot_info_list

# 从Excel文件中批量处理PDB ID
def process_pdb_ids_from_excel(input_excel_file, output_excel_file):
    pdb_df = pd.read_excel(input_excel_file)
    pdb_ids = pdb_df['PDB ID'].tolist()
    uniprot_info_list = []

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(process_pdb_id, pdb_id): pdb_id for pdb_id in pdb_ids}
        for future in as_completed(futures):
            pdb_id = futures[future]
            try:
                uniprot_info_list.extend(future.result())
            except Exception as e:
                print(f"Error processing PDB ID {pdb_id}: {e}")

    df = pd.DataFrame(uniprot_info_list)
    df = df.explode('Gene Names')
    df.to_excel(output_excel_file, index=False)
    print(f"Data has been written to {output_excel_file}")

# 使用示例
input_excel_file = 'pdb_ids.xlsx'  # 输入Excel文件路径
output_excel_file = 'uniprot_info.xlsx'  # 输出Excel文件路径
process_pdb_ids_from_excel(input_excel_file, output_excel_file)

```

## 功能概述

1. **读取输入Excel文件**：从Excel文件中读取包含PDB ID的列。
2. **获取UniProt ID**：通过访问RCSB PDB API，将每个PDB ID转换为对应的UniProt ID信息。
3. **获取UniProt详细信息**：通过访问UniProt API，获取每个UniProt ID的详细信息，包括Entry Name、Protein Name、Organism和Gene Names。
4. **多线程处理**：使用多线程加速多个PDB ID的处理。
5. **保存结果到Excel文件**：将最终结果保存到一个新的Excel文件中。

## 使用方法

### 1. 安装依赖库

确保你已经安装了以下Python库：
- requests
- pandas
- openpyxl
- concurrent.futures（Python内置，无需安装）

使用以下命令安装所需库：

`pip install requests pandas openpyxl`

### 2. 准备输入文件

输入文件应为Excel格式（例如`.xlsx`），并且包含一列名为`PDB ID`，该列中的每一行都是一个PDB ID。例如：
![[Pasted image 20240802102257.png]]
### 3. 修改脚本参数

在脚本中设置输入和输出文件路径：

```python
input_excel_file = 'pdb_ids.xlsx'  # 替换为你的输入Excel文件路径
output_excel_file = 'uniprot_info.xlsx'  # 替换为你希望的输出Excel文件名
```

### 4. 运行脚本

将以上代码保存为一个Python文件，例如`pdb_to_uniprot.py`，并运行该脚本。脚本运行完成后，会在指定的输出文件路径生成一个新的Excel文件，包含PDB ID、UniProt ID、条目名称、蛋白质名称、物种和基因名称等信息。

#### 小贴士

**多线程处理**：脚本使用了多线程技术来加速处理多个PDB ID。你可以根据自己的计算机性能调整线程数量（`max_workers`参数）。

通过以上步骤，我们可以轻松地从多个PDB ID中获取详细的UniProt信息，并将这些信息保存到Excel文件中，为研究提供便利。如果你在使用过程中有任何问题或建议，欢迎留言讨论。