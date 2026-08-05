import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ReadingProgress } from "@/components/reading-progress";
import { ShareButton } from "@/components/share-button";
import { getPost, getRelatedPosts, posts, tags } from "@/content/posts";
import { siteConfig } from "@/content/site";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const currentIndex = posts.findIndex((item) => item.slug === slug);
  const nextPost = posts[(currentIndex + 1) % posts.length];
  const relatedPosts = getRelatedPosts(post, 3);
  const maxTagCount = Math.max(1, ...tags.map((tag) => tag.count));
  const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";
  const articleHtml = basePath
    ? post.html
        .replaceAll('href="/', `href="${basePath}/`)
        .replaceAll('src="/', `src="${basePath}/`)
    : post.html;

  return (
    <article className="post-page">
      <ReadingProgress />
      <header className="post-header section-shell">
        <Link className="back-link" href="/articles"><span aria-hidden="true">←</span> 返回内容库</Link>
        <div className="post-header-content">
          <div className="article-meta">
            <Link href={`/articles?category=${encodeURIComponent(post.category)}`}>{post.category}</Link>
            <time dateTime={post.date}>{post.dateLabel}</time>
            <span>{post.readingTime}</span>
          </div>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          {post.tags.length > 0 && (
            <div className="post-tags" aria-label="文章标签">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/articles?tag=${encodeURIComponent(tag)}`}># {tag}</Link>
              ))}
            </div>
          )}
        </div>
        <div className="post-header-footer">
          <span>来源 / 微信公众号「{siteConfig.wechat}」</span>
          <span aria-hidden="true">↓</span>
        </div>
      </header>

      <div className="post-layout section-shell">
        <aside className="post-aside">
          <div className="post-aside-index">
            <span>ARTICLE</span>
            <strong>{(currentIndex + 1).toString().padStart(2, "0")}</strong>
          </div>
          {post.toc.length > 0 && (
            <nav className="post-toc" aria-label="文章目录">
              <span>本页目录</span>
              {post.toc.map((item) => (
                <a className={item.level === 3 ? "toc-level-3" : ""} key={item.id} href={`#${item.id}`}>{item.text}</a>
              ))}
            </nav>
          )}
          <ShareButton />
        </aside>
        <div className="prose" dangerouslySetInnerHTML={{ __html: articleHtml }} />
      </div>

      <section className="post-recommendations section-shell" aria-labelledby="related-title">
        <div className="section-heading">
          <div><p className="eyebrow">KEEP EXPLORING</p><h2 id="related-title">相关阅读</h2></div>
          <Link className="text-link" href={`/articles?category=${encodeURIComponent(post.category)}`}>查看「{post.category}」全部文章 →</Link>
        </div>
        <div className="article-grid related-grid">
          {relatedPosts.map((relatedPost, index) => (
            <ArticleCard key={relatedPost.slug} post={relatedPost} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="post-discovery">
        <div className="section-shell post-discovery-inner">
          <div className="discovery-copy">
            <p className="eyebrow">TOPIC MAP</p>
            <h2>从标签继续发现</h2>
            <p>标签把不同研究方向中的工具、方法和问题连接起来。</p>
          </div>
          <div className="detail-tag-cloud" aria-label="全站标签词云">
            {tags.map((tag) => {
              const weight = 12 + Math.round((tag.count / maxTagCount) * 8);
              return <Link style={{ fontSize: `${weight}px` }} key={tag.name} href={`/articles?tag=${encodeURIComponent(tag.name)}`}># {tag.name}<small>{tag.count}</small></Link>;
            })}
          </div>
          <div className="wechat-card">
            <span>WECHAT</span>
            <strong>关注公众号「{siteConfig.wechat}」</strong>
            <p>获取新文章、教程与科研工具的更新提醒。</p>
          </div>
        </div>
      </section>

      <footer className="post-next">
        <div className="section-shell post-next-inner">
          <span>下一篇文章</span>
          <Link href={`/articles/${nextPost.slug}`}>
            <strong>{nextPost.title}</strong>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </footer>
    </article>
  );
}
