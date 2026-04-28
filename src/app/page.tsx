import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import type { Article, Category, EngagementStats } from "@/lib/types";
import { IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { getArticles, getEngagement } from "@/lib/mock-store";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "politics", label: "Politics" },
  { value: "culture", label: "Culture" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "tech", label: "Tech" },
];

const VALID_CATEGORIES: Category[] = [
  "politics",
  "culture",
  "education",
  "health",
  "tech",
];

type FeedItem = Article & { stats: EngagementStats };

async function fetchFeed(
  sort: string,
  category: string | null
): Promise<FeedItem[]> {
  // Resolve articles directly from the data layer. Server Components
  // should not HTTP-fetch their own API routes — that round-trip can
  // time out on Vercel and is an anti-pattern.
  let articles: Article[];
  if (IS_DEMO_MODE_DB) {
    articles = getArticles();
  } else {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    articles = (data as Article[]) ?? [];
  }

  const cat =
    category && (VALID_CATEGORIES as string[]).includes(category)
      ? (category as Category)
      : null;
  if (cat) articles = articles.filter((a) => a.category === cat);

  const decorated: FeedItem[] = articles.map((a) => ({
    ...a,
    stats: IS_DEMO_MODE_DB
      ? getEngagement(a.id)
      : { views: 0, comments: 0, likes: 0 },
  }));

  if (sort === "trending") {
    decorated.sort((a, b) => {
      const score = (x: FeedItem) => {
        const ageDays =
          (Date.now() - new Date(x.created_at).getTime()) /
          (1000 * 60 * 60 * 24);
        const raw = x.stats.views + 4 * x.stats.comments + 2 * x.stats.likes;
        return raw / Math.max(1, ageDays + 1);
      };
      return score(b) - score(a);
    });
  } else {
    decorated.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return decorated;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const activeCategory = sp.category ?? "all";

  const [trending, recent] = await Promise.all([
    fetchFeed("trending", activeCategory),
    fetchFeed("recent", activeCategory),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-8">
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
          The community, in conversation.
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Read what your local paper printed this week, then weigh in on what it
          means for your block. PressHub bridges the page to the stoop.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => {
          const isActive =
            (c.value === "all" && activeCategory === "all") ||
            c.value === activeCategory;
          const href =
            c.value === "all" ? "/" : `/?category=${c.value}`;
          return (
            <Link
              key={c.value}
              href={href}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--primary)]"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <Section title="Trending" articles={trending} />
      <Section title="Recent" articles={recent} />
    </div>
  );
}

function Section({
  title,
  articles,
}: {
  title: string;
  articles: (Article & { stats: EngagementStats })[];
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-serif text-2xl font-semibold text-[var(--ink)]">
        {title}
      </h2>
      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
          No articles in this category yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </section>
  );
}
