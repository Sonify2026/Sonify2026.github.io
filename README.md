# 叮当学术｜科研文章、教程与工具

叮当学术的官方网站：发布科研文章与实操教程，并逐步开发实用科研工具。内容使用 Markdown 管理，支持分类、标签、搜索、Obsidian 双链和嵌入图片，通过 GitHub Actions 自动发布到 GitHub Pages。

## 1. 先完成个人信息

编辑 `content/site.ts`，替换姓名、缩写、简介、邮箱、GitHub 地址和网站地址。网站地址可以先保留占位值，创建 GitHub 仓库后再填写。

本地预览需要 Node.js 22.13 或更高版本：

```bash
npm install
npm run dev
```

## 2. 从 Obsidian 发布文章

把准备公开的笔记复制到 `content/articles/`。可以建立子文件夹；未填写 `category` 时，第一层文件夹名会自动作为分类。

推荐的 Obsidian Properties：

```yaml
---
title: 我的第一篇文章
description: 用一两句话概括文章；不填时会自动截取正文。
category: 随笔
tags:
  - Obsidian
  - 写作
date: 2026-08-05
draft: false
---
```

只有 `date` 是发布所必需的；`title` 默认使用文件名，`description` 可自动生成，`category` 默认使用文件夹名或“未分类”。也支持这些常见写法：

```yaml
tags: [Obsidian, 写作]
created: 2026-08-05      # 可代替 date
published: 2026-08-05    # 可代替 date
slug: my-first-post      # 可选，自定义文章网址
aliases: [旧标题, 笔记别名]
```

- `draft: true` 或 `publish: false`：不公开文章。
- 文件名可以是中文、英文或带空格；构建时会自动生成安全网址。
- `[[另一篇文章]]` 与 `[[另一篇文章|显示文字]]` 会转换为站内链接。
- `==高亮文字==` 会保留为网页高亮。
- `![[photo.jpg]]` 会优先读取当前文章所在目录的 `附件/photo.jpg`。
- 构建时只会复制正文实际引用的附件；旧文章仍可继续使用 `public/images/`。

推荐目录结构：

```text
content/articles/生物信息学/
├── 我的文章.md
└── 附件/
    ├── figure-1.png
    └── figure-2.png
```

文章中直接保留 Obsidian 语法即可：`![[figure-1.png]]`。
- `_template.md` 是可直接复制的新文章模板，以下划线开头的 Markdown 文件不会发布。

如果希望直接在 Obsidian 中维护网站，可以把 `content/articles/` 作为一个单独 Vault 打开；`.obsidian` 配置不会提交到 GitHub。

## 3. 分类、标签与搜索

文章页支持同时按“分类 + 标签 + 关键词”筛选。标签来自 `tags` 属性，搜索范围包含标题、摘要、分类和标签。文章详情页上的分类与标签也会返回对应的筛选结果。

## 4. 发布到 GitHub Pages

1. 在 GitHub 新建一个空仓库。
2. 将本项目推送到仓库的 `main` 分支。
3. 进入仓库的 **Settings → Pages**。
4. 将 **Source** 设为 **GitHub Actions**。
5. 推送新文章后，`.github/workflows/deploy.yml` 会自动构建并发布。

普通仓库会发布到 `https://用户名.github.io/仓库名/`；如果仓库名为 `用户名.github.io`，则发布到根域名。项目已兼容这两种路径。

常用命令：

```bash
npm run generate:posts # 重新读取 Obsidian / Markdown 文章
npm run dev            # 本地预览
npm run build:github   # 验证 GitHub Pages 静态构建
npm run lint           # 代码检查
```

## 目录

```text
content/articles/      Obsidian / Markdown 文章，可使用子文件夹
content/site.ts        姓名、简介、链接等站点配置
分类/附件/             当前分类文章的 Obsidian 附件（推荐）
public/images/         旧文章的公共图片（继续兼容）
components/            分类、标签、搜索等界面
app/                   页面与全站样式
.github/workflows/     GitHub Pages 自动发布
```

`content/generated-posts.ts` 由构建脚本自动生成，不要手动修改。


