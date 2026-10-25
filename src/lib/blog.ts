import { getCollection, type CollectionEntry } from "astro:content";

export const POSTS_PER_PAGE = 6;

export const ACCENTS = [
  "#00fff7",
  "#bf00ff",
  "#ff006e",
  "#f7df1e",
  "#38BDF8",
  "#00D4AA",
] as const;

export type BlogPost = CollectionEntry<"blog">;

const WORDS_PER_MINUTE = 200;

export function getAccent(index: number, override?: string): string {
  if (override) return override;
  return ACCENTS[index % ACCENTS.length]!;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateISO(date: Date): string {
  return date.toISOString();
}

export function getReadingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function getReadingTime(text: string): string {
  return `${getReadingTimeMinutes(text)} min read`;
}

export function getPostReadingTimeMinutes(post: BlogPost): number {
  const body = post.body ?? post.data.description;
  return getReadingTimeMinutes(body);
}

export function getPostReadingTime(post: BlogPost): string {
  const body = post.body ?? post.data.description;
  return getReadingTime(body);
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}

export function getFeaturedPosts(posts: BlogPost[], limit = 3): BlogPost[] {
  return posts
    .filter((post) => post.data.featured)
    .sort(
      (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
    )
    .slice(0, limit);
}

export function getListingPosts(posts: BlogPost[]): BlogPost[] {
  const featuredIds = new Set(getFeaturedPosts(posts).map((post) => post.id));
  const nonFeatured = posts.filter((post) => !featuredIds.has(post.id));
  return nonFeatured.length > 0 ? nonFeatured : posts;
}

export function getCategories(posts: BlogPost[]): string[] {
  return [...new Set(posts.map((post) => post.data.category))].sort();
}

export function getTags(posts: BlogPost[]): string[] {
  const tags = posts.flatMap((post) => post.data.tags);
  return [...new Set(tags)].sort();
}

export function filterByCategory(posts: BlogPost[], category: string): BlogPost[] {
  const normalized = slugify(category);
  return posts.filter(
    (post) => slugify(post.data.category) === normalized,
  );
}

export function filterByTag(posts: BlogPost[], tag: string): BlogPost[] {
  const normalized = slugify(tag);
  return posts.filter((post) =>
    post.data.tags.some((item) => slugify(item) === normalized),
  );
}

export function paginatePosts<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  return {
    items: items.slice(start, end),
    currentPage,
    totalPages,
    totalItems: items.length,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function getPaginationPath(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath}/page/${page}`;
}

export function getAdjacentPosts(
  current: BlogPost,
  allPosts: BlogPost[],
): { prev: BlogPost | null; next: BlogPost | null } {
  const index = allPosts.findIndex((post) => post.id === current.id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index < allPosts.length - 1 ? allPosts[index + 1]! : null,
    next: index > 0 ? allPosts[index - 1]! : null,
  };
}

export function getRelatedPosts(
  current: BlogPost,
  allPosts: BlogPost[],
  limit = 3,
): BlogPost[] {
  const others = allPosts.filter((post) => post.id !== current.id);

  const scored = others.map((post) => {
    let score = 0;
    if (post.data.category === current.data.category) score += 3;
    const sharedTags = post.data.tags.filter((tag) =>
      current.data.tags.includes(tag),
    );
    score += sharedTags.length * 2;
    return { post, score };
  });

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        b.post.data.publishDate.getTime() - a.post.data.publishDate.getTime()
      );
    })
    .slice(0, limit)
    .map((item) => item.post);
}

export function getPostAccent(post: BlogPost, index: number): string {
  return getAccent(index, post.data.accent);
}
