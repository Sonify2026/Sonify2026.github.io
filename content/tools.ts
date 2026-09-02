export type LabTool = {
  name: string;
  category: string;
  description: string;
  href: string;
  dataNote: string;
  features: readonly string[];
};

const labToolsBaseUrl = "https://sonify2026.github.io/lab-tools";

export const labTools: readonly LabTool[] = [
  {
    name: "细胞冻存管理",
    category: "样本管理",
    description: "用可视化容器网格管理细胞冻存位置，支持批量入库、全局搜索与低库存预警。",
    href: `${labToolsBaseUrl}/tools/cell-storage/`,
    dataNote: "数据保存在当前浏览器",
    features: ["容器网格", "批量入库", "库存预警"],
  },
  {
    name: "抗体库存管理",
    category: "库存管理",
    description: "记录抗体位置与余量，支持拖拽移动、快速检索以及 JSON 备份与恢复。",
    href: `${labToolsBaseUrl}/tools/antibody-inventory/`,
    dataNote: "数据保存在当前浏览器",
    features: ["位置管理", "余量估算", "备份恢复"],
  },
  {
    name: "实验室药品管理",
    category: "库存管理",
    description: "统一管理试剂批次、出入库记录与标签，及时发现临期药品和低库存项目。",
    href: `${labToolsBaseUrl}/tools/reagent-manager/`,
    dataNote: "数据保存在当前浏览器",
    features: ["批次库存", "出入库流水", "到期预警"],
  },
  {
    name: "IC50 计算器",
    category: "数据拟合",
    description: "在浏览器中完成四参数逻辑回归，查看 IC50、Hill、R² 和 RMSE，并导出结果图。",
    href: `${labToolsBaseUrl}/tools/ic50_calculator/`,
    dataNote: "计算数据不会持久化",
    features: ["4PL 拟合", "质量指标", "PNG 导出"],
  },
  {
    name: "摩尔计算器",
    category: "溶液计算",
    description: "解析化学式并计算摩尔质量，完成质量、物质的量和溶液浓度之间的常用换算。",
    href: `${labToolsBaseUrl}/tools/molarity_calculator/`,
    dataNote: "仅保留最近 10 条历史",
    features: ["化学式解析", "摩尔质量", "浓度换算"],
  },
  {
    name: "离线密码库",
    category: "安全工具",
    description: "使用浏览器本地加密保存实验室账号信息，支持自动锁定和加密备份。",
    href: `${labToolsBaseUrl}/tools/vault/`,
    dataNote: "加密数据保存在当前浏览器",
    features: ["AES-GCM", "自动锁定", "加密备份"],
  },
];

export const labToolsHomeUrl = `${labToolsBaseUrl}/`;
