import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "关于",
  description: `了解${siteConfig.name}的内容方向与写作原则。`,
};

const principles = [
  { number: "01", title: "实操优先", text: "从科研中的真实问题出发，用完整步骤带你走到一个可验证的结果。" },
  { number: "02", title: "讲清原理", text: "不只记录按钮和参数，也解释工具背后的判断逻辑与适用边界。" },
  { number: "03", title: "开放积累", text: "把公众号内容整理成可搜索、可关联、可以长期更新的文章库，并逐步加入科研工具。" },
];

export default function AboutPage() {
  const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";

  return (
    <>
      <section className="section-shell about-hero">
        <div className="about-portrait brand-about-logo" aria-hidden="true">
          <Image src={`${basePath}${siteConfig.logo}`} alt="" width={900} height={900} priority />
        </div>
        <div className="about-hero-copy">
          <p className="eyebrow">ABOUT / 关于</p>
          <h1>你好，这里是<br />{siteConfig.name}。</h1>
          <p className="about-lead">一个持续分享科研教程、研究文章并开发实用科研工具的中文内容平台。</p>
          <p>内容从微信公众号“叮当学术”持续整理而来，覆盖计算机辅助药物设计、生物信息学、细胞生物学、科研绘图和科研效率，也会更新研究思考及其它值得长期保存的文章。网站把分散的内容重新组织为可以搜索、分类和连续阅读的知识地图。</p>
          <div className="about-contact">
            <a className="button button-primary" href={`mailto:${siteConfig.email}`}>邮件联系 ↗</a>
            <Link className="text-link" href="/articles">浏览全部文章 →</Link>
          </div>
        </div>
      </section>

      <section className="principles-section">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="eyebrow">CONTENT PRINCIPLES</p><h2>内容原则</h2></div>
          </div>
          <div className="principles-grid">
            {principles.map((principle) => (
              <article key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell about-closing section-block">
        <p className="eyebrow">FROM WECHAT TO THE WEB</p>
        <h2>让好内容更容易被再次找到</h2>
        <div className="about-closing-grid">
          <p>公众号适合持续发布，网站适合长期检索。我们保留实操教程的完整步骤，也收录方法文章与研究思考；通过分类、标签、相关推荐和站内搜索，让旧内容重新形成联系。</p>
          <p>如果你在复现内容时发现问题，或希望某个重复的科研任务被做成小工具，欢迎通过邮件交流。每一次反馈都会帮助这个平台变得更实用。</p>
        </div>
        <a className="button button-outline" href={`mailto:${siteConfig.email}`}>{siteConfig.email} <span aria-hidden="true">↗</span></a>
      </section>
    </>
  );
}
