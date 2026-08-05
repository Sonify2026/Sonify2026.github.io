// 此文件由 npm run generate:posts 自动生成，请勿手动编辑。
import type { Post, TagSummary } from "./post-types";

export const posts: Post[] = [
  {
    "slug": "colocalization-scatter-plot",
    "title": "快速绘制共定位散点图：一分钟搞定细胞内信号分布分析！",
    "description": "共定位散点图是一种可视化技术，用于展示两种不同信号在图像中的空间相关性。",
    "category": "细胞生物学",
    "tags": [
      "Python",
      "数据分析",
      "科研绘图"
    ],
    "date": "2026-07-12",
    "dateLabel": "2026.07.12",
    "readingTime": "3 分钟阅读",
    "toc": [
      {
        "id": "引言",
        "text": "引言",
        "level": 2
      },
      {
        "id": "代码详解",
        "text": "代码详解",
        "level": 2
      },
      {
        "id": "功能概述",
        "text": "功能概述",
        "level": 2
      },
      {
        "id": "使用方法",
        "text": "使用方法",
        "level": 2
      },
      {
        "id": "1-准备输入文件",
        "text": "1. 准备输入文件",
        "level": 3
      },
      {
        "id": "3-修改脚本参数",
        "text": "3. 修改脚本参数",
        "level": 3
      },
      {
        "id": "4-运行脚本",
        "text": "4. 运行脚本",
        "level": 3
      }
    ],
    "html": "<h2 id=\"引言\">引言</h2>\n<p>共定位散点图是一种可视化技术，用于展示两种不同信号在图像中的空间相关性。它通过将两个图像的像素强度值绘制在散点图上，帮助我们理解这些信号是否在相同的空间区域出现，以及它们的相关性强度。这在生物医学领域特别有用，比如研究抗癌药物对细胞内蛋白质分布的影响，或者分析不同荧光标记的分子在细胞中的共定位情况。</p>\n<p>本期内容小编为大家分享快速使用Python实现共定位散点图的绘制方法。通过我们分享的这段代码，可以读取两张图像，提取其像素亮度值，计算它们的相关性，并绘制出漂亮的共定位散点图，同时提供拟合线和颜色条的选项。</p>\n<h2 id=\"代码详解\">代码详解</h2>\n<h4>第一步：导入所需库</h4>\n<p>首先，我们需要导入一些Python库，这些库将帮助我们处理图像和绘制图表。</p>\n<pre><code class=\"language-python\">import numpy as np\nimport matplotlib.pyplot as plt\nfrom PIL import Image\nfrom matplotlib.colors import LinearSegmentedColormap\nfrom scipy import stats\n</code></pre>\n<h4>第二步：定义绘图函数</h4>\n<p>接下来，我们定义一个函数<code>plot_scatter_with_fit</code>，这个函数会读取两张图片，提取它们的亮度值，计算相关性，并绘制散点图。</p>\n<pre><code class=\"language-python\">def plot_scatter_with_fit(pic1, pic2, step_size=1, fit=1, colorbar=1):\n    # 读取图片并转换为灰度图像\n    img1 = Image.open(pic1).convert(&#39;L&#39;)\n    img2 = Image.open(pic2).convert(&#39;L&#39;)\n\n    # 提取像素亮度值\n    intensity1 = np.array(img1).flatten()\n    intensity2 = np.array(img2).flatten()\n\n    # 计算皮尔逊相关系数\n    pearson_corr = np.corrcoef(intensity1, intensity2)[0, 1]\n    print(f&quot;Pearson Correlation Coefficient: {pearson_corr:.4f}&quot;)\n\n    # 对数据进行分箱处理并取平均值\n    smoothed1 = [np.mean(intensity1[i:i+step_size]) for i in range(0, len(intensity1), step_size)]\n    smoothed2 = [np.mean(intensity2[i:i+step_size]) for i in range(0, len(intensity2), step_size)]\n\n    # 初始化计数矩阵\n    scatter = np.zeros((256, 256), dtype=np.int32)\n    points = np.column_stack((smoothed1, smoothed2))\n    for val1, val2 in points:\n        scatter[int(val1), int(val2)] += 1\n\n    # 对数变换和归一化\n    log_scatter = np.log1p(scatter)\n    normalized_log_scatter = log_scatter / np.max(log_scatter)\n\n    # 自定义颜色映射\n    cmap_colors = [(1, 1, 1), (0, 0, 1), (1, 0, 0), (1, 1, 0.12)]\n    custom_cmap = LinearSegmentedColormap.from_list(&#39;custom_cmap&#39;, cmap_colors, N=256)\n\n    # 绘制散点图\n    plt.figure(figsize=(8, 6) if colorbar == 1 else (6, 6))\n    x, y = np.meshgrid(np.arange(256), np.arange(256))\n    plt.scatter(x, y, c=normalized_log_scatter.T.flatten(), cmap=custom_cmap, s=40, alpha=0.8, edgecolors=&#39;face&#39;)\n\n    # 绘制拟合线\n    if fit == 1:\n        slope, intercept, r_value, p_value, std_err = stats.linregress(smoothed1, smoothed2)\n        fit_line_eq = slope * np.array(smoothed1) + intercept\n        plt.plot(smoothed1, fit_line_eq, color=&#39;Purple&#39;, linewidth=1)\n\n    # 添加颜色条\n    if colorbar == 1:\n        plt.colorbar(label=&#39;Frequency&#39;)\n\n    # 设置坐标轴标签和范围\n    plt.xlabel(&#39;Pixel Intensity of Pic1&#39;)\n    plt.ylabel(&#39;Pixel Intensity of Pic2&#39;)\n    x_percentile = np.percentile(smoothed1, 95)\n    y_percentile = np.percentile(smoothed2, 95)\n    new_max = max(x_percentile, y_percentile)\n    plt.xlim(0, new_max)\n    plt.ylim(0, new_max)\n    plt.show()\n</code></pre>\n<h4>第三步：调用函数</h4>\n<p>最后，我们调用这个函数来生成共定位散点图。在这里，我们使用两张图片<code>red.jpg</code>和<code>green.jpg</code>。</p>\n<pre><code class=\"language-python\">plot_scatter_with_fit(&#39;red.jpg&#39;, &#39;green.jpg&#39;, step_size=1, fit=1, colorbar=1)\n</code></pre>\n<h2 id=\"功能概述\">功能概述</h2>\n<p>读取两张图片，提取第一张图片和第二张图片的通道的亮度值，计算它们之间的相关性。 将数据进行分箱处理，绘制散点图，并根据参数决定是否绘制拟合线和显示颜色条。 </p>\n<p><strong>下面是主要的参数，可以根据需要修改代码中的相关参数实现需要的效果</strong>：</p>\n<ul>\n<li><code>pic1</code>：str，第一张图片的文件路径。</li>\n<li><code>pic2</code>：str，第二张图片的文件路径。 </li>\n<li><code>step_size</code>：int，分箱处理的步长。</li>\n<li><code>fit</code>：int，是否绘制拟合线，1表示绘制，0表示不绘制。 </li>\n<li><code>colorbar</code>：int，是否显示颜色条，1表示显示，0表示不显示。</li>\n</ul>\n<h2 id=\"使用方法\">使用方法</h2>\n<h3 id=\"1-准备输入文件\">1. 准备输入文件</h3>\n<p>输入文件需要准备两张图像，如本例中我们使用两张图片<code>red.jpg</code>和<code>green.jpg</code>分别为细胞的红色和绿色荧光图像：</p>\n<p><img src=\"/images/green.jpg\" alt=\"300\">\n<img src=\"/images/red.jpg\" alt=\"300\"></p>\n<h3 id=\"3-修改脚本参数\">3. 修改脚本参数</h3>\n<p>在脚本中设置输入文件路径和绘图参数：</p>\n<pre><code class=\"language-python\">plot_scatter_with_fit(&#39;red.jpg&#39;, &#39;green.jpg&#39;, step_size=1, fit=1, colorbar=1)  # 替换为你的输入图像文件路径，设置相关参数\n</code></pre>\n<h3 id=\"4-运行脚本\">4. 运行脚本</h3>\n<p>将以上代码保存为一个Python文件，例如<code>Colocalization_scatter_plot.py</code>，并运行该脚本。脚本运行完成后，会生成一张共定位散点图。如下所示：</p>\n<p><img src=\"/images/Figure_1.png\" alt=\"Figure_1.png\"></p>\n<p>通过以上代码，你可以轻松地生成两张图像的共定位散点图，并分析它们的相关性。希望这篇推文能帮助你更好地理解和应用共定位散点图技术。如果你有任何问题或建议，欢迎在评论区留言哦！</p>\n"
  },
  {
    "slug": "protocol-1",
    "title": "细胞热转移实验（CETSA）：从原理到实操的系统解析",
    "description": "CETSA 细胞热迁移实验原理、实操、避坑要点全方位解析。",
    "category": "细胞生物学",
    "tags": [
      "实验方案",
      "CETSA"
    ],
    "date": "2026-05-12",
    "dateLabel": "2026.05.12",
    "readingTime": "8 分钟阅读",
    "toc": [
      {
        "id": "细胞热转移实验cellular-thermal-shift-assay-cetsa原理",
        "text": "细胞热转移实验（Cellular Thermal Shift Assay, CETSA）原理",
        "level": 2
      },
      {
        "id": "实验步骤",
        "text": "实验步骤",
        "level": 2
      },
      {
        "id": "1-细胞培养及化合物处理",
        "text": "1. 细胞培养及化合物处理",
        "level": 3
      },
      {
        "id": "2-细胞悬液制备及热处理",
        "text": "2. 细胞悬液制备及热处理",
        "level": 3
      },
      {
        "id": "3-对细胞进行热处理",
        "text": "3. 对细胞进行热处理",
        "level": 3
      },
      {
        "id": "4-从热处理后的细胞中获取可溶性组分并制备用于免疫印迹分析的裂解液",
        "text": "4. 从热处理后的细胞中获取可溶性组分，并制备用于免疫印迹分析的裂解液",
        "level": 3
      },
      {
        "id": "文献案例",
        "text": "文献案例",
        "level": 2
      },
      {
        "id": "参考资料",
        "text": "参考资料",
        "level": 2
      }
    ],
    "html": "<h2 id=\"细胞热转移实验cellular-thermal-shift-assay-cetsa原理\">细胞热转移实验（Cellular Thermal Shift Assay, CETSA）原理</h2>\n<p>细胞热转移实验（CETSA）是一种<strong>基于蛋白质热稳定性变化来评估小分子化合物与靶蛋白相互作用的技术</strong>。其核心理论基础来源于蛋白质在受热条件下发生构象变化并最终变性沉淀的物理化学特性。当温度逐渐升高时，蛋白质的三级和二级结构被破坏，疏水核心暴露，导致分子间相互作用增强并形成不可溶的聚集体。不同蛋白具有特定的热变性温度（melting temperature, Tm），这一参数反映了蛋白质结构稳定性的本征属性。</p>\n<p>当小分子配体与目标蛋白结合后，通常会<strong>改变蛋白的构象稳定性，从而引起其热变性行为的变化</strong>。最常见的情况是配体结合提高蛋白的热稳定性，使其在更高温度下仍保持可溶状态；也存在少数情况下配体结合导致蛋白稳定性下降。CETSA正是利用这一“配体诱导稳定性改变”的现象，通过比较不同处理条件下蛋白在一系列温度梯度中的可溶性分布，来间接反映化合物是否与目标蛋白发生结合。</p>\n<p>在实验操作层面，CETSA通常在<strong>完整细胞或细胞裂解液中进行</strong>。完整细胞体系能够更真实地反映体内环境，包括膜通透性、代谢过程以及蛋白复合体状态等因素，因此在药物作用机制研究中具有重要价值。实验中，细胞首先与待测化合物孵育，使潜在的蛋白-配体相互作用充分发生。随后将样品分装并暴露于一系列递增温度。加热后，发生变性的蛋白会形成不溶性聚集体，而未变性的蛋白则保持在可溶状态。通过离心分离可溶与不溶组分，并对上清中的目标蛋白进行检测（通常采用免疫印迹或质谱分析），即可获得蛋白在不同温度下的稳定性曲线。</p>\n<p>通过绘制蛋白可溶性随温度变化的曲线，可以得到其表观熔解曲线，并进一步计算熔解温度（Tm）。在存在配体的条件下，<strong>Tm的变化（ΔTm）可作为判断结合事件的重要指标</strong>。此外，在固定温度条件下，通过改变配体浓度（即isothermal dose-response CETSA），还可以获得剂量依赖关系，从而用于估算结合亲和力。</p>\n<p>CETSA的理论框架与差示扫描荧光法（DSF）或热位移分析（thermal shift assay）具有相似性，但其显著优势在于<strong>可在细胞内环境中直接评估靶标结合，而无需对蛋白进行纯化</strong>。这一特点使其成为连接体外生化实验与体内药效评价之间的重要桥梁。总体而言，CETSA通过将蛋白热力学稳定性与配体结合事件建立定量关联，为研究药物靶点结合、作用机制验证以及候选化合物筛选提供了一种可靠而直观的策略。</p>\n<p><img src=\"/article-assets/protocol-1/%E6%9C%AA%E5%91%BD%E5%90%8D-20260504-1.png\" alt=\"未命名-20260504-1.png\"></p>\n<center>图源：BioRender</center><h2 id=\"实验步骤\">实验步骤</h2>\n<h3 id=\"1-细胞培养及化合物处理\">1. 细胞培养及化合物处理</h3>\n<p>a. 计数HL-60细胞，将细胞密度调整至1–2 × 10⁶个/mL，并将15 mL细胞悬液分别接种到6个T75培养瓶中。  </p>\n<p><strong>🏷️注：</strong> 该步骤也适用于贴壁细胞，但在与测试化合物孵育后需要进行胰蛋白酶消化以获得细胞悬液，然后再进行加热处理。  </p>\n<p>b. 向前三个培养瓶各加入测试化合物，向另外三个培养瓶各加入等量DMSO。轻轻吹打细胞悬液以确保溶剂或化合物均匀混合。</p>\n<p>将细胞置于37°C、5% CO₂的湿润培养箱中孵育1–3小时。孵育时间可根据具体化合物调整。</p>\n<h3 id=\"2-细胞悬液制备及热处理\">2. 细胞悬液制备及热处理</h3>\n<p>a. 将各处理组的细胞悬液分别转移至已标记的50 mL离心管中。</p>\n<p>b. 在20°C–25°C条件下，以300 × g离心4分钟，使细胞沉淀。</p>\n<p>c. 吸弃上清液，轻轻弹击管底以松散细胞沉淀，然后用20 mL PBS重悬细胞。<br><strong>🏷️关键：</strong> 必须用PBS清洗细胞以去除培养基中的血清，因为血清去除不充分会影响后续免疫印迹分析结果。</p>\n<p>d. 在20°C–25°C条件下，以300 × g离心4分钟，使细胞再次沉淀。重复步骤2.c和2.d一次。</p>\n<p>e. 在离心过程中，配制10 mL含蛋白酶抑制剂混合物的PBS（PBS-PIC）。<br><strong>🏷️注：</strong> 实际只需9 mL PBS-PIC，但为补偿移液过程中的损失，通常制备10 mL溶液。</p>\n<p>f. 细胞沉淀形成后，小心吸弃全部上清液，在每个离心管中加入1.5 mL PBS-PIC轻柔重悬细胞，并确保细胞悬液均一且无可见团块。<br><strong>🏷️注：</strong> 在用PBS-PIC重悬之前，可轻轻弹击含有细胞沉淀的离心管以使其松散。</p>\n<h3 id=\"3-对细胞进行热处理\">3. 对细胞进行热处理</h3>\n<p>a. 从每个处理组的细胞悬液中分装，每管取100 μL（约1–2 × 10⁶个细胞）至12个独立的0.2 mL PCR管中，并盖好管盖。</p>\n<p>b. 根据处理条件和温度（如 40°C–67.5°C，间隔2.5°C）对各PCR管进行标记。</p>\n<p>c. 启动热循环仪程序，并在温度梯度建立后，将PCR管放入预热好的热循环仪中，应在达到目标温度后再放入样品。<br><strong>🏷️关键：</strong> 在升温阶段切勿将样品放入热循环仪，以避免暴露于不准确的温度。</p>\n<p>d. 程序结束后，将PCR管从仪器中取出，并在20°C–25°C下继续冷却3分钟。</p>\n<p>e. 将步骤3.d所得样品迅速置于液氮中速冻。<br><strong>🏷️关键：</strong> 从液氮中转移样品时需佩戴防护护目镜和手套，因为管盖可能弹出或PCR条管可能因温差过大而破裂。为避免此情况，应确保用于转移样品的容器已预冷。使用镊子从液氮中转移样品，以防止人身伤害。</p>\n<p><strong>🏷️暂停点：</strong> 此步骤可将样品转移至−80°C冰箱中保存，从而暂停实验。</p>\n<h3 id=\"4-从热处理后的细胞中获取可溶性组分并制备用于免疫印迹分析的裂解液\">4. 从热处理后的细胞中获取可溶性组分，并制备用于免疫印迹分析的裂解液</h3>\n<p>a. 将PCR管从液氮中取出（或从−80°C冰箱中取出已保存的样品），并转移至25°C水浴中解冻。每分钟检查一次，直至样品完全解冻。<br><strong>🏷️注：</strong> 通常需要3–4分钟完全解冻。</p>\n<p>b. 裂解液解冻后，短暂涡旋混匀，然后再次置于液氮中冷冻。</p>\n<p>c. 再重复进行3次冻融循环（步骤4a和4b）。</p>\n<p>d. 将每管全部裂解液（约100 μL）转移至已标记的1.5 mL微量离心管中。</p>\n<p>e. 将所有样品置于离心机中，在4°C下以17,000 × g离心40分钟。</p>\n<p>f. 离心结束后，小心将所有离心管置于冰上。<br><strong>🏷️关键：</strong> 确保冰桶中的冰未压实。从离心机转移至冰桶时需非常小心，以避免扰动含有细胞碎片和蛋白聚集物的沉淀。也可使用放置于冰上的冷却模块（适用于1.5 mL离心管）。</p>\n<p>g. 避免触及沉淀及管壁，小心吸取每管60 μL上清液，转移至新的离心管中，该管中预先加入20 μL 4× LDS上样缓冲液和4 μL β-巯基乙醇（β-ME）。<br>注：可使用SDS上样缓冲液替代LDS缓冲液；还原剂也可用二硫苏糖醇（DTT）替代β-ME。</p>\n<p>h. 短暂涡旋混匀各组分，并在20°C–25°C条件下放置30–60分钟后进行上胶。  </p>\n<p><strong>🏷️暂停点：</strong> 在与还原剂β-ME孵育后，可将样品转移至−80°C冰箱中保存，从而在此步骤暂停实验。</p>\n<h2 id=\"文献案例\">文献案例</h2>\n<p>在经典CETSA研究中，下图中研究者以p38α激酶为模型靶标，在HL-60细胞中系统评估不同小分子抑制剂的细胞内结合情况。\n<img src=\"/article-assets/protocol-1/%E6%9C%AA%E5%91%BD%E5%90%8D-20260504-2.png\" alt=\"未命名-20260504-2.png\"></p>\n<center>DOI：10.1038/nprot.2014.138</center><p>上图中，研究者将细胞在不同温度下加热，并检测加热后仍保持可溶状态的p38α蛋白比例。在未处理组中，p38α随着温度升高逐渐发生变性，其可检测信号呈典型的S形下降曲线。而在加入已知抑制剂SB203580或AMG-548后，可以观察到曲线整体向右移动，即在更高温度下仍能检测到较多的可溶性p38α蛋白。这一现象表明抑制剂与p38α结合后提高了其热稳定性，是典型的“热稳定性增强效应”。相反，阴性对照ERK 11e处理组的曲线与未处理组基本重合，说明其不与p38α发生特异性结合。通过对数据进行Boltzmann方程拟合，可以进一步计算蛋白的表观熔解温度（Tm），从而实现定量比较。</p>\n<h2 id=\"参考资料\">参考资料</h2>\n<ol>\n<li>Naidu, S. D., Dikovskaya, D., Moore, T. W., &amp; Dinkova-Kostova, A. T. (2022). Detection of thermal shift in cellular Keap1 by protein-protein interaction inhibitors using immunoblot-and fluorescence microplate-based assays. <em>STAR protocols</em>, <em>3</em>(2).</li>\n<li>Jafari, R., Almqvist, H., Axelsson, H., Ignatushchenko, M., Lundbäck, T., Nordlund, P., &amp; Molina, D. M. (2014). The cellular thermal shift assay for evaluating drug target interactions in cells. <em>Nature protocols</em>, <em>9</em>(9), 2100-2122.</li>\n</ol>\n"
  },
  {
    "slug": "bioinformatics-4",
    "title": "一键搞定！批量获取PDB ID对应的UniProt信息，科研更高效！",
    "description": "PDB 批量匹配 UniProt 实操，生信批量 ID 转换神器。",
    "category": "生物信息学",
    "tags": [
      "Python",
      "生信分析"
    ],
    "date": "2026-04-10",
    "dateLabel": "2026.04.10",
    "readingTime": "3 分钟阅读",
    "toc": [
      {
        "id": "引言",
        "text": "引言",
        "level": 2
      },
      {
        "id": "代码详解",
        "text": "代码详解",
        "level": 2
      },
      {
        "id": "功能概述",
        "text": "功能概述",
        "level": 2
      },
      {
        "id": "使用方法",
        "text": "使用方法",
        "level": 2
      },
      {
        "id": "1-安装依赖库",
        "text": "1. 安装依赖库",
        "level": 3
      },
      {
        "id": "2-准备输入文件",
        "text": "2. 准备输入文件",
        "level": 3
      },
      {
        "id": "3-修改脚本参数",
        "text": "3. 修改脚本参数",
        "level": 3
      },
      {
        "id": "4-运行脚本",
        "text": "4. 运行脚本",
        "level": 3
      }
    ],
    "html": "<h2 id=\"引言\">引言</h2>\n<p>在生物信息学研究中，蛋白质结构和功能的研究至关重要。结构数据库（如PDB）提供了大量的蛋白质结构信息，但研究人员往往需要从这些结构中获取更详细的功能性数据，而这些数据通常保存在UniProt数据库中。为了简化这一过程，我们可以编写一个Python脚本，用来批量处理多个PDB ID，获取对应的UniProt信息，并将这些信息保存到Excel文件中。</p>\n<p>比如我们通过反向分子对接确定潜在的靶点蛋白，通过对接获得了多个PDB ID，就可以使用该脚本快速获取这些蛋白的功能性信息，如蛋白质名称、基因名称和物种等。</p>\n<h2 id=\"代码详解\">代码详解</h2>\n<p>首先先提供完整的代码，下面是详细的代码及其说明：</p>\n<pre><code class=\"language-python\">import requests\nimport pandas as pd\nfrom xml.etree import ElementTree as ET\nfrom concurrent.futures import ThreadPoolExecutor, as_completed\n\n# 从PDB ID获取UniProt ID\ndef get_uniprot_id_from_pdb(pdb_id):\n    url = f&quot;https://data.rcsb.org/rest/v1/core/polymer_entity/{pdb_id}/1&quot;\n    response = requests.get(url)\n    if response.status_code == 200:\n        data = response.json()\n        identifiers = data.get(&#39;rcsb_polymer_entity_container_identifiers&#39;, {})\n        uniprot_ids = identifiers.get(&#39;uniprot_ids&#39;, [])\n        return uniprot_ids\n    else:\n        print(f&quot;Error fetching data for PDB ID {pdb_id}: {response.status_code}&quot;)\n        return None\n\n# 获取详细的UniProt信息\ndef get_uniprot_info(pdb_id, uniprot_id):\n    url = f&quot;https://www.uniprot.org/uniprot/{uniprot_id}.xml&quot;\n    response = requests.get(url)\n    if response.status_code == 200:\n        root = ET.fromstring(response.content)\n        info = {\n            &#39;PDB ID&#39;: pdb_id,\n            &#39;UniProt ID&#39;: uniprot_id,\n            &#39;Entry Name&#39;: None,\n            &#39;Protein Name&#39;: None,\n            &#39;Organism&#39;: None,\n            &#39;Gene Names&#39;: []\n        }\n        entry_name = root.find(&quot;.//{http://uniprot.org/uniprot}name&quot;)\n        if entry_name is not None:\n            info[&#39;Entry Name&#39;] = entry_name.text\n        protein_name = root.find(&quot;.//{http://uniprot.org/uniprot}protein//{http://uniprot.org/uniprot}recommendedName//{http://uniprot.org/uniprot}fullName&quot;)\n        if protein_name is not None:\n            info[&#39;Protein Name&#39;] = protein_name.text\n        organism = root.find(&quot;.//{http://uniprot.org/uniprot}organism//{http://uniprot.org/uniprot}name[@type=&#39;scientific&#39;]&quot;)\n        if organism is not None:\n            info[&#39;Organism&#39;] = organism.text\n        gene_names = root.findall(&quot;.//{http://uniprot.org/uniprot}gene//{http://uniprot.org/uniprot}name&quot;)\n        for gene_name in gene_names:\n            info[&#39;Gene Names&#39;].append(gene_name.text)\n        return info\n    else:\n        print(f&quot;Error fetching data for UniProt ID {uniprot_id}: {response.status_code}&quot;)\n        return None\n\n# 处理单个PDB ID\ndef process_pdb_id(pdb_id):\n    uniprot_info_list = []\n    uniprot_ids = get_uniprot_id_from_pdb(pdb_id)\n    if uniprot_ids:\n        for uniprot_id in uniprot_ids:\n            uniprot_info = get_uniprot_info(pdb_id, uniprot_id)\n            if uniprot_info:\n                uniprot_info_list.append(uniprot_info)\n    return uniprot_info_list\n\n# 从Excel文件中批量处理PDB ID\ndef process_pdb_ids_from_excel(input_excel_file, output_excel_file):\n    pdb_df = pd.read_excel(input_excel_file)\n    pdb_ids = pdb_df[&#39;PDB ID&#39;].tolist()\n    uniprot_info_list = []\n\n    with ThreadPoolExecutor(max_workers=10) as executor:\n        futures = {executor.submit(process_pdb_id, pdb_id): pdb_id for pdb_id in pdb_ids}\n        for future in as_completed(futures):\n            pdb_id = futures[future]\n            try:\n                uniprot_info_list.extend(future.result())\n            except Exception as e:\n                print(f&quot;Error processing PDB ID {pdb_id}: {e}&quot;)\n\n    df = pd.DataFrame(uniprot_info_list)\n    df = df.explode(&#39;Gene Names&#39;)\n    df.to_excel(output_excel_file, index=False)\n    print(f&quot;Data has been written to {output_excel_file}&quot;)\n\n# 使用示例\ninput_excel_file = &#39;pdb_ids.xlsx&#39;  # 输入Excel文件路径\noutput_excel_file = &#39;uniprot_info.xlsx&#39;  # 输出Excel文件路径\nprocess_pdb_ids_from_excel(input_excel_file, output_excel_file)\n</code></pre>\n<h2 id=\"功能概述\">功能概述</h2>\n<ol>\n<li><strong>读取输入Excel文件</strong>：从Excel文件中读取包含PDB ID的列。</li>\n<li><strong>获取UniProt ID</strong>：通过访问RCSB PDB API，将每个PDB ID转换为对应的UniProt ID信息。</li>\n<li><strong>获取UniProt详细信息</strong>：通过访问UniProt API，获取每个UniProt ID的详细信息，包括Entry Name、Protein Name、Organism和Gene Names。</li>\n<li><strong>多线程处理</strong>：使用多线程加速多个PDB ID的处理。</li>\n<li><strong>保存结果到Excel文件</strong>：将最终结果保存到一个新的Excel文件中。</li>\n</ol>\n<h2 id=\"使用方法\">使用方法</h2>\n<h3 id=\"1-安装依赖库\">1. 安装依赖库</h3>\n<p>确保你已经安装了以下Python库：</p>\n<ul>\n<li>requests</li>\n<li>pandas</li>\n<li>openpyxl</li>\n<li>concurrent.futures（Python内置，无需安装）</li>\n</ul>\n<p>使用以下命令安装所需库：</p>\n<p><code>pip install requests pandas openpyxl</code></p>\n<h3 id=\"2-准备输入文件\">2. 准备输入文件</h3>\n<p>输入文件应为Excel格式（例如<code>.xlsx</code>），并且包含一列名为<code>PDB ID</code>，该列中的每一行都是一个PDB ID。例如：\n<img src=\"/article-assets/bioinformatics-4/Pasted%20image%2020240802102257.png\" alt=\"Pasted image 20240802102257.png\"></p>\n<h3 id=\"3-修改脚本参数\">3. 修改脚本参数</h3>\n<p>在脚本中设置输入和输出文件路径：</p>\n<pre><code class=\"language-python\">input_excel_file = &#39;pdb_ids.xlsx&#39;  # 替换为你的输入Excel文件路径\noutput_excel_file = &#39;uniprot_info.xlsx&#39;  # 替换为你希望的输出Excel文件名\n</code></pre>\n<h3 id=\"4-运行脚本\">4. 运行脚本</h3>\n<p>将以上代码保存为一个Python文件，例如<code>pdb_to_uniprot.py</code>，并运行该脚本。脚本运行完成后，会在指定的输出文件路径生成一个新的Excel文件，包含PDB ID、UniProt ID、条目名称、蛋白质名称、物种和基因名称等信息。</p>\n<h4>小贴士</h4>\n<p><strong>多线程处理</strong>：脚本使用了多线程技术来加速处理多个PDB ID。你可以根据自己的计算机性能调整线程数量（<code>max_workers</code>参数）。</p>\n<p>通过以上步骤，我们可以轻松地从多个PDB ID中获取详细的UniProt信息，并将这些信息保存到Excel文件中，为研究提供便利。如果你在使用过程中有任何问题或建议，欢迎留言讨论。</p>\n"
  },
  {
    "slug": "bioinformatics-3",
    "title": "在UCSC快速提取基因启动子序列（Promoter）",
    "description": "做转录调控必备！UCSC提取启动子全流程",
    "category": "生物信息学",
    "tags": [
      "生信分析"
    ],
    "date": "2026-03-31",
    "dateLabel": "2026.03.31",
    "readingTime": "3 分钟阅读",
    "toc": [
      {
        "id": "step-1进入ucsc-genome-browser-数据库",
        "text": "✅ Step 1：进入UCSC Genome Browser 数据库",
        "level": 3
      },
      {
        "id": "step-2定位基因组区域",
        "text": "✅ Step 2：定位基因组区域",
        "level": 3
      },
      {
        "id": "step-3提取上游序列promoter",
        "text": "✅ Step 3：提取上游序列（Promoter）",
        "level": 3
      }
    ],
    "html": "<p>做转录调控、ChIP-seq、报告基因实验的同学，一定绕不开一个核心问题：<strong>如何准确获取目标基因的启动子序列？</strong> 上期内容为大家介绍了<a href=\"/articles/bioinformatics-1\">如何在NCBI精准获取基因启动子（Promoter）序列？</a>，今天再继续为分享另一种方法，用<strong>UCSC Genome Browser</strong>搞定基因启动子序列查询，科研效率直接拉满⚡</p>\n<h3 id=\"step-1进入ucsc-genome-browser-数据库\">✅ Step 1：进入UCSC Genome Browser 数据库</h3>\n<p><strong>UCSC Genome Browser</strong> 是由 University of California, Santa Cruz 基因组研究团队开发的一个<strong>综合性基因组信息整合与可视化平台</strong>。它的核心功能可以概括为：<strong>将基因组序列 + 多组学注释 + 公共数据库数据进行统一整合，并以“轨道（tracks）”形式可视化展示</strong>。</p>\n<p>进入首页：<a href=\"https://genome.ucsc.edu/index.html\">https://genome.ucsc.edu/index.html</a>\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-1.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-1.png\"></p>\n<h3 id=\"step-2定位基因组区域\">✅ Step 2：定位基因组区域</h3>\n<p>在搜索框中输入目标基因名称，我们以 <code>TP53</code> 为例，点击 <code>Search</code> 按钮进行检索，会进入下图所示的<strong>Search Results 页面</strong>；</p>\n<p>页面顶部图中红框部分为 <strong>“MANE Select Plus Clinical”</strong>，这是当前最推荐使用的转录本来源：</p>\n<ul>\n<li>✔ 由 RefSeq + GENCODE 联合定义</li>\n<li>✔ 保证临床与研究一致性</li>\n<li>✔ 每个基因通常只有一个“标准转录本”</li>\n</ul>\n<p>📌 对于TP53：该条目代表“标准参考转录本”，适用于大多数分析（包括启动子提取）。在该页面中选择 <code>TP53 - chr17:7668421-7687490</code>；\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-2.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-2.png\">\n此时进入了基因浏览器页面，该页面的顶部信息栏分别展示了标题（标明了参考基因组版本）、功能（缩放、移动基因组显示位置）、基因组位置坐标及长度以及染色体条带图。\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-3.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-3.png\">\n信息栏下方为<strong>基因结构轨道</strong>，这里包含了多个数据库的信息。其中 <code>GENCODE / RefSeq Tracks</code> 中的蓝色结构分别表示：</p>\n<ul>\n<li>**粗块 → exon（外显子）</li>\n<li>**细线 → intron（内含子）</li>\n<li><strong>箭头方向</strong> → 转录方向（strand）</li>\n</ul>\n<p>👉 在本例中 TP53 的箭头是 <strong>←（向左）</strong>，表明 TP53 位于 <strong>负链（minus strand）</strong>。\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-4.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-4.png\"></p>\n<h3 id=\"step-3提取上游序列promoter\">✅ Step 3：提取上游序列（Promoter）</h3>\n<p>接下来在基因浏览器页面中点击 <code>TP53</code>;\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-7.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-7.png\">\n在新打开的GENCODE详情页的 <code>Sequence and Links to Tools and Databases </code> 是<strong>用于提取序列的入口</strong>，点击 <code>Genomic Sequence (chr17:7,668,421-7,687,490)</code> 进入序列提取页面；\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-6.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-6.png\">\n下面选择启动子区，在 <code>Get Genomic Sequence Near Gene</code> 中填写 <code>Promoter/Upstream by 2000 bases</code>，表示以 <strong>TSS（转录起点）为基准</strong>向“上游”提取 <strong>2000 bp</strong>，系统自动计算 promoter 区域。</p>\n<p>在本例中TP53 是 <strong>负链基因</strong>，UCSC会向右取上游序列。</p>\n<p>参数设置完成后，点击 <code>Submit</code> 按钮进行序列提取。\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-8.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-8.png\">\n在新打开的页面中就可以得到启动子序列信息，可以看到和我们上期在NCBI获取到的序列是一致的。\n<img src=\"/article-assets/bioinformatics-3/%E5%9C%A8UCSC%E5%BF%AB%E9%80%9F%E6%8F%90%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%E5%BA%8F%E5%88%97%EF%BC%88Promoter%EF%BC%89-20260325-9.png\" alt=\"在UCSC快速提取基因启动子序列（Promoter）-20260325-9.png\">\n以上就是本期关于在UCSC快速提取基因启动子序列的全部内容了。如果对你有所帮助，欢迎点赞、收藏或转发，也可以留言交流你的问题或研究需求，我们下期再见 👋</p>\n"
  },
  {
    "slug": "bioinformatics-2",
    "title": "用 JASPAR 预测启动子中的转录因子结合位点：一篇讲透实操逻辑",
    "description": "不会找转录因子结合位点？JASPAP实操全流程",
    "category": "生物信息学",
    "tags": [
      "生信分析"
    ],
    "date": "2026-03-31",
    "dateLabel": "2026.03.31",
    "readingTime": "4 分钟阅读",
    "toc": [
      {
        "id": "step-1确定要分析的启动子",
        "text": "✅ Step 1：确定要分析的启动子",
        "level": 3
      },
      {
        "id": "step-2选择要扫描的转录因子-motif",
        "text": "✅ Step 2：选择要扫描的转录因子 motif",
        "level": 3
      },
      {
        "id": "step-3把启动子序列输入-jaspar-scan-进行扫描",
        "text": "✅ Step 3：把启动子序列输入 JASPAR scan 进行扫描",
        "level": 3
      }
    ],
    "html": "<p>做基因调控研究时，最常见的一个问题就是：<strong>某个基因为什么会表达上调或下调？</strong> 答案往往藏在它的<strong>启动子（promoter）</strong> 里。</p>\n<p>启动子是转录起始附近的关键调控区域，而转录因子（TF）正是通过识别并结合启动子或其他顺式调控元件上的特定 DNA motif，来激活或抑制基因转录。<strong>JASPAR</strong>是一个开放获取、人工整理的转录因子结合偏好数据库，核心内容是 TF 的结合模型，主要以 <strong>PFM（position frequency matrix）</strong> 形式保存；这些 PFM 可以进一步转换成 <strong>PWM/PSSM</strong>，再拿去扫描 DNA 序列，从而预测潜在的转录因子结合位点。也就是说，<strong>JASPAR scan 不是“凭空预测”结合位点，而是拿已知 TF 的 motif 模型去你的序列里逐位匹配。</strong> 本期内容就为大家分享如何使用JASPAR 预测启动子中的转录因子结合位点。</p>\n<h3 id=\"step-1确定要分析的启动子\">✅ Step 1：确定要分析的启动子</h3>\n<p>确定要分析的启动子的通常做法是围绕基因的 TSS 提取一段上游或上下游序列，例如：</p>\n<ul>\n<li>TSS 上游 500 bp</li>\n<li>TSS 上游 1000 bp</li>\n<li>TSS 上游 2000 bp</li>\n<li>或者上游加少量下游区域</li>\n</ul>\n<p>我们在前面的推文中已经为大家详细介绍了查询启动子序列的方法，详细内容见：</p>\n<ul>\n<li>如何在NCBI精准获取基因启动子（Promoter）序列？</li>\n<li>在UCSC快速提取基因启动子序列（Promoter）</li>\n</ul>\n<h3 id=\"step-2选择要扫描的转录因子-motif\">✅ Step 2：选择要扫描的转录因子 motif</h3>\n<p>JASPAR 的网站支持按 collection、物种类群等方式筛选 motif；其数据库目前持续更新，2024 版更新中新增了数百个 profile，2026 版也继续扩展了 binding profiles 和深度学习模型。这里我们以 TP53 为例，为大家演示用 JASPAR 预测启动子中的 E2F1 结合位点。</p>\n<p>首先进入 JASPAR 首页：<a href=\"https://jaspar.elixir.no/\">https://jaspar.elixir.no/</a></p>\n<p>在搜索框中输入 <code>E2F1</code> 然后点击 <code>Searth</code> 按钮进行检索；\n<img src=\"/article-assets/bioinformatics-2/%E7%94%A8%20JASPAR%20%E9%A2%84%E6%B5%8B%E5%90%AF%E5%8A%A8%E5%AD%90%E4%B8%AD%E7%9A%84%E8%BD%AC%E5%BD%95%E5%9B%A0%E5%AD%90%E7%BB%93%E5%90%88%E4%BD%8D%E7%82%B9%EF%BC%9A%E4%B8%80%E7%AF%87%E8%AE%B2%E9%80%8F%E5%AE%9E%E6%93%8D%E9%80%BB%E8%BE%91-20260325-1.png\" alt=\"用 JASPAR 预测启动子中的转录因子结合位点：一篇讲透实操逻辑-20260325-1.png\">\n检索结果中，每一行都是一个 <strong>E2F1 的 motif 模型</strong>，注意 <code>Species</code> 列确认种属，比如 <code>Homo sapiens（人）</code>;</p>\n<p><code>Logo</code> 列为转录因子偏好的结合位点（motif）序列缩略图。图中每个字母大小代表某个位置上碱基偏好程度，字母越大表示越重要。\n<img src=\"/article-assets/bioinformatics-2/%E7%94%A8%20JASPAR%20%E9%A2%84%E6%B5%8B%E5%90%AF%E5%8A%A8%E5%AD%90%E4%B8%AD%E7%9A%84%E8%BD%AC%E5%BD%95%E5%9B%A0%E5%AD%90%E7%BB%93%E5%90%88%E4%BD%8D%E7%82%B9%EF%BC%9A%E4%B8%80%E7%AF%87%E8%AE%B2%E9%80%8F%E5%AE%9E%E6%93%8D%E9%80%BB%E8%BE%91-20260325-2.png\" alt=\"用 JASPAR 预测启动子中的转录因子结合位点：一篇讲透实操逻辑-20260325-2.png\"></p>\n<h3 id=\"step-3把启动子序列输入-jaspar-scan-进行扫描\">✅ Step 3：把启动子序列输入 JASPAR scan 进行扫描</h3>\n<p>接下来我们就可以使用JASPAR 的 Scan 功能对启动子中的转录因子结合位点进行预测了。首先勾选搜索结果的第一个条目，点击页面右侧界面的 <code>Scan</code> 模块，然后在输入框输入 <code>TP53</code> 的启动子序列，注意输入的是<strong>FASTA 格式序列</strong>，也就是我们前面推文种获取的序列，即：</p>\n<pre><code class=\"language-text\">&gt;hg38_knownGene_ENST00000269305.9 range=chr17:7687491-7689490 5&#39;pad=0 3&#39;pad=0 strand=- repeatMasking=none\nCCTTGAGGGAAGTAGAAGACACAAACTGCTAGATAAAATGTAAGCTCAGT\nCTAAAAGGGCTACGTGCCGCTTCTCCCAGCTCTGGGGCATCCCTCTCCTA\nGAAAACTGGACTGTTTTACAGTGAAAATCTCGGGGGTGGTCAGCTCCCTG\nCCCCGTTGTTATCCTTACCACTTACAGCCTTTCAAGAAGTTCTCAGGTTG\nGGTGCTGAACTCTGACCAGGAACCACTGAGAAATCGAGGCAGCTGGGAGA\nAGCTGTAGTTCCAAGCGCTGAAAGGAAGATGGGGGACAATAAACCTGGGT\nCGCCAAGCAAAGGGGGCAGAGGCCTGGAGAAGTGGGTCTCAGGACCAGAG\nGACAGATCGACCTCACACTTCATCTCCCCAGACTCCACACTCCACTGCCA\nTCACCACTTACGTGTCTCCCTCGTCCTCTGCAGCGGGTTCCCCAGAGGTA\nTCTTCCATGGCTTTTCCAGACCCCAACTCTGGCCCGTTCGCTTCTTCTTC\nAGAAAGGCTCCCGTTTGCTTCTTCTGCAGGAAGGCTTGTATTTTCAGAAA\nGTTCTTGCTCCTCGATTCGAGGACTCAACTCACTAGGGGAACCAAACTCT\nGTTTCCAGGGGAGTGGAGAGAGAAACTGGGTCCCCCTCCCGTAGCTCCTG\nGGACACAGCTGAGCCAGCCACAGGATCTGGGGACAACCGGGGCGGATCCC\nCCCTTTCGGGAGGCGGTGGCATCAGTTCAGAGTCCGCATTTTTATTCATC\nGGGGAAGCGTGGGGAGAAGGATGGGCTGGAGCTGGGTCCTGGTCTGAAGG\nACAGCAGTCCGGAGCTAACGGTTGAGTCTCCAAAGTCTTCATACTGCAGA\nGGAAGCACAGCGGAGATTAGCCTCAGCCAGGATGGCTTCGAAGTTCTCAG\nGGATCCGACGCAGAGCTAAAGAAACCCACCTGTGCTTCCCTCCTCTTCTG\nGGAGTAGGCAGAAGACTCCCGGGAGGAGAGGCGAACAGCGGACGCCAATT\nCTTTTGAAAGCACTGTGTTCCTTAGCACCGCGGGTCGCTACGGGCCTCTT\nGCTGTCGCGGGATTTCGGTCCACCTTCCGATTGGGCCGCCGCATCCCGGA\nTCAGATTTCGCGGGCGACCCACGGAACCCGCGGAGCCGGGACGTGAAAGG\nTTAGAAGGTTTCCCGTTCCCATCAAGCCCTAGGGCTCCTCGTGGCTGCTG\nGGAGTTGTAGTCTGAACGCTTCTATCTTGGCGAGAAGCGCCTACGCTCCC\nCCTACCGAGTCCCGCGGTAATTCTTAAAGCACCTGCACCGCCCCCCCGCC\nGCCTGCAGAGGGCGCAGCAGGTCTTGCACCTCTTCTGCATCTCATTCTCC\nAGGCTTCAGACCTGTCTCCCTCATTCAAAAAATATTTATTATCGAGCTCT\nTACTTGCTACCCAGCACTGATATAGGCACTCAGGAATACAACAATGAATA\nAGATAGTAGAAAAATTCTATATCCTCATAAGGCTTACGTTTCCATGTACT\nGAAAGCAATGAACAAATAAATCTTATCAGAGTGATAAGGGTTGTGAAGGA\nGATTAAATAAGATGGTGTGATATAAAGTATCTGGGAGAAAACGTTAGGGT\nGTGATATTACGGAAAGCCTTCCTAAAAAATGACATTTTAACTGATGAGAA\nGAAAGGATCCAGCTGAGAGCAAACGCAAAAGCTTTCTTCCTTCCACCCTT\nCATATTTGACACAATGCAGGATTCCTCCAAAATGATTTCCACCAATTCTG\nCCCTCACAGCTCTGGCTTGCAGAATTTTCCACCCCAAAATGTTAGTATCT\nACGGCACCAGGTCGGCGAGAATCCTGACTCTGCACCCTCCTCCCCAACTC\nCATTTCCTTTGCTTCCTCCGGCAGGCGGATTACTTGCCCTTACTTGTCAT\nGGCGACTGTCCAGCTTTGTGCCAGGAGCCTCGCAGGGGTTGATGGGATTG\nGGGTTTTCCCCTCCCATGTGCTCAAGACTGGCGCTAAAAGTTTTGAGCTT\n</code></pre>\n<p>接下来设置 <code>Relative profile score threshold</code>，其中：</p>\n<ul>\n<li><strong>0.80</strong>：偏宽松，位点多，适合初筛；</li>\n<li><strong>0.85–0.90</strong>：常用区间，更适合缩小候选；</li>\n<li><strong>&gt;0.90</strong>：更严格，适合优先挑实验验证位点。</li>\n</ul>\n<p>这里我们就设置为默认的 0.8，即 <code>80%</code>。然后点击 <code>Scan</code> 按钮。\n<img src=\"/article-assets/bioinformatics-2/%E7%94%A8%20JASPAR%20%E9%A2%84%E6%B5%8B%E5%90%AF%E5%8A%A8%E5%AD%90%E4%B8%AD%E7%9A%84%E8%BD%AC%E5%BD%95%E5%9B%A0%E5%AD%90%E7%BB%93%E5%90%88%E4%BD%8D%E7%82%B9%EF%BC%9A%E4%B8%80%E7%AF%87%E8%AE%B2%E9%80%8F%E5%AE%9E%E6%93%8D%E9%80%BB%E8%BE%91-20260325-3.png\" alt=\"用 JASPAR 预测启动子中的转录因子结合位点：一篇讲透实操逻辑-20260325-3.png\">\n从扫描结果来看，在 TP53 启动子序列中，使用 E2F1 motif（MA0024.1）扫描，在 80% 阈值下共预测到 <strong>3个潜在的 E2F1 结合位点</strong>。\n<img src=\"/article-assets/bioinformatics-2/%E7%94%A8%20JASPAR%20%E9%A2%84%E6%B5%8B%E5%90%AF%E5%8A%A8%E5%AD%90%E4%B8%AD%E7%9A%84%E8%BD%AC%E5%BD%95%E5%9B%A0%E5%AD%90%E7%BB%93%E5%90%88%E4%BD%8D%E7%82%B9%EF%BC%9A%E4%B8%80%E7%AF%87%E8%AE%B2%E9%80%8F%E5%AE%9E%E6%93%8D%E9%80%BB%E8%BE%91-20260325-4.png\" alt=\"用 JASPAR 预测启动子中的转录因子结合位点：一篇讲透实操逻辑-20260325-4.png\">\n在上表中，我们可以关注一下 <code>Relative score</code> 表示<strong>标准化分数（0–1）</strong>，这是最核心的结果指标，\n它表示匹配强度。一般0.85–0.90表示可靠，0.80–0.85表示较弱（但可保留）；也就是说本例中我们获得2个高评分位点（relative score ≈ 0.89）以及1个较低评分位点（relative score ≈ 0.80）；</p>\n<p><code>Start / End</code> 列表示输入的启动子序列中的位置；<code>Strand</code> 表示链方向；<code>Predicted sequence</code> 为预测的序列，例如：TTTCGCGG、TTTAGCGC、TTTCCCGT，这些就是<strong>被认为是 E2F1 可能结合的 DNA 序列片段</strong>。</p>\n<p>本例中预测序列均呈现典型的 <strong>E2F family GC-rich motif 特征</strong>，提示这些区域可能参与 E2F1 介导的转录调控。</p>\n<p>💡 需要注意的是JASPAR scan 是用已知 TF 的 motif 模型，在目标 DNA 序列中寻找“长得像结合位点”的片段，不等于真实结合，因此必须结合表达、开放染色质和实验验证解释。</p>\n"
  },
  {
    "slug": "bioinformatics-1",
    "title": "如何在NCBI精准获取基因启动子（Promoter）序列？",
    "description": "在NCBI中获取启动子序列的关键不在“找”，而是在“理解”。",
    "category": "生物信息学",
    "tags": [
      "生信分析"
    ],
    "date": "2026-03-25",
    "dateLabel": "2026.03.25",
    "readingTime": "4 分钟阅读",
    "toc": [
      {
        "id": "step-1进入ncbi-gene数据库",
        "text": "✅ Step 1：进入NCBI Gene数据库",
        "level": 3
      },
      {
        "id": "step-2定位基因组区域",
        "text": "✅ Step 2：定位基因组区域",
        "level": 3
      },
      {
        "id": "step-3提取上游序列promoter",
        "text": "✅ Step 3：提取上游序列（Promoter）",
        "level": 3
      }
    ],
    "html": "<p><strong>启动子（Promoter）</strong> 是位于基因<strong>转录起始位点（TSS）上游</strong>的一段DNA序列，是RNA聚合酶和转录因子结合的区域。在基因调控研究、转录因子预测、报告基因实验（如Luciferase assay）中，<strong>启动子序列</strong>是最基础也是最关键的素材之一。本期内容为大家分享如何在NCBI数据库中查询基因的启动子序列。</p>\n<h3 id=\"step-1进入ncbi-gene数据库\">✅ Step 1：进入NCBI Gene数据库</h3>\n<p>首先进入NCBI主页，选择 <code>Gene</code> 数据库，在搜索框中输入基因名称，这里以 <code>TP53</code> 为例，输入后点击 <code>Search</code> 按钮进行检索；\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-1.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-1.png\"></p>\n<h3 id=\"step-2定位基因组区域\">✅ Step 2：定位基因组区域</h3>\n<p>在检索结果中找到目标基因，要注意种属，这里我们选择 <code>Homo sapiens (human)</code> ，即人类；点击基因名称来查看详细信息；\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-2.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-2.png\">\n在“<strong>Genomic context（基因组定位信息）</strong>”模块，可以看到目的基因在不同参考基因组中的精确坐标信息，也就是：“这个基因在染色体哪里？方向是什么？范围是多少？”\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-3.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-3.png\">\n👉 <mark style=\"background:#fff88f\">Location: 17p13.1</mark>：染色体细胞遗传学位置</p>\n<ul>\n<li><strong>17</strong> → 第17号染色体</li>\n<li><strong>p</strong> → 短臂（q是长臂）</li>\n<li><strong>13.1</strong> → 区域细分</li>\n</ul>\n<p>👉 <mark style=\"background:#fff88f\">Exon count: 13</mark>：这个基因有 <strong>13个外显子</strong>（TSS通常在第一个外显子附近）</p>\n<p>表格的含义为：</p>\n<table>\n<thead>\n<tr>\n<th>字段</th>\n<th>含义</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Annotation release</td>\n<td>注释版本</td>\n</tr>\n<tr>\n<td>Status</td>\n<td>是否当前版本</td>\n</tr>\n<tr>\n<td>Assembly</td>\n<td>基因组版本</td>\n</tr>\n<tr>\n<td>Chr</td>\n<td>染色体</td>\n</tr>\n<tr>\n<td>Location</td>\n<td>精确坐标</td>\n</tr>\n</tbody></table>\n<p>本例中 <mark style=\"background:#fff88f\">GRCh38.p14（GCF_000001405.40）</mark> 为人类主流参考基因组，与大多数数据库一致，推荐使用。</p>\n<p>👉 <mark style=\"background:#fff88f\">NC_000017.11 (7668421..7687490, complement) </mark>这是我们需要重点关注的信息：</p>\n<ul>\n<li>NC_000017.11 染色体的RefSeq编号；</li>\n<li>7668421..7687490 表示基因在染色体上的范围，起点为7668421，终点为7687490，单位是bp（碱基）；</li>\n<li>complement 表示该基因在负链（reverse strand），必须取<strong>反向互补序列</strong></li>\n</ul>\n<p>💡 需要注意区分基因为正链还是负链。<mark>正链TSS位置在起点，promoter方向往左（上游）负链TSS位置在终点，promoter方向往右（上游）</mark>。</p>\n<p>本例中<strong>基因范围：7668421 → 7687490（负链）</strong>，如果取 -2000 bp promoter，那么上游2000bp的序列位置为7687490 + 2000，即7689490；</p>\n<p>接下来查看“<strong>Genomic regions, transcripts, and products</strong>”模块，注意 <code>Genomic Sequence</code> 参考基因组版本要与上一步中一致，然后点击 <code>FASTA</code> 按钮显示母的基因序列；\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-4.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-4.png\">\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-5.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-5.png\"></p>\n<h3 id=\"step-3提取上游序列promoter\">✅ Step 3：提取上游序列（Promoter）</h3>\n<p>下面在 <code>Change region shown</code> 的 <code>Selected region</code> 选项中手动输入序列位置， 启动子区一般取基因上游2000bp区域内比较稳妥，也就是我们上步骤中计算得到的数值，<code>from 7687490 to 7689490</code>;</p>\n<p>此外，本例中目标基因在负链上，所在需要勾选 <code>Show reverse complement</code> 选项，如果基因在正链上，则要确定不勾选。\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-6.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-6.png\">\n设置完成后，点击 <code>Update View</code> 按钮，左侧界面即显示为启动子序列了。\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-7.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-7.png\">\n点击 <code>Send to</code> 按钮，可以将序列保存为FASTA格式，可以使用记事本打开，以保存待后续使用。\n<img src=\"/article-assets/bioinformatics-1/%E5%A6%82%E4%BD%95%E5%9C%A8NCBI%E7%B2%BE%E5%87%86%E8%8E%B7%E5%8F%96%E5%9F%BA%E5%9B%A0%E5%90%AF%E5%8A%A8%E5%AD%90%EF%BC%88Promoter%EF%BC%89%E5%BA%8F%E5%88%97%EF%BC%9F-20260324-8.png\" alt=\"如何在NCBI精准获取基因启动子（Promoter）序列？-20260324-8.png\">\n以上就是本期关于在NCBI中获取基因启动子序列的全部内容了。如果对你有所帮助，欢迎点赞、收藏或转发，也可以留言交流你的问题或研究需求，我们下期再见 👋</p>\n"
  },
  {
    "slug": "schrodinger-1",
    "title": "蛋白质动力学分析神器！一键搞定残基关联性统计与可视化",
    "description": "残基关联性分析是描述分子内构象变化的一种有效方法。",
    "category": "CADD",
    "tags": [
      "Schrödinger",
      "分子动力学",
      "Python"
    ],
    "date": "2026-01-23",
    "dateLabel": "2026.01.23",
    "readingTime": "4 分钟阅读",
    "toc": [
      {
        "id": "1-残基相互作用分析",
        "text": "1. 残基相互作用分析",
        "level": 3
      },
      {
        "id": "2-关联性统计分析",
        "text": "2. 关联性统计分析",
        "level": 3
      }
    ],
    "html": "<p>残基关联性分析是描述分子内构象变化的一种有效方法。本期内容为大家分享如何使用Schrödinger结合Python轻松搞定蛋白质残基的关联性分析！</p>\n<p>在蛋白质分子动力学模拟中，分析初始结构和最终结构的残基关联性变化是理解蛋白质动态行为的关键。本例中我们定义两个残基之间的距离小于4.5Å为残基发生相互作用的阈值，我们需要分析分子动力学的初始结构（0ns）和最终结构（100ns）之间的残基关联差异。即需要以下内容：</p>\n<ul>\n<li>统计初始结构和最终结构中满足相互作用阈值（如 D<sub>ij</sub>&lt;4.5 Å）的残基对数目。</li>\n<li>计算<strong>关联相似度</strong>（如 Jaccard 相似度、余弦相似度）和<strong>衰减率</strong>。</li>\n<li>输出满足条件的残基对及其距离，便于进一步分析或可视化。</li>\n</ul>\n<h3 id=\"1-残基相互作用分析\">1. 残基相互作用分析</h3>\n<p>我们需要使用Schrödinger分析蛋白结构内残基之间的距离，在Maestro中导入蛋白结构，一次点击<code>TASKS - &gt; Browse - &gt; Structure Analysis - &gt; Residue Distance Map </code>\n打开<code>Residue Distance Map</code>窗口；\n<img src=\"/article-assets/schrodinger-1/Pasted%20image%2020250131103424.png\" alt=\"Pasted image 20250131103424.png\">\n点击<code>Load</code>导入结构，这里我们选择通过两个残基之间<strong>α碳的距离</strong>来定义两个残基的距离，在<code>Plot</code>的下拉菜单中选择<code>C-alpha atoms</code>，在<code>Label axes with</code>的下拉菜单中选择<code>Residue Number</code>;</p>\n<p>需要注意的是α碳是蛋白质骨架的核心原子，用它代表残基位置可以简化距离计算，<strong>在某些情况下是合理的，但存在局限性</strong>。实际应用中应视情况改进，如结合侧链重原子（如Cβ、Cγ等）或质心距离，更准确地反映残基间的空间关系。\n<img src=\"/article-assets/schrodinger-1/Pasted%20image%2020250131103915.png\" alt=\"Pasted image 20250131103915.png\">\n接下来可以点击<code>Save Image</code>或<code>Export Data</code>按钮来<strong>保存图像</strong>或<strong>导出数据</strong>,这里我们导出初始结构的数据为<code>initial_distance_matrix.csv</code>文件。类似的方法导出最终结果的数据为<code>final_distance_matrix.csv</code>文件。</p>\n<h3 id=\"2-关联性统计分析\">2. 关联性统计分析</h3>\n<p>接下来我们使用Python来对数据处理分析，需要计算以下关键指标：</p>\n<h4>关联相似度</h4>\n<h5>① Jaccard 相似度</h5>\n<p>Jaccard 相似度用于衡量初始结构和最终结构相互作用模式的相似性。</p>\n<span class=\"katex-display\"><span class=\"katex\"><span class=\"katex-mathml\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mtext>Jaccard 相似度</mtext><mo>=</mo><mfrac><mrow><mi mathvariant=\"normal\">∣</mi><msub><mi>A</mi><mtext>initial</mtext></msub><mo>∩</mo><msub><mi>A</mi><mtext>final</mtext></msub><mi mathvariant=\"normal\">∣</mi></mrow><mrow><mi mathvariant=\"normal\">∣</mi><msub><mi>A</mi><mtext>initial</mtext></msub><mo>∪</mo><msub><mi>A</mi><mtext>final</mtext></msub><mi mathvariant=\"normal\">∣</mi></mrow></mfrac></mrow><annotation encoding=\"application/x-tex\">\\text{Jaccard 相似度} = \\frac{|A_{\\text{initial}} \\cap A_{\\text{final}}|}{|A_{\\text{initial}} \\cup A_{\\text{final}}|}</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.6944em;\"></span><span class=\"mord text\"><span class=\"mord\">Jaccard </span><span class=\"mord cjk_fallback\">相似度</span></span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span><span class=\"mrel\">=</span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:2.363em;vertical-align:-0.936em;\"></span><span class=\"mord\"><span class=\"mopen nulldelimiter\"></span><span class=\"mfrac\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:1.427em;\"><span style=\"top:-2.314em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"mord\"><span class=\"mord\">∣</span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">initial</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mbin\">∪</span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">final</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span><span class=\"mord\">∣</span></span></span><span style=\"top:-3.23em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"frac-line\" style=\"border-bottom-width:0.04em;\"></span></span><span style=\"top:-3.677em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"mord\"><span class=\"mord\">∣</span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">initial</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mbin\">∩</span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">final</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span><span class=\"mord\">∣</span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.936em;\"><span></span></span></span></span></span><span class=\"mclose nulldelimiter\"></span></span></span></span></span></span>\n<ul>\n<li><strong>分子</strong>：初始结构和最终结构中同时满足相互作用阈值（D<sub>ij</sub>&lt;4.5 Å）的残基对数目。</li>\n<li><strong>分母</strong>：初始结构或最终结构中满足相互作用阈值的残基对数目。</li>\n</ul>\n<h5>② 余弦相似度</h5>\n<p>余弦相似度用于量化残基运动的相关性。</p>\n<span class=\"katex-display\"><span class=\"katex\"><span class=\"katex-mathml\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mtext>余弦相似度</mtext><mo>=</mo><mfrac><mrow><munder><mo>∑</mo><mrow><mi>i</mi><mo separator=\"true\">,</mo><mi>j</mi></mrow></munder><msub><mi>A</mi><mrow><mtext>initial</mtext><mo separator=\"true\">,</mo><mi>i</mi><mi>j</mi></mrow></msub><mo>⋅</mo><msub><mi>A</mi><mrow><mtext>final</mtext><mo separator=\"true\">,</mo><mi>i</mi><mi>j</mi></mrow></msub></mrow><mrow><msqrt><mrow><munder><mo>∑</mo><mrow><mi>i</mi><mo separator=\"true\">,</mo><mi>j</mi></mrow></munder><msubsup><mi>A</mi><mrow><mtext>initial</mtext><mo separator=\"true\">,</mo><mi>i</mi><mi>j</mi></mrow><mn>2</mn></msubsup></mrow></msqrt><mo>⋅</mo><msqrt><mrow><munder><mo>∑</mo><mrow><mi>i</mi><mo separator=\"true\">,</mo><mi>j</mi></mrow></munder><msubsup><mi>A</mi><mrow><mtext>final</mtext><mo separator=\"true\">,</mo><mi>i</mi><mi>j</mi></mrow><mn>2</mn></msubsup></mrow></msqrt></mrow></mfrac></mrow><annotation encoding=\"application/x-tex\">\\text{余弦相似度} = \\frac{\\sum_{i,j} A_{\\text{initial}, ij} \\cdot A_{\\text{final}, ij}}{\\sqrt{\\sum_{i,j} A_{\\text{initial}, ij}^2} \\cdot \\sqrt{\\sum_{i,j} A_{\\text{final}, ij}^2}}</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.6833em;\"></span><span class=\"mord text\"><span class=\"mord cjk_fallback\">余弦相似度</span></span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span><span class=\"mrel\">=</span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:3.3058em;vertical-align:-1.73em;\"></span><span class=\"mord\"><span class=\"mopen nulldelimiter\"></span><span class=\"mfrac\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:1.5758em;\"><span style=\"top:-2.11em;\"><span class=\"pstrut\" style=\"height:3.1642em;\"></span><span class=\"mord\"><span class=\"mord sqrt\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:1.1642em;\"><span class=\"svg-align\" style=\"top:-3.8em;\"><span class=\"pstrut\" style=\"height:3.8em;\"></span><span class=\"mord\" style=\"padding-left:1em;\"><span class=\"mop\"><span class=\"mop op-symbol small-op\" style=\"position:relative;top:0em;\">∑</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.162em;\"><span style=\"top:-2.4003em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord mathnormal mtight\">i</span><span class=\"mpunct mtight\">,</span><span class=\"mord mathnormal mtight\" style=\"margin-right:0.0572em;\">j</span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.4358em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.1667em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.7959em;\"><span style=\"top:-2.3987em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">initial</span></span><span class=\"mpunct mtight\">,</span><span class=\"mord mathnormal mtight\" style=\"margin-right:0.0572em;\">ij</span></span></span></span><span style=\"top:-3.0448em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\">2</span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.4374em;\"><span></span></span></span></span></span></span></span></span><span style=\"top:-3.1242em;\"><span class=\"pstrut\" style=\"height:3.8em;\"></span><span class=\"hide-tail\" style=\"min-width:1.02em;height:1.88em;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400em\" height=\"1.88em\" viewBox=\"0 0 400000 1944\" preserveAspectRatio=\"xMinYMin slice\"><path d=\"M983 90\nl0 -0\nc4,-6.7,10,-10,18,-10 H400000v40\nH1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7\ns-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744\nc-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30\nc26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722\nc56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5\nc53.7,-170.3,84.5,-266.8,92.5,-289.5z\nM1001 80h400000v40h-400000z\"/></svg></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.6758em;\"><span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mbin\">⋅</span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mord sqrt\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:1.1642em;\"><span class=\"svg-align\" style=\"top:-3.8em;\"><span class=\"pstrut\" style=\"height:3.8em;\"></span><span class=\"mord\" style=\"padding-left:1em;\"><span class=\"mop\"><span class=\"mop op-symbol small-op\" style=\"position:relative;top:0em;\">∑</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.162em;\"><span style=\"top:-2.4003em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord mathnormal mtight\">i</span><span class=\"mpunct mtight\">,</span><span class=\"mord mathnormal mtight\" style=\"margin-right:0.0572em;\">j</span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.4358em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.1667em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.7959em;\"><span style=\"top:-2.3987em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">final</span></span><span class=\"mpunct mtight\">,</span><span class=\"mord mathnormal mtight\" style=\"margin-right:0.0572em;\">ij</span></span></span></span><span style=\"top:-3.0448em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\">2</span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.4374em;\"><span></span></span></span></span></span></span></span></span><span style=\"top:-3.1242em;\"><span class=\"pstrut\" style=\"height:3.8em;\"></span><span class=\"hide-tail\" style=\"min-width:1.02em;height:1.88em;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400em\" height=\"1.88em\" viewBox=\"0 0 400000 1944\" preserveAspectRatio=\"xMinYMin slice\"><path d=\"M983 90\nl0 -0\nc4,-6.7,10,-10,18,-10 H400000v40\nH1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7\ns-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744\nc-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30\nc26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722\nc56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5\nc53.7,-170.3,84.5,-266.8,92.5,-289.5z\nM1001 80h400000v40h-400000z\"/></svg></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.6758em;\"><span></span></span></span></span></span></span></span><span style=\"top:-3.3942em;\"><span class=\"pstrut\" style=\"height:3.1642em;\"></span><span class=\"frac-line\" style=\"border-bottom-width:0.04em;\"></span></span><span style=\"top:-3.9901em;\"><span class=\"pstrut\" style=\"height:3.1642em;\"></span><span class=\"mord\"><span class=\"mop\"><span class=\"mop op-symbol small-op\" style=\"position:relative;top:0em;\">∑</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.162em;\"><span style=\"top:-2.4003em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord mathnormal mtight\">i</span><span class=\"mpunct mtight\">,</span><span class=\"mord mathnormal mtight\" style=\"margin-right:0.0572em;\">j</span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.4358em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.1667em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">initial</span></span><span class=\"mpunct mtight\">,</span><span class=\"mord mathnormal mtight\" style=\"margin-right:0.0572em;\">ij</span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.2861em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mbin\">⋅</span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">final</span></span><span class=\"mpunct mtight\">,</span><span class=\"mord mathnormal mtight\" style=\"margin-right:0.0572em;\">ij</span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.2861em;\"><span></span></span></span></span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:1.73em;\"><span></span></span></span></span></span><span class=\"mclose nulldelimiter\"></span></span></span></span></span></span>\n<ul>\n<li>A<sub>initial</sub>,<sub>ij</sub>​：初始结构的相互作用矩阵。</li>\n<li>A<sub>final</sub>,<sub>ij</sub>​：最终结构的相互作用矩阵。</li>\n</ul>\n<h4>衰减率</h4>\n<p>衰减率用于评估初始结构和最终结构中相互作用数目的变化。</p>\n<span class=\"katex-display\"><span class=\"katex\"><span class=\"katex-mathml\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><mtext>衰减率</mtext><mo>=</mo><mn>1</mn><mo>−</mo><mfrac><msub><mi>N</mi><mtext>final</mtext></msub><msub><mi>N</mi><mtext>initial</mtext></msub></mfrac></mrow><annotation encoding=\"application/x-tex\">\\text{衰减率} = 1 - \\frac{N_{\\text{final}}}{N_{\\text{initial}}}</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.6833em;\"></span><span class=\"mord text\"><span class=\"mord cjk_fallback\">衰减率</span></span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span><span class=\"mrel\">=</span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:0.7278em;vertical-align:-0.0833em;\"></span><span class=\"mord\">1</span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mbin\">−</span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:2.1963em;vertical-align:-0.836em;\"></span><span class=\"mord\"><span class=\"mopen nulldelimiter\"></span><span class=\"mfrac\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:1.3603em;\"><span style=\"top:-2.314em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"mord\"><span class=\"mord\"><span class=\"mord mathnormal\" style=\"margin-right:0.109em;\">N</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:-0.109em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">initial</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span></span></span><span style=\"top:-3.23em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"frac-line\" style=\"border-bottom-width:0.04em;\"></span></span><span style=\"top:-3.677em;\"><span class=\"pstrut\" style=\"height:3em;\"></span><span class=\"mord\"><span class=\"mord\"><span class=\"mord mathnormal\" style=\"margin-right:0.109em;\">N</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:-0.109em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">final</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.836em;\"><span></span></span></span></span></span><span class=\"mclose nulldelimiter\"></span></span></span></span></span></span>\n<ul>\n<li>N<sub>initial</sub>​：初始结构中满足相互作用阈值的残基对数目。</li>\n<li>N<sub>final</sub>​：最终结构中满足相互作用阈值的残基对数目。</li>\n</ul>\n<h4>公共关联的数目</h4>\n<p>公共关联的数目是指初始结构和最终结构中同时满足相互作用阈值的残基对数目。</p>\n<span class=\"katex-display\"><span class=\"katex\"><span class=\"katex-mathml\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\" display=\"block\"><semantics><mrow><msub><mi>N</mi><mtext>common</mtext></msub><mo>=</mo><mi mathvariant=\"normal\">∣</mi><msub><mi>A</mi><mtext>initial</mtext></msub><mo>∩</mo><msub><mi>A</mi><mtext>final</mtext></msub><mi mathvariant=\"normal\">∣</mi></mrow><annotation encoding=\"application/x-tex\">N_{\\text{common}} = |A_{\\text{initial}} \\cap A_{\\text{final}}|</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"base\"><span class=\"strut\" style=\"height:0.8333em;vertical-align:-0.15em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\" style=\"margin-right:0.109em;\">N</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.1514em;\"><span style=\"top:-2.55em;margin-left:-0.109em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">common</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span><span class=\"mrel\">=</span><span class=\"mspace\" style=\"margin-right:0.2778em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:1em;vertical-align:-0.25em;\"></span><span class=\"mord\">∣</span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">initial</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span><span class=\"mbin\">∩</span><span class=\"mspace\" style=\"margin-right:0.2222em;\"></span></span><span class=\"base\"><span class=\"strut\" style=\"height:1em;vertical-align:-0.25em;\"></span><span class=\"mord\"><span class=\"mord mathnormal\">A</span><span class=\"msupsub\"><span class=\"vlist-t vlist-t2\"><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.3361em;\"><span style=\"top:-2.55em;margin-left:0em;margin-right:0.05em;\"><span class=\"pstrut\" style=\"height:2.7em;\"></span><span class=\"sizing reset-size6 size3 mtight\"><span class=\"mord mtight\"><span class=\"mord text mtight\"><span class=\"mord mtight\">final</span></span></span></span></span></span><span class=\"vlist-s\">​</span></span><span class=\"vlist-r\"><span class=\"vlist\" style=\"height:0.15em;\"><span></span></span></span></span></span></span><span class=\"mord\">∣</span></span></span></span></span>\n<p><strong>代码实现：</strong></p>\n<pre><code class=\"language-python\">import numpy as np  \nimport pandas as pd  \n  \n# 使用 pandas 读取 CSV 文件  \ndf_initial = pd.read_csv(&#39;initial_distance_matrix.csv&#39;, index_col=0)  \ndf_final = pd.read_csv(&#39;final_distance_matrix.csv&#39;, index_col=0)  \n  \n# 将 DataFrame 转换为 NumPy 数组  \nD_initial = df_initial.to_numpy()  \nD_final = df_final.to_numpy()  \n  \n# 定义相互作用阈值  \nthreshold = 4.5  # Å  \n  \n# 构建相互作用矩阵  \nA_initial = (D_initial &lt; threshold).astype(int)  \nA_final = (D_final &lt; threshold).astype(int)  \n  \n# 统计关联的残基数目（只统计上三角部分，不包括对角线）  \ndef count_interactions(interaction_matrix):  \n    &quot;&quot;&quot;  \n    统计相互作用矩阵中满足条件的残基对数目（上三角部分，不包括对角线）。  \n    :param interaction_matrix: 相互作用矩阵（NumPy 数组）  \n    :return: 满足条件的残基对数目  \n    &quot;&quot;&quot;    count = 0  \n    n = interaction_matrix.shape[0]  \n    for i in range(n):  \n        for j in range(i + 1, n):  # 只遍历上三角部分，跳过对角线  \n            if interaction_matrix[i, j] == 1:  \n                count += 1  \n    return count  \n  \nN_initial = count_interactions(A_initial)  # 初始结构中关联的残基对数目  \nN_final = count_interactions(A_final)      # 最终结构中关联的残基对数目  \n  \n# 统计公共关联的数目  \ndef count_common_interactions(initial_matrix, final_matrix):  \n    &quot;&quot;&quot;  \n    统计初始结构和最终结构中同时满足相互作用阈值的残基对数目。  \n    :param initial_matrix: 初始结构的相互作用矩阵  \n    :param final_matrix: 最终结构的相互作用矩阵  \n    :return: 公共关联的残基对数目  \n    &quot;&quot;&quot;    count = 0  \n    n = initial_matrix.shape[0]  \n    for i in range(n):  \n        for j in range(i + 1, n):  # 只遍历上三角部分，跳过对角线  \n            if initial_matrix[i, j] &lt;mark&gt; 1 and final_matrix[i, j] &lt;/mark&gt; 1:  \n                count += 1  \n    return count  \n  \nN_common = count_common_interactions(A_initial, A_final)  # 公共关联的残基对数目  \n  \n# 计算 Jaccard 相似度  \nintersection = N_common  \nunion = N_initial + N_final - N_common  \njaccard_similarity = intersection / union  \n  \n# 计算余弦相似度  \ncosine_similarity = np.sum(A_initial * A_final) / (np.linalg.norm(A_initial) * np.linalg.norm(A_final))  \n  \n# 计算衰减率  \nreduction_ratio = 1 - (N_final / N_initial)  \n  \n# 输出统计结果  \nprint(f&quot;初始结构中关联的残基对数目: {N_initial}&quot;)  \nprint(f&quot;最终结构中关联的残基对数目: {N_final}&quot;)  \nprint(f&quot;公共关联的残基对数目: {N_common}&quot;)  \nprint(f&quot;Jaccard 相似度: {jaccard_similarity:.4f}&quot;)  \nprint(f&quot;余弦相似度: {cosine_similarity:.4f}&quot;)  \nprint(f&quot;衰减率: {reduction_ratio:.4f}&quot;)  \n  \n# 将满足相互作用阈值的残基对及其距离输出到新文件  \ndef save_interactions_to_file(distance_matrix, index_labels, output_file):  \n    &quot;&quot;&quot;  \n    将满足相互作用阈值的残基对及其距离保存到文件。  \n    :param distance_matrix: 距离矩阵（NumPy 数组）  \n    :param index_labels: 残基编号（DataFrame 的索引）  \n    :param output_file: 输出文件名  \n    &quot;&quot;&quot;    with open(output_file, &#39;w&#39;) as f:  \n        f.write(&quot;ResID1,ResID2,Distance\\n&quot;)  # 写入标题行  \n        n = distance_matrix.shape[0]  \n        for i in range(n):  \n            for j in range(i + 1, n):  # 只遍历上三角部分，跳过对角线  \n                if distance_matrix[i, j] &lt; threshold:  \n                    f.write(f&quot;{index_labels[i]},{index_labels[j]},{distance_matrix[i, j]:.2f}\\n&quot;)  \n  \n# 保存初始结构和最终结构的相互作用数据  \nsave_interactions_to_file(D_initial, df_initial.index, &#39;initial_interactions.csv&#39;)  \nsave_interactions_to_file(D_final, df_final.index, &#39;final_interactions.csv&#39;)  \n  \n# 保存公共关联的残基对及其距离到新文件  \ndef save_common_interactions(initial_matrix, final_matrix, index_labels, output_file):  \n    &quot;&quot;&quot;  \n    将初始结构和最终结构中同时满足相互作用阈值的残基对及其距离保存到文件。  \n    :param initial_matrix: 初始结构的距离矩阵  \n    :param final_matrix: 最终结构的距离矩阵  \n    :param index_labels: 残基编号（DataFrame 的索引）  \n    :param output_file: 输出文件名  \n    &quot;&quot;&quot;    with open(output_file, &#39;w&#39;) as f:  \n        f.write(&quot;ResID1,ResID2,Distance_Initial,Distance_Final\\n&quot;)  # 写入标题行  \n        n = initial_matrix.shape[0]  \n        for i in range(n):  \n            for j in range(i + 1, n):  # 只遍历上三角部分，跳过对角线  \n                if initial_matrix[i, j] &lt; threshold and final_matrix[i, j] &lt; threshold:  \n                    f.write(f&quot;{index_labels[i]},{index_labels[j]},{initial_matrix[i, j]:.2f},{final_matrix[i, j]:.2f}\\n&quot;)  \n  \n# 保存公共关联的残基对  \nsave_common_interactions(D_initial, D_final, df_initial.index, &#39;common_interactions.csv&#39;)  \n  \nprint(&quot;满足相互作用阈值的残基对已保存到 initial_interactions.csv 和 final_interactions.csv 文件中。&quot;)  \nprint(&quot;公共关联的残基对已保存到 common_interactions.csv 文件中。&quot;)\n</code></pre>\n<p>通过以上，可以快速分析蛋白质动力学模拟数据，统计残基关联性，并生成直观的结果文件。假设初始结构和最终结构的距离矩阵如下：</p>\n<h5>初始结构距离矩阵</h5>\n<p><img src=\"/article-assets/schrodinger-1/Pasted%20image%2020250131110624.png\" alt=\"Pasted image 20250131110624.png\"></p>\n<h5>最终结构距离矩阵</h5>\n<p><img src=\"/article-assets/schrodinger-1/Pasted%20image%2020250131110934.png\" alt=\"Pasted image 20250131110934.png\">\n运行代码后，输出结果如下：</p>\n<pre><code>初始结构中关联的残基对数目: 3\n最终结构中关联的残基对数目: 2\n公共关联的残基对数目: 1\nJaccard 相似度: 0.5000\n余弦相似度: 0.7071\n衰减率: 0.3333\n</code></pre>\n<p>公共关联的残基对也会输出保存到<code>common_interactions.csv</code>文件中。</p>\n<p>总的来说，关联相似度反映了关联的保守性，衰减率表征了体系的舒展和松弛程度。希望这篇推文能帮到大家，如果有任何问题或建议，欢迎在评论区留言。我们下期再见！</p>\n"
  },
  {
    "slug": "tools-1",
    "title": "轻松去水印！Python实现PDF文档水印一键清除",
    "description": "还在花钱开会员去除 PDF 水印？几行 Python 代码一键批量清除 PDF 水印，免费好用无限制。",
    "category": "软件工具",
    "tags": [
      "Python",
      "PDF工具",
      "效率办公"
    ],
    "date": "2024-09-10",
    "dateLabel": "2024.09.10",
    "readingTime": "3 分钟阅读",
    "toc": [
      {
        "id": "实现思路",
        "text": "实现思路",
        "level": 3
      },
      {
        "id": "核心代码解析",
        "text": "核心代码解析",
        "level": 3
      },
      {
        "id": "功能亮点",
        "text": "功能亮点",
        "level": 3
      },
      {
        "id": "总结",
        "text": "总结",
        "level": 3
      }
    ],
    "html": "<blockquote>\n<p>[!Tip] 引言\n在工作和学习中，PDF 文件是我们常常会接触到的一种文档格式。尽管它稳定、通用，但有时我们会遇到一些烦人的水印，影响阅读体验，或者需要处理的 PDF 文件太大，不方便分享。那么有没有简单的方法，能够很方便的去除PDF文件中的水印呢？答案是：有！今天，我们将带你了解如何使用 Python 和 PyMuPDF 库来解决这些问题。</p>\n</blockquote>\n<h3 id=\"实现思路\">实现思路</h3>\n<p>我们的主要目标有两个：</p>\n<ol>\n<li><strong>去除水印</strong>：遍历 PDF 的每个页面，将水印像素转变为白色。</li>\n<li><strong>压缩 PDF 文件</strong>：保持图像的分辨率不变，通过调整 JPEG 压缩率生成更小的 PDF 文件。</li>\n</ol>\n<p>具体实现分为以下几步：</p>\n<ol>\n<li>打开 PDF 文件，提取每一页作为图像。</li>\n<li>遍历图像的每个像素，将PDF水印中的RGB改为 (255, 255, 255) 即白色。</li>\n<li>保存去除水印后的图像，并使用 JPEG 压缩。</li>\n<li>将处理后的图像重新组合成 PDF 文件，并启用 PDF 内置压缩。</li>\n</ol>\n<p>本例中我们下载到一篇带水印的文献，如下所示：\n<img src=\"/article-assets/tools-1/Pasted%20image%2020240907182413%201.png\" alt=\"Pasted image 20240907182413 1.png\">\n先查看一下文档中水印的RGB值，可以使用微信的截图工具很方便的查看，</p>\n<h3 id=\"核心代码解析\">核心代码解析</h3>\n<p>以下是核心代码，展示如何去除 PDF 水印并生成体积较小的 PDF 文件：</p>\n<pre><code class=\"language-python\">import fitz  # PyMuPDF  \nfrom itertools import product  \nimport os  \n  \ndef remove_watermark_from_page(page, zoom=12.0):  \n    mat = fitz.Matrix(zoom, zoom)  \n    pix = page.get_pixmap(matrix=mat, alpha=False)  # alpha=False 以减少内存占用  \n    for pos in product(range(pix.width), range(pix.height)):  \n        if sum(pix.pixel(pos[0], pos[1])) &gt;= 660:  # 调整阈值  \n            pix.set_pixel(pos[0], pos[1], (255, 255, 255))  # 设置为白色  \n    return pix  \n  \ndef remove_pdf_watermark(input_pdf, output_dir, zoom=12.0):  \n    try:  \n        os.makedirs(output_dir, exist_ok=True)  \n        pdf_file = fitz.open(input_pdf)  \n  \n        for page_no in range(len(pdf_file)):  \n            page = pdf_file[page_no]  \n            pix = remove_watermark_from_page(page, zoom=zoom)  \n            output_image_path = os.path.join(output_dir, f&quot;{page_no}.jpg&quot;)  \n            # 使用高压缩率保存 JPEG 图像  \n            pix.save(output_image_path, &quot;jpeg&quot;, quality=75)  # quality 参数控制 JPEG 压缩率  \n            print(f&#39;第 {page_no} 页处理并保存为 {output_image_path}&#39;)  \n  \n        pdf_file.close()  \n    except Exception as e:  \n        print(f&quot;去水印过程中出错: {e}&quot;)  \n  \ndef images_to_pdf(images_dir, output_pdf):  \n    try:  \n        pdf = fitz.open()  \n        img_files = sorted(os.listdir(images_dir), key=lambda x: int(x.split(&#39;.&#39;)[0]))  \n  \n        for img in img_files:  \n            img_path = os.path.join(images_dir, img)  \n            img_pix = fitz.Pixmap(img_path)  \n  \n            # 创建与图像大小匹配的新页面  \n            pdf_page = pdf.new_page(width=img_pix.width, height=img_pix.height)  \n  \n            # 将图像插入到 PDF 页面中  \n            pdf_page.insert_image(pdf_page.rect, pixmap=img_pix, keep_proportion=True)  \n            print(f&quot;{img} 已添加到 PDF。&quot;)  \n  \n        pdf.save(output_pdf, deflate=True)  # 使用 deflate 压缩  \n        pdf.close()  \n        print(f&quot;PDF 已成功创建: {output_pdf}&quot;)  \n    except Exception as e:  \n        print(f&quot;创建 PDF 时出错: {e}&quot;)  \n  \nif __name__ == &#39;__main__&#39;:  \n    input_pdf = &quot;test.pdf&quot;  \n    output_dir = &quot;./watermark_removed_images&quot;  \n    output_pdf = &quot;result_no_watermark.pdf&quot;  \n  \n    remove_pdf_watermark(input_pdf, output_dir, zoom=12.0)  \n    images_to_pdf(output_dir, output_pdf)\n</code></pre>\n<p>运行后，<code>watermark_removed_images</code>文件夹中是去除水印后的图像，<code>result_no_watermark.pdf</code>为去除水印后的PDF文件。下图为去掉水印的效果，可以看到水印已经去除的非常干净，也保持了高清晰度。</p>\n<p><img src=\"/article-assets/tools-1/Pasted%20image%2020240907182015%201.png\" alt=\"Pasted image 20240907182015 1.png\"></p>\n<h3 id=\"功能亮点\">功能亮点</h3>\n<ol>\n<li><strong>保持高分辨率</strong>：在处理时保持 PDF 的图像的高分辨率，代码中通过<code>zoom=12.0</code>设置图像的dpi=1200，确保文档质量不会因为水印去除而受损。实际使用时可以根据需要调整该值。</li>\n<li><strong>灵活压缩</strong>：利用 JPEG 压缩算法，通过调整压缩率来实现文件体积的控制，通常 <code>quality=75</code> 是一个较为理想的数值，既保持了图像质量，又有效减小了文件体积。</li>\n<li><strong>内置压缩</strong>：利用 PyMuPDF 的 <code>deflate</code> 压缩功能，进一步优化生成的 PDF 文件大小。</li>\n</ol>\n<h3 id=\"总结\">总结</h3>\n<p>通过使用 Python 和 PyMuPDF，我们可以轻松去除 PDF 文件中的水印，并生成体积较小的高质量 PDF 文件。这种方法适合处理需要去水印且对文件大小敏感的场景，比如上传限制或文件传输要求。希望本教程能够帮助到你在日常工作中更好地处理 PDF 文档！</p>\n<p>如果你觉得这篇文章有帮助，欢迎点赞并分享给更多有需要的小伙伴~</p>\n"
  }
];

export const categories = ["全部","细胞生物学","生物信息学","CADD","软件工具"] as const;

export const tags: TagSummary[] = [
  {
    "name": "生信分析",
    "count": 4
  },
  {
    "name": "Python",
    "count": 4
  },
  {
    "name": "分子动力学",
    "count": 1
  },
  {
    "name": "科研绘图",
    "count": 1
  },
  {
    "name": "实验方案",
    "count": 1
  },
  {
    "name": "数据分析",
    "count": 1
  },
  {
    "name": "效率办公",
    "count": 1
  },
  {
    "name": "CETSA",
    "count": 1
  },
  {
    "name": "PDF工具",
    "count": 1
  },
  {
    "name": "Schrödinger",
    "count": 1
  }
];
