import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found section-shell">
      <span>404</span>
      <h1>这页笔记还没有写下。</h1>
      <p>也许链接已经移动，或者它正在成为下一篇文章。</p>
      <Link className="button button-primary" href="/">回到首页 →</Link>
    </section>
  );
}
