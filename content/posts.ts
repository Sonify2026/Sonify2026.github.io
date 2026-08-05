import { posts } from "./generated-posts";
import type { Post } from "./post-types";

export { categories, posts, tags } from "./generated-posts";
export type { Post, TagSummary, TocItem } from "./post-types";

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentPost: Post, limit = 3) {
  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag)).length;
      const score = (post.category === currentPost.category ? 6 : 0) + sharedTags * 3;
      return { post, score };
    })
    .sort((left, right) => right.score - left.score || right.post.date.localeCompare(left.post.date))
    .slice(0, limit)
    .map(({ post }) => post);
}
