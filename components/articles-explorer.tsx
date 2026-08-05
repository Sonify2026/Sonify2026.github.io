"use client";

import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { categories, tags, type Post } from "@/content/posts";

type SortOrder = "desc" | "asc";

export function ArticlesExplorer({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState("全部");
  const [tag, setTag] = useState("");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

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

  const hasFilters = category !== "全部" || Boolean(tag) || Boolean(query.trim());
  const clearFilters = () => {
    setCategory("全部");
    setTag("");
    setQuery("");
    window.history.replaceState({}, "", window.location.pathname);
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
            onChange={(event) => setQuery(event.target.value)}
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
              onClick={() => setTag(tag === item.name ? "" : item.name)}
              aria-pressed={tag === item.name}
            >
              <span># {item.name}</span>
              <small>{item.count}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="archive-summary">
        <span>{visiblePosts.length.toString().padStart(2, "0")} 篇文章</span>
        <div>
          {tag && <span className="active-filter">标签：{tag}</span>}
          {hasFilters && <button type="button" onClick={clearFilters}>清除筛选</button>}
          <button
            className="sort-button"
            type="button"
            onClick={() => setSortOrder((current) => current === "desc" ? "asc" : "desc")}
            aria-label={sortOrder === "desc" ? "当前最新优先，点击改为最早优先" : "当前最早优先，点击改为最新优先"}
          >
            {sortOrder === "desc" ? "最新优先 ↓" : "最早优先 ↑"}
          </button>
        </div>
      </div>

      {visiblePosts.length > 0 ? (
        <div className="article-grid archive-grid">
          {visiblePosts.map((post, index) => (
            <ArticleCard key={post.slug} post={post} index={index + 1} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>没有找到匹配的文章</span>
          <button type="button" onClick={clearFilters}>清除筛选</button>
        </div>
      )}
    </div>
  );
}