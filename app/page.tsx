import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { posts, tags } from "@/content/posts";
import { siteConfig } from "@/content/site";

const toolRoadmap = [
  { code: "01", title: "序列处理助手", text: "FASTA 清理、反向互补、长度统计等高频序列操作。" },
  { code: "02", title: "科研图表助手", text: "帮助整理绘图参数、配色方案与常用图表工作流。" },
  { code: "03", title: "数据格式转换", text: "处理 CSV、TSV 与常见科研文本格式之间的转换。" },
];

export default function Home() {
  const [featured, ...latest] = posts;
  const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";
  const topicCounts = new Map<string, number>();
  for (const post of posts) topicCounts.set(post.category, (topicCounts.get(post.category) ?? 0) + 1);
  const topics = [...topicCounts].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "zh-CN"));

  return (
    <>
      <section className="hero section-shell academic-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">BRAINY BELL · 科研内容与工具</p>
          <h1 id="hero-title">
            把复杂的科研步骤，
            <span>讲成可以理解、照着做的方法。</span>
          </h1>
          <p className="hero-intro">{siteConfig.introduction}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/articles">
              浏览全部文章 <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/articles#topics">
              按研究主题查找 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <aside className="brand-board" aria-label="叮当学术品牌信息">
          <div className="brand-board-logo">
            <Image src={`${basePath}${siteConfig.logo}`} alt="叮当学术 Brainy Bell" width={900} height={900} priority />
          </div>
          <div className="brand-board-copy">
            <span>公众号 / {siteConfig.wechat}</span>
            <p>{siteConfig.now}</p>
          </div>
          <div className="brand-metrics">
            <div><strong>{posts.length.toString().padStart(2, "0")}</strong><span>篇内容</span></div>
            <div><strong>{topicCounts.size.toString().padStart(2, "0")}</strong><span>个主题</span></div>
            <div><strong>{tags.length.toString().padStart(2, "0")}</strong><span>个标签</span></div>
          </div>
        </aside>
      </section>

      <section className="section-shell section-block" aria-labelledby="featured-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LATEST CONTENT</p>
            <h2 id="featured-title">最新发布</h2>
          </div>
          <Link className="text-link" href="/articles">
            查看全部文章 <span aria-hidden="true">→</span>
          </Link>
        </div>

        <Link className="featured-story" href={`/articles/${featured.slug}`}>
          <div className="featured-index" aria-hidden="true">NEW</div>
          <div className="featured-content">
            <div className="article-meta">
              <span>{featured.category}</span>
              <span>{featured.dateLabel}</span>
              <span>{featured.readingTime}</span>
            </div>
            <h3>{featured.title}</h3>
            <p>{featured.description}</p>
            <div className="featured-tags">
              {featured.tags.slice(0, 3).map((tag) => <span key={tag}># {tag}</span>)}
            </div>
            <span className="read-more">开始阅读 <span aria-hidden="true">↗</span></span>
          </div>
          <div className="featured-mark" aria-hidden="true">
            <span>实操</span>
            <strong>↗</strong>
          </div>
        </Link>
      </section>

      <section className="topic-section" id="topics" aria-labelledby="topics-title">
        <div className="section-shell section-block">
          <div className="section-heading">
            <div><p className="eyebrow">RESEARCH TOPICS</p><h2 id="topics-title">按主题学习</h2></div>
            <p className="section-note">从一个明确的问题开始，找到相关方法、文章与工具。</p>
          </div>
          <div className="topic-grid">
            {topics.map(([name, count], index) => (
              <Link key={name} href={`/articles?category=${encodeURIComponent(name)}`}>
                <span>{(index + 1).toString().padStart(2, "0")}</span>
                <div><strong>{name}</strong><small>{count} 篇文章</small></div>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-block latest-section" aria-labelledby="latest-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">STEP-BY-STEP</p>
            <h2 id="latest-title">继续探索</h2>
          </div>
          <p className="section-note">数据库检索、科研绘图与可复现的分析流程。</p>
        </div>
        <div className="article-grid">
          {latest.slice(0, 3).map((post, index) => (
            <ArticleCard key={post.slug} post={post} index={index + 2} />
          ))}
        </div>
      </section>


      <section className="tool-roadmap" id="tools" aria-labelledby="tools-title">
        <div className="section-shell section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RESEARCH TOOLS</p>
              <h2 id="tools-title">科研工具实验室</h2>
            </div>
            <p className="section-note">从反复出现的小问题开始，逐步开发真正省时间的工具。</p>
          </div>
          <div className="tool-roadmap-grid">
            {toolRoadmap.map((tool) => (
              <article key={tool.code}>
                <span>{tool.code}</span>
                <div>
                  <small>规划开发中</small>
                  <h3>{tool.title}</h3>
                  <p>{tool.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="tool-roadmap-note">工具会随着内容积累逐步上线。如果你有经常重复处理的科研任务，欢迎通过邮件告诉我。</p>
        </div>
      </section>
      <section className="manifesto" aria-label="品牌理念">
        <div className="section-shell manifesto-inner">
          <span className="manifesto-kicker">WHY BRAINY BELL</span>
          <blockquote>
            “好的科研内容，不只告诉你点击哪里，
            <em>还应该让你明白为什么这样做。</em>”
          </blockquote>
          <span className="manifesto-signature">— {siteConfig.name}</span>
        </div>
      </section>

      <section className="section-shell about-preview section-block brand-about-preview">
        <div className="brand-visual" aria-hidden="true">
          <Image src={`${basePath}${siteConfig.logo}`} alt="" width={900} height={900} />
        </div>
        <div className="about-preview-copy">
          <p className="eyebrow">ABOUT BRAINY BELL</p>
          <h2>轻松科研，简单生活。</h2>
          <p>{siteConfig.aboutShort}</p>
          <div className="home-tag-cloud" aria-label="热门标签">
            {tags.slice(0, 10).map((tag) => (
              <Link key={tag.name} href={`/articles?tag=${encodeURIComponent(tag.name)}`}># {tag.name}</Link>
            ))}
          </div>
          <Link className="button button-outline" href="/about">
            了解叮当学术 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
