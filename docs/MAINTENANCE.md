# 叮当学术网站维护说明

本文件面向网站维护者，记录 Obsidian 文章同步和 GitHub Pages 发布流程。

## 文章目录

在 Obsidian 中将 `content/articles/` 作为 Vault 打开。文章按分类存放，图片放在当前分类的 `附件/` 文件夹。

```text
content/articles/生物信息学/
├── 我的文章.md
└── 附件/
    └── figure-1.png
```

## 推荐文章属性

```yaml
---
title: 我的文章
description: 文章简介
category: 生物信息学
tags:
  - 生信分析
date: 2026-08-05
readingTime: "8 分钟阅读"
draft: false
---
```

- `date` 是发布必填项，也支持 `created` 或 `published`。
- `draft: true` 或 `publish: false` 时不发布。
- 图片使用 Obsidian 语法 `![[figure-1.png]]`。
- 行内公式使用 `$E = mc^2$`，独立公式使用单独成行的 `$$ ... $$`。
- `_template.md` 不会发布，可以复制为新文章模板。

## 本地检查

```bash
npm run generate:posts
npm run dev
npm run lint
npm run build:github
```

## 同步发布

```bash
git add .
git commit -m "发布：文章标题"
git push
```

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 <https://sonify2026.github.io/>。
