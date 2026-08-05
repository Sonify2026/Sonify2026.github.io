---
title: 轻松去水印！Python实现PDF文档水印一键清除
slug: Tools_1
description: 还在花钱开会员去除 PDF 水印？几行 Python 代码一键批量清除 PDF 水印，免费好用无限制。
category: 软件工具
tags:
  - Python
  - "#PDF工具"
  - "#效率办公"
date: 2024-09-10
draft: false
---

> [!Tip] 引言
在工作和学习中，PDF 文件是我们常常会接触到的一种文档格式。尽管它稳定、通用，但有时我们会遇到一些烦人的水印，影响阅读体验，或者需要处理的 PDF 文件太大，不方便分享。那么有没有简单的方法，能够很方便的去除PDF文件中的水印呢？答案是：有！今天，我们将带你了解如何使用 Python 和 PyMuPDF 库来解决这些问题。

### 实现思路

我们的主要目标有两个：
1. **去除水印**：遍历 PDF 的每个页面，将水印像素转变为白色。
2. **压缩 PDF 文件**：保持图像的分辨率不变，通过调整 JPEG 压缩率生成更小的 PDF 文件。

具体实现分为以下几步：
1. 打开 PDF 文件，提取每一页作为图像。
2. 遍历图像的每个像素，将PDF水印中的RGB改为 (255, 255, 255) 即白色。
3. 保存去除水印后的图像，并使用 JPEG 压缩。
4. 将处理后的图像重新组合成 PDF 文件，并启用 PDF 内置压缩。

本例中我们下载到一篇带水印的文献，如下所示：
![[Pasted image 20240907182413 1.png]]
先查看一下文档中水印的RGB值，可以使用微信的截图工具很方便的查看，

### 核心代码解析

以下是核心代码，展示如何去除 PDF 水印并生成体积较小的 PDF 文件：

```python
import fitz  # PyMuPDF  
from itertools import product  
import os  
  
def remove_watermark_from_page(page, zoom=12.0):  
    mat = fitz.Matrix(zoom, zoom)  
    pix = page.get_pixmap(matrix=mat, alpha=False)  # alpha=False 以减少内存占用  
    for pos in product(range(pix.width), range(pix.height)):  
        if sum(pix.pixel(pos[0], pos[1])) >= 660:  # 调整阈值  
            pix.set_pixel(pos[0], pos[1], (255, 255, 255))  # 设置为白色  
    return pix  
  
def remove_pdf_watermark(input_pdf, output_dir, zoom=12.0):  
    try:  
        os.makedirs(output_dir, exist_ok=True)  
        pdf_file = fitz.open(input_pdf)  
  
        for page_no in range(len(pdf_file)):  
            page = pdf_file[page_no]  
            pix = remove_watermark_from_page(page, zoom=zoom)  
            output_image_path = os.path.join(output_dir, f"{page_no}.jpg")  
            # 使用高压缩率保存 JPEG 图像  
            pix.save(output_image_path, "jpeg", quality=75)  # quality 参数控制 JPEG 压缩率  
            print(f'第 {page_no} 页处理并保存为 {output_image_path}')  
  
        pdf_file.close()  
    except Exception as e:  
        print(f"去水印过程中出错: {e}")  
  
def images_to_pdf(images_dir, output_pdf):  
    try:  
        pdf = fitz.open()  
        img_files = sorted(os.listdir(images_dir), key=lambda x: int(x.split('.')[0]))  
  
        for img in img_files:  
            img_path = os.path.join(images_dir, img)  
            img_pix = fitz.Pixmap(img_path)  
  
            # 创建与图像大小匹配的新页面  
            pdf_page = pdf.new_page(width=img_pix.width, height=img_pix.height)  
  
            # 将图像插入到 PDF 页面中  
            pdf_page.insert_image(pdf_page.rect, pixmap=img_pix, keep_proportion=True)  
            print(f"{img} 已添加到 PDF。")  
  
        pdf.save(output_pdf, deflate=True)  # 使用 deflate 压缩  
        pdf.close()  
        print(f"PDF 已成功创建: {output_pdf}")  
    except Exception as e:  
        print(f"创建 PDF 时出错: {e}")  
  
if __name__ == '__main__':  
    input_pdf = "test.pdf"  
    output_dir = "./watermark_removed_images"  
    output_pdf = "result_no_watermark.pdf"  
  
    remove_pdf_watermark(input_pdf, output_dir, zoom=12.0)  
    images_to_pdf(output_dir, output_pdf)
```

运行后，`watermark_removed_images`文件夹中是去除水印后的图像，`result_no_watermark.pdf`为去除水印后的PDF文件。下图为去掉水印的效果，可以看到水印已经去除的非常干净，也保持了高清晰度。

![[Pasted image 20240907182015 1.png]]
### 功能亮点

1. **保持高分辨率**：在处理时保持 PDF 的图像的高分辨率，代码中通过`zoom=12.0`设置图像的dpi=1200，确保文档质量不会因为水印去除而受损。实际使用时可以根据需要调整该值。
2. **灵活压缩**：利用 JPEG 压缩算法，通过调整压缩率来实现文件体积的控制，通常 `quality=75` 是一个较为理想的数值，既保持了图像质量，又有效减小了文件体积。
3. **内置压缩**：利用 PyMuPDF 的 `deflate` 压缩功能，进一步优化生成的 PDF 文件大小。

### 总结

通过使用 Python 和 PyMuPDF，我们可以轻松去除 PDF 文件中的水印，并生成体积较小的高质量 PDF 文件。这种方法适合处理需要去水印且对文件大小敏感的场景，比如上传限制或文件传输要求。希望本教程能够帮助到你在日常工作中更好地处理 PDF 文档！

如果你觉得这篇文章有帮助，欢迎点赞并分享给更多有需要的小伙伴~