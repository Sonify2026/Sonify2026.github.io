export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  dateLabel: string;
  readingTime: string;
  toc: TocItem[];
  html: string;
};

export type TagSummary = {
  name: string;
  count: number;
};
