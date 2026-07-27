// 🕊️白木 原创开发 🔗gl.baimu.live
// 🏠 站点概览动态数据工具 - 从 doc 目录读取文档统计、分类、标签

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import type { CloudItem } from '../config/site.config';
import type { Post } from '../types/post';
import { resolveCoverUrl } from './image';

/* 📋 文档元数据 */
export interface DocFrontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  cover?: string;
  url?: string;
}

/* 📋 文档统计 */
export interface DocStats {
  total: number;
  today: number;
  week: number;
  trend: number[];
}

/* 🔽 递归获取所有 MD 文件 */
function getAllMdFiles(dir: string, basePath: string = ''): string[] {
  const files: string[] = [];

  if (!existsSync(dir)) {
    return files;
  }

  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = basePath ? `${basePath}/${item}` : item;
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMdFiles(fullPath, relativePath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/* 🔽 解析 frontmatter */
function parseFrontmatter(fileContent: string): Partial<DocFrontmatter> {
  const frontmatterMatch = fileContent.match(/^---[\t ]*\r?\n([^]*?)\r?\n---[\t ]*\r?\n([^]*)$/);

  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  const result: Partial<DocFrontmatter> = {};

  // 标题
  const titleMatch = frontmatter.match(/title:\s*['"]?([^'"\r\n]+)['"]?/);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  // 描述
  const descMatch = frontmatter.match(/description:\s*['"]?([^'"\r\n]+)['"]?/);
  if (descMatch) {
    result.description = descMatch[1].trim();
  }

  // 日期
  const dateMatch = frontmatter.match(/date:\s*['"]?([^'"\r\n]+)['"]?/);
  if (dateMatch) {
    result.date = dateMatch[1].trim();
  }

  // 分类
  const categoryMatch = frontmatter.match(/category:\s*['"]?([^'"\r\n]+)['"]?/);
  if (categoryMatch) {
    result.category = categoryMatch[1].trim();
  }

  // 封面
  const coverMatch = frontmatter.match(/cover:\s*['"]?([^'"\r\n]+)['"]?/);
  if (coverMatch) {
    result.cover = coverMatch[1].trim();
  }

  // 自定义 URL
  const urlMatch = frontmatter.match(/url:\s*['"]?([^'"\r\n]+)['"]?/);
  if (urlMatch) {
    result.url = urlMatch[1].trim();
  }

  // 标签
  const tagsArrayMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/);
  const tagsStringMatch = frontmatter.match(/tags:\s*['"]?([^'"\r\n\[]+)['"]?/);

  if (tagsArrayMatch) {
    result.tags = tagsArrayMatch[1]
      .split(',')
      .map((t) => t.trim().replace(/['"]/g, ''))
      .filter(Boolean);
  } else if (tagsStringMatch) {
    const tagsStr = tagsStringMatch[1];
    result.tags = tagsStr
      .replace(/、/g, ',')
      .replace(/，/g, ',')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return result;
}

/* 🔽 读取所有文档 frontmatter */
function getAllDocs(dir: string): DocFrontmatter[] {
  const files = getAllMdFiles(dir);

  return files
    .map((filePath) => {
      const content = readFileSync(filePath, 'utf-8');
      return parseFrontmatter(content);
    })
    .filter((doc): doc is DocFrontmatter => Boolean(doc.title));
}

/* 🔽 解析日期为 YYYY-MM-DD */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/* 🔽 判断两个日期是否为同一天 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/* 🔽 判断日期是否在指定天数内 */
function isWithinDays(targetDate: Date, days: number): boolean {
  const now = new Date();
  const diffTime = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays < days;
}

/* 🔽 获取文档统计 */
export function getDocStats(dir: string): DocStats {
  const docs = getAllDocs(dir);
  const now = new Date();

  // 近 7 天趋势（从今天往前推 6 天）
  const trend: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - i);
    targetDate.setHours(0, 0, 0, 0);

    const count = docs.filter((doc) => {
      if (!doc.date) return false;
      const docDate = new Date(doc.date);
      return isSameDay(docDate, targetDate);
    }).length;

    trend.push(count);
  }

  const today = trend[6];
  const week = trend.reduce((sum, count) => sum + count, 0);

  return {
    total: docs.length,
    today,
    week,
    trend,
  };
}

/* 🔽 统计分类云 */
export function getCategoryCloud(dir: string): CloudItem[] {
  const docs = getAllDocs(dir);
  const counts = new Map<string, number>();

  for (const doc of docs) {
    if (!doc.category) continue;
    counts.set(doc.category, (counts.get(doc.category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/* 🔽 统计标签云 */
export function getTagCloud(dir: string): CloudItem[] {
  const docs = getAllDocs(dir);
  const counts = new Map<string, number>();

  for (const doc of docs) {
    if (!doc.tags || doc.tags.length === 0) continue;
    for (const tag of doc.tags) {
      if (!tag) continue;
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/* 🔽 读取单个文档的完整 Post 数据 */
function getPostFromFile(filePath: string, docDir: string): Post | null {
  if (!existsSync(filePath)) {
    return null;
  }

  const content = readFileSync(filePath, 'utf-8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter.title) {
    return null;
  }

  const relativePath = relative(docDir, filePath).replace(/\\/g, '/');
  const slug = relativePath.replace(/\.md$/, '');
  const url = frontmatter.url ? frontmatter.url.replace(/^\//, '') : slug;

  // 📝 提取描述（优先 frontmatter，否则从正文生成）
  let description = frontmatter.description || '';
  if (!description) {
    const plainText = content
      .replace(/^---[\t ]*\r?\n[^]*?\r?\n---[\t ]*\r?\n/, '')
      .replace(/#+ /g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n/g, ' ')
      .trim();
    description = plainText.length > 150 ? `${plainText.slice(0, 150)}...` : plainText;
  }

  // 📅 阅读时间
  const contentWithoutFrontmatter = content.replace(/^---[\t ]*\r?\n[^]*?\r?\n---[\t ]*\r?\n/, '');
  const chineseChars = (contentWithoutFrontmatter.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (contentWithoutFrontmatter.match(/[a-zA-Z]+/g) || []).length;
  const readTime = `${Math.max(1, Math.ceil((chineseChars + englishWords) / 300))} 分钟`;

  return {
    slug,
    title: frontmatter.title,
    description,
    cover: resolveCoverUrl(frontmatter.cover || '/assets/shiroki.avif', slug),
    date: frontmatter.date || new Date().toISOString().split('T')[0],
    url: `/${url}`,
    tags: frontmatter.tags || [],
    category: frontmatter.category || '',
    readTime,
  };
}

/* 🔽 读取所有文档为 Post 列表 */
export function getAllPosts(dir: string): Post[] {
  const files = getAllMdFiles(dir);

  return files
    .map((filePath) => getPostFromFile(filePath, dir))
    .filter((post): post is Post => post !== null)
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

/* 🔽 按标签筛选文档 */
export function getPostsByTag(dir: string, tag: string): Post[] {
  return getAllPosts(dir).filter((post) => post.tags?.includes(tag));
}

/* 🔽 按分类筛选文档 */
export function getPostsByCategory(dir: string, category: string): Post[] {
  return getAllPosts(dir).filter((post) => post.category === category);
}

/* 🔽 一次性获取全部动态数据 */
export function getSiteOverviewDocData(dir: string): {
  documents: DocStats;
  categories: CloudItem[];
  tags: CloudItem[];
} {
  return {
    documents: getDocStats(dir),
    categories: getCategoryCloud(dir),
    tags: getTagCloud(dir),
  };
}
