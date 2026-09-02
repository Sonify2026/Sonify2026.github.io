import { access, copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import markedKatex from "marked-katex-extension";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const articlesDirectory = path.join(projectRoot, "content", "articles");
const outputFile = path.join(projectRoot, "content", "generated-posts.ts");
const generatedAssetsDirectory = path.join(projectRoot, "public", "article-assets");

marked.use({ gfm: true, breaks: false });
marked.use(markedKatex({ throwOnError: false, nonStandard: true }));

function unquote(value) {
  const trimmed = String(value ?? "").trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseList(value) {
  if (Array.isArray(value)) return value;
  const text = String(value ?? "").trim();
  if (!text) return [];
  const inner = text.startsWith("[") && text.endsWith("]") ? text.slice(1, -1) : text;
  return inner
    .split(",")
    .map((item) => unquote(item).replace(/^#/, "").trim())
    .filter(Boolean);
}

function parseFrontmatter(source, filename) {
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: 缺少以 --- 包围的文章信息区`);

  const data = {};
  let listKey = "";
  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    const listItem = rawLine.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      data[listKey].push(unquote(listItem[1]));
      continue;
    }

    const field = rawLine.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!field) throw new Error(`${filename}: 无法识别文章信息 “${rawLine.trim()}”`);
    const [, key, rawValue] = field;
    if (!rawValue.trim()) {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = unquote(rawValue);
      listKey = "";
    }
  }

  return { data, body: match[2].trim() };
}

function slugify(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\\/_\s]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function plainText(markdown) {
  return markdown
    .replace(/%%[\s\S]*?%%/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?(?:\[\[|\[)([^\]]+)(?:\]\]|\]\([^)]*\))/g, "$1")
    .replace(/[#>*_~|=-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeDescription(body) {
  const text = plainText(body);
  return text.length > 100 ? `${text.slice(0, 100).trim()}……` : text;
}

function estimateReadingTime(markdown) {
  const text = plainText(markdown);
  const chineseCharacters = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const otherWords = text
    .replace(/[\u3400-\u9fff]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(chineseCharacters / 400 + otherWords / 200))} 分钟阅读`;
}

const calloutTones = new Map([
  ["abstract", "note"], ["summary", "note"], ["tldr", "note"], ["引言", "note"], ["摘要", "note"], ["总结", "note"],
  ["info", "info"], ["todo", "info"], ["信息", "info"], ["待办", "info"],
  ["tip", "tip"], ["hint", "tip"], ["important", "tip"], ["success", "tip"], ["check", "tip"], ["done", "tip"], ["提示", "tip"], ["重要", "tip"], ["结论", "tip"],
  ["warning", "warning"], ["caution", "warning"], ["attention", "warning"], ["question", "warning"], ["help", "warning"], ["faq", "warning"], ["注意", "warning"], ["警告", "warning"], ["问题", "warning"],
  ["failure", "danger"], ["fail", "danger"], ["missing", "danger"], ["danger", "danger"], ["error", "danger"], ["bug", "danger"], ["失败", "danger"], ["危险", "danger"], ["错误", "danger"],
  ["example", "example"], ["示例", "example"], ["quote", "quote"], ["cite", "quote"], ["引用", "quote"],
]);

const calloutDefaultTitles = new Map([
  ["note", "备注"], ["abstract", "摘要"], ["summary", "摘要"], ["tldr", "摘要"],
  ["info", "信息"], ["todo", "待办"], ["tip", "提示"], ["hint", "提示"], ["important", "重要"],
  ["success", "完成"], ["check", "完成"], ["done", "完成"], ["question", "问题"], ["help", "帮助"],
  ["faq", "常见问题"], ["warning", "警告"], ["caution", "注意"], ["attention", "注意"],
  ["failure", "失败"], ["fail", "失败"], ["missing", "缺失"], ["danger", "危险"], ["error", "错误"],
  ["bug", "问题"], ["example", "示例"], ["quote", "引用"], ["cite", "引用"],
]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function decorateObsidianCallouts(html) {
  return html.replace(/<blockquote>\s*([\s\S]*?)<\/blockquote>/g, (block, innerHtml) => {
    const marker = innerHtml.match(/^<p>\[!([^\]\r\n]+)\]([+-])?[ \t]*([^\r\n<]*)?(?:\r?\n)?/i);
    if (!marker) return block;

    const rawType = marker[1].trim();
    const normalizedType = rawType.toLocaleLowerCase();
    const tone = calloutTones.get(normalizedType) ?? "note";
    const customTitle = marker[3]?.trim();
    const title = customTitle || calloutDefaultTitles.get(normalizedType) || rawType;
    const content = innerHtml.slice(marker[0].length);
    const contentHtml = content === "</p>\n" ? "" : `<p>${content}`;
    const attributes = `class="obsidian-callout obsidian-callout--${tone}" data-callout="${escapeHtml(rawType)}"`;
    const titleHtml = `<span class="obsidian-callout-title">${escapeHtml(title)}</span>`;
    const bodyHtml = `<div class="obsidian-callout-content">${contentHtml}</div>`;

    if (marker[2]) {
      const open = marker[2] === "+" ? " open" : "";
      return `<details ${attributes}${open}><summary>${titleHtml}</summary>${bodyHtml}</details>`;
    }

    return `<aside ${attributes} role="note">${titleHtml}${bodyHtml}</aside>`;
  });
}


function addHeadingAnchors(html) {
  const toc = [];
  const usedIds = new Map();
  const decoratedHtml = html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (_, levelValue, innerHtml) => {
    const text = innerHtml
      .replace(/<[^>]+>/g, "")
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .trim();
    const baseId = slugify(text) || `section-${toc.length + 1}`;
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
    const level = Number(levelValue);
    if (level <= 3) toc.push({ id, text, level });
    return `<h${levelValue} id="${id}">${innerHtml}</h${levelValue}>`;
  });
  return { html: decoratedHtml, toc };
}
async function listMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listMarkdownFiles(fullPath)));
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(fullPath);
  }
  return files.sort();
}

