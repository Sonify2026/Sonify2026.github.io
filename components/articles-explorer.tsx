"use client";

import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { categories, tags, type Post } from "@/content/posts";

type SortOrder = "desc" | "asc";
type PageItem = number | "ellipsis-left" | "ellipsis-right";

const POSTS_PER_PAGE = 6;

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "ellipsis-right", totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis-left", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right", totalPages];
}

export function ArticlesExplorer({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState("全部");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      const tagParam = params.get("tag");
      const validCategory = categoryParam && categories.some((item) => item === categoryParam) ? categoryParam : "全部";
      if (validCategory !== "全部") setCategory(validCategory);
      if (
        tagParam
        && tags.some((item) => item.name === tagParam)
        && posts.some((post) => (validCategory === "全部" || post.category === validCategory) && post.tags.includes(tagParam))
      ) setTag(tagParam);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [posts]);

  const availableTags = useMemo(() => {
    const counts = new Map<string, number>();
    posts
      .filter((post) => category === "全部" || post.category === category)
      .forEach((post) => post.tags.forEach((postTag) => counts.set(postTag, (counts.get(postTag) ?? 0) + 1)));

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "zh-CN"));
  }, [category, posts]);

  const visiblePosts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return posts
      .filter((post) => {
        const categoryMatches = category === "全部" || post.category === category;
        const tagMatches = !tag || post.tags.includes(tag);
        const haystack = `${post.title} ${post.description} ${post.category} ${post.tags.join(" ")}`.toLocaleLowerCase();
        return categoryMatches && tagMatches && (!normalized || haystack.includes(normalized));
      })
      .sort((left, right) => sortOrder === "desc" ? right.date.localeCompare(left.date) : left.date.localeCompare(right.date));
  }, [category, posts, query, sortOrder, tag]);

  const totalPages = Math.max(1, Math.ceil(visiblePosts.length / POSTS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = visiblePosts.slice(pageStart, pageStart + POSTS_PER_PAGE);
  const pageItems = getPageItems(activePage, totalPages);
  const visibleStart = visiblePosts.length === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(pageStart + POSTS_PER_PAGE, visiblePosts.length);

  const hasFilters = category !== "全部" || Boolean(tag) || Boolean(query.trim());
  const clearFilters = () => {
    setCategory("全部");
    setTag("");
    setQuery("");
    setCurrentPage(1);
    window.history.replaceState({}, "", window.location.pathname);
  };
  const changePage = (page: number) => {
    setCurrentPage(page);
    window.requestAnimationFrame(() => {
      document.getElementById("article-results")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="articles-explorer" id="topics">
      <div className="archive-controls">
        <div>
          <span className="filter-label">按研究方向浏览</span>
          <div className="category-tabs" aria-label="按分类筛选">
            {categories.map((item) => (
              <button
                className={category === item ? "active" : ""}
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setTag("");
                  setCurrentPage(1);
                }}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <label className="search-field">
          <span className="sr-only">搜索文章</span>
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="搜索标题、工具、分类或标签"
            type="search"
          />
        </label>
      </div>

      <div className="tag-filter" aria-label="按标签筛选">
        <span className="filter-label">标签词云 · {category === "全部" ? "全部分类" : category}</span>
        <div className="tag-cloud archive-tag-cloud">
          {availableTags.map((item) => (
            <button
              className={tag === item.name ? "active" : ""}
              key={item.name}
              type="button"
              onClick={() => {
                setTag(tag === item.name ? "" : item.name);
                setCurrentPage(1);
              }}
              aria-pressed={tag === item.name}
            >
              <span># {item.name}</span>
              <small>{item.count}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="archive-summary" id="article-results">
        <span>
          {visiblePosts.length.toString().padStart(2, "0")} 篇文章
          {visiblePosts.length > 0 && ` · 当前显示 ${visibleStart}–${visibleEnd}`}
        </span>
        <div>
          {tag && <span className="active-filter">标签：{tag}</span>}
          {hasFilters && <button type="button" onClick={clearFilters}>清除筛选</button>}
          <button
            className="sort-button"
            type="button"
            onClick={() => {
              setSortOrder((current) => current === "desc" ? "asc" : "desc");
              setCurrentPage(1);
            }}
            aria-label={sortOrder === "desc" ? "当前最新优先，点击改为最早优先" : "当前最早优先，点击改为最新优先"}
          >
            {sortOrder === "desc" ? "最新优先 ↓" : "最早优先 ↑"}
          </button>
        </div>
      </div>

      {visiblePosts.length > 0 ? (
        <>
          <div className="article-grid archive-grid">
            {paginatedPosts.map((post, index) => (
              <ArticleCard key={post.slug} post={post} index={pageStart + index + 1} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="文章分页">
              <button
                type="button"
                disabled={activePage === 1}
                onClick={() => changePage(activePage - 1)}
                aria-label="上一页"
              >
                ← 上一页
              </button>
              <div className="pagination-pages">
                {pageItems.map((item) => typeof item === "number" ? (
                  <button
                    type="button"
                    key={item}
                    onClick={() => changePage(item)}
                    aria-current={item === activePage ? "page" : undefined}
                    aria-label={`第 ${item} 页`}
                  >
                    {item.toString().padStart(2, "0")}
                  </button>
                ) : (
                  <span className="pagination-ellipsis" key={item} aria-hidden="true">…</span>
                ))}
              </div>
              <button
                type="button"
                disabled={activePage === totalPages}
                onClick={() => changePage(activePage + 1)}
                aria-label="下一页"
              >
                下一页 →
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="empty-state">
          <span>没有找到匹配的文章</span>
          <button type="button" onClick={clearFilters}>清除筛选</button>
        </div>
      )}
    </div>
  );
}
