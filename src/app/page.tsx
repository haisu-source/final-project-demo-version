import Link from "next/link";
import { headers } from "next/headers";
import ArticleCard from "@/components/ArticleCard";
import type { Article, Category, EngagementStats } from "@/lib/types";

export const dynamic = "force-dynamic";

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "politics", label: "Politics" },
  { value: "culture", label: "Culture" },
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "tech", label: "Tech" },
];

interface FeedResponse {
  articles: (Article & { stats: EngagementStats })[];
}

async function fetchFeed(
  sort: string,
  category: string | null
): Promise<FeedResponse["articles"]> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const url = new URL("/api/articles", base);
  url.searchParams.set("sort", sort);
  if (category && category !== "all") url.searchParams.set("category", category);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const j = (await res.json()) as FeedResponse;
  return j.articles;
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