function normalizeDate(value, filename) {
  const date = String(value ?? "").trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${filename}: 请添加 date: YYYY-MM-DD`);
  }
  return date;
}

function isDraft(data) {
  const draft = String(data.draft ?? "").toLowerCase();
  const publish = String(data.publish ?? "").toLowerCase();
  return ["true", "yes", "1"].includes(draft) || ["false", "no", "0"].includes(publish);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function attachmentKey(value) {
  return String(value).replaceAll("\\", "/").replace(/^\.\//, "").toLocaleLowerCase();
}

async function collectArticleAttachments(record) {
  const lookup = new Map();
  const targets = new Set();
  for (const match of record.body.matchAll(/!\[\[([^\]]+)\]\]/g)) {
    const target = match[1].split("|")[0].trim();
    if (/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(target)) targets.add(target);
  }

  const articleDirectory = path.dirname(record.filePath);
  const attachmentDirectory = path.resolve(articleDirectory, "附件");
  const outputDirectory = path.join(generatedAssetsDirectory, record.slug);

  for (const target of targets) {
    const normalizedTarget = target.replaceAll("\\", "/").replace(/^\.\//, "");
    const relativeTarget = normalizedTarget.replace(/^(?:附件|attachments)\//i, "");
    const sourcePath = path.resolve(attachmentDirectory, ...relativeTarget.split("/"));
    const allowedPrefix = `${attachmentDirectory}${path.sep}`;
    if (sourcePath !== attachmentDirectory && !sourcePath.startsWith(allowedPrefix)) {
      throw new Error(`${record.relativePath}: 图片路径不能离开当前分类的附件文件夹：${target}`);
    }

    let publicUrl;
    if (await fileExists(sourcePath)) {
      const filename = path.basename(relativeTarget);
      await mkdir(outputDirectory, { recursive: true });
      await copyFile(sourcePath, path.join(outputDirectory, filename));
      publicUrl = `/article-assets/${encodeURIComponent(record.slug)}/${encodeURIComponent(filename)}`;
    } else {
      const legacyPath = path.resolve(projectRoot, "public", "images", ...relativeTarget.split("/"));
      if (!(await fileExists(legacyPath))) {
        throw new Error(`${record.relativePath}: 找不到图片“${target}”。请放入 ${path.relative(projectRoot, attachmentDirectory)}`);
      }
      publicUrl = `/images/${relativeTarget.split("/").map(encodeURIComponent).join("/")}`;
    }

    lookup.set(attachmentKey(target), publicUrl);
    lookup.set(attachmentKey(normalizedTarget), publicUrl);
    lookup.set(attachmentKey(path.posix.basename(relativeTarget)), publicUrl);
  }

  return lookup;
}

function prepareObsidianMarkdown(markdown, noteLookup, attachmentLookup) {
  const resolveNote = (target) => {
    const noteName = target.split("#")[0].replace(/\.md$/i, "").trim();
    const basename = path.posix.basename(noteName);
    return noteLookup.get(noteName.toLocaleLowerCase()) ?? noteLookup.get(basename.toLocaleLowerCase());
  };

  return markdown
    .replace(/%%[\s\S]*?%%/g, "")
    .replace(/!\[\[([^\]]+)\]\]/g, (_, value) => {
      const [target, label] = value.split("|").map((part) => part.trim());
      if (/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(target)) {
        const imageUrl = attachmentLookup.get(attachmentKey(target));
        return `![${label || path.posix.basename(target)}](${imageUrl})`;
      }
      const note = resolveNote(target);
      return note ? `[${label || note.title}](/articles/${note.slug})` : label || target;
    })
    .replace(/\[\[([^\]]+)\]\]/g, (_, value) => {
      const [target, label] = value.split("|").map((part) => part.trim());
      const note = resolveNote(target);
      if (!note) return label || target.replace(/#.+$/, "");
      const heading = target.includes("#") ? `#${slugify(target.split("#").slice(1).join("#"))}` : "";
      return `[${label || note.title}](/articles/${note.slug}${heading})`;
    })
    .replace(/==([^=\n]+)==/g, "<mark>$1</mark>");
}
async function generate() {
  await mkdir(articlesDirectory, { recursive: true });
  await rm(generatedAssetsDirectory, { recursive: true, force: true });
  await mkdir(generatedAssetsDirectory, { recursive: true });
  const files = await listMarkdownFiles(articlesDirectory);
  if (files.length === 0) throw new Error("content/articles 中至少需要一篇 .md 文章");

  const records = [];
  const usedSlugs = new Set();
  for (const filePath of files) {
    const relativePath = path.relative(articlesDirectory, filePath).replaceAll("\\", "/");
    const source = await readFile(filePath, "utf8");
    const { data, body } = parseFrontmatter(source, relativePath);
    if (isDraft(data)) continue;

    const filenameTitle = path.basename(relativePath, path.extname(relativePath));
    const title = String(data.title || filenameTitle).trim();
    const slug = slugify(data.slug || relativePath.replace(/\.md$/i, ""));
    if (!slug) throw new Error(`${relativePath}: 无法生成文章网址，请添加 slug 属性`);
    if (usedSlugs.has(slug)) throw new Error(`${relativePath}: 文章网址 ${slug} 与另一篇文章重复`);
    usedSlugs.add(slug);

    const folder = path.posix.dirname(relativePath);
    const category = String(data.category || (folder === "." ? "未分类" : folder.split("/")[0])).trim();
    const tags = [...new Set(parseList(data.tags ?? data.tag).map((tag) => String(tag).replace(/^#/, "").trim()).filter(Boolean))];
    const aliases = parseList(data.aliases ?? data.alias);
    const date = normalizeDate(data.date ?? data.published ?? data.created, relativePath);

    records.push({
      filePath,
      relativePath,
      basename: filenameTitle,
      aliases,
      body,
      slug,
      title,
      description: String(data.description || makeDescription(body)).trim(),
      category,
      tags,
      date,
      dateLabel: date.replaceAll("-", "."),
      readingTime: String(data.readingTime || estimateReadingTime(body)),
    });
  }

  if (records.length === 0) throw new Error("所有文章都被标记为草稿，至少需要发布一篇文章");

  const noteLookup = new Map();
  for (const record of records) {
    const names = [record.title, record.basename, record.relativePath.replace(/\.md$/i, ""), ...record.aliases];
    for (const name of names) noteLookup.set(String(name).toLocaleLowerCase(), record);
  }

  const posts = [];
  for (const record of records) {
    const attachmentLookup = await collectArticleAttachments(record);
    const parsedHtml = await marked.parse(prepareObsidianMarkdown(record.body, noteLookup, attachmentLookup));
    const rawHtml = decorateObsidianCallouts(parsedHtml);
    const { html, toc } = addHeadingAnchors(rawHtml);
    posts.push({
      slug: record.slug,
      title: record.title,
      description: record.description,
      category: record.category,
      tags: record.tags,
      date: record.date,
      dateLabel: record.dateLabel,
      readingTime: record.readingTime,
      toc,
      html,
    });
  }
  posts.sort((left, right) => right.date.localeCompare(left.date));

  const categories = ["全部", ...new Set(posts.map((post) => post.category))];
  const tagCounts = new Map();
  for (const post of posts) {
    for (const tag of post.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  const tags = [...tagCounts]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "zh-CN"));

  const output = `// 此文件由 npm run generate:posts 自动生成，请勿手动编辑。\nimport type { Post, TagSummary } from "./post-types";\n\nexport const posts: Post[] = ${JSON.stringify(posts, null, 2)};\n\nexport const categories = ${JSON.stringify(categories)} as const;\n\nexport const tags: TagSummary[] = ${JSON.stringify(tags, null, 2)};\n`;

  let previous = "";
  try {
    await access(outputFile);
    previous = await readFile(outputFile, "utf8");
  } catch {}

  if (output !== previous) await writeFile(outputFile, output, "utf8");
  console.log(`已生成 ${posts.length} 篇文章、${categories.length - 1} 个分类和 ${tags.length} 个标签`);
}

generate().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});






