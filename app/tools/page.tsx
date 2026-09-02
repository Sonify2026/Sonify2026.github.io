import type { Metadata } from "next";
import { labTools, labToolsHomeUrl } from "@/content/tools";

export const metadata: Metadata = {
  title: "科研工具",
  description: "无需安装、直接在浏览器中使用的实验室管理、科研计算与数据处理工具。",
};

export default function ToolsPage() {
  return (
    <section className="section-shell tools-page">
      <div className="page-intro tools-intro">
        <p className="eyebrow">RESEARCH TOOLKIT</p>
        <h1>科研工具箱</h1>
        <p>
          把实验室里高频、重复、容易出错的小任务，整理成无需安装、打开即用的浏览器工具。
          当前已上线 {labTools.length} 个工具。
        </p>
      </div>

      <div className="tools-privacy-note">
        <span aria-hidden="true">LOCAL FIRST</span>
        <p>工具无需注册账号，也没有业务后端。库存与密码库数据仅保存在当前浏览器中；重要数据请及时导出备份。</p>
        <a href={labToolsHomeUrl} target="_blank" rel="noreferrer">查看独立工具站 ↗</a>
      </div>

      <div className="tools-catalog" aria-label="科研工具列表">
        {labTools.map((tool, index) => (
          <a className="tool-catalog-card" href={tool.href} target="_blank" rel="noreferrer" key={tool.name}>
            <div className="tool-catalog-topline">
              <span>{(index + 1).toString().padStart(2, "0")}</span>
              <small>{tool.category}</small>
            </div>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <div className="tool-feature-list" aria-label={`${tool.name}功能`}>
              {tool.features.map((feature) => <span key={feature}>{feature}</span>)}
            </div>
            <div className="tool-catalog-footer">
              <small>{tool.dataNote}</small>
              <strong>打开工具 ↗</strong>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
