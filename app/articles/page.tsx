import type { Metadata } from "next";
import { ArticlesExplorer } from "@/components/articles-explorer";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "科研文章",
  description: "按研究方向、标签、关键词和发布时间浏览叮当学术文章。",
};

export default function ArticlesPage() {
  return (
    <section className="section-shell archive-page">
      <div className="page-intro">
        <p className="eyebrow">CONTENT LIBRARY</p>
        <h1>科研内容库</h1>
        <p>从一个具体问题出发，找到可以照着完成的分析流程。当前收录 {posts.length} 篇文章，支持分类、标签、关键词与时间排序。</p>
      </div>
      <ArticlesExplorer posts={posts} />
    </section>
  );
}
