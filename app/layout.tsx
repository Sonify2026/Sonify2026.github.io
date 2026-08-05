import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/content/site";

const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name}｜科研文章与工具`,
    template: `%s｜${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: { icon: `${basePath}${siteConfig.logo}` },
  openGraph: {
    title: `${siteConfig.name}｜科研文章与工具`,
    description: siteConfig.description,
    type: "website",
    locale: "zh_CN",
  },
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">跳到正文</a>
        <header className="site-header">
          <div className="section-shell header-inner">
            <Link className="brand brand-with-logo" href="/" aria-label={`${siteConfig.name}首页`}>
              <span className="header-logo-frame">
                <Image src={`${basePath}${siteConfig.logo}`} alt="" width={900} height={900} priority />
              </span>
              <span className="brand-wordmark">
                <strong>{siteConfig.name}</strong>
                <small>{siteConfig.englishName}</small>
              </span>
            </Link>
            <nav className="main-nav" aria-label="主导航">
              {siteConfig.navigation.map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
            </nav>
            <a className="header-github" href={`mailto:${siteConfig.email}`}>
              联系 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="section-shell footer-grid">
            <div>
              <Link className="footer-brand" href="/">{siteConfig.name}<sup>®</sup></Link>
              <p>{siteConfig.description}</p>
            </div>
            <div className="footer-links">
              <div>
                <strong>浏览</strong>
                <Link href="/articles">全部文章</Link>
                <Link href="/about">关于品牌</Link>
              </div>
              <div>
                <strong>联系</strong>
                <span>公众号：{siteConfig.wechat}</span>
                <a href={`mailto:${siteConfig.email}`}>Email</a>
              </div>
            </div>
          </div>
          <div className="section-shell footer-bottom">
            <span>© 2026 {siteConfig.name}. 保留所有权利。</span>
            <span>轻松科研，简单生活。</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

