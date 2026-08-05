import Link from "next/link";
import type { Post } from "@/content/posts";

export function ArticleCard({ post, index }: { post: Post; index: number }) {
  return (
    <article className="article-card">
      <Link href={`/articles/${post.slug}`} aria-label={`阅读：${post.title}`}>
        <div className="article-card-top">
          <span className="article-number">{index.toString().padStart(2, "0")}</span>
          <span className="article-category">{post.category}</span>
        </div>
        <div>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {post.tags.length > 0 && (
            <div className="card-tags" aria-label="文章标签">
              {post.tags.slice(0, 3).map((tag) => <span key={tag}># {tag}</span>)}
            </div>
          )}
        </div>
        <div className="article-card-footer">
          <span>{post.dateLabel} · {post.readingTime}</span>
          <span className="round-arrow" aria-hidden="true">↗</span>
        </div>
      </Link>
    </article>
  );
}
