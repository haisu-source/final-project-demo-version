import Link from "next/link";
import type { Article, Category, EngagementStats } from "@/lib/types";
import EngagementMetrics from "./EngagementMetrics";

interface Props {
  article: Article & { stats?: EngagementStats };
}

const CATEGORY_GRADIENTS: Record<Category, string> = {
  politics: "from-rose-300 via-amber-200 to-orange-200",
  culture: "from-violet-300 via-fuchsia-200 to-rose-200",
  education: "from-sky-300 via-cyan-200 to-emerald-200",
  health: "from-emerald-300 via-lime-200 to-yellow-200",
  tech: "from-slate-400 via-indigo-300 to-sky-200",
};

const CATEGORY_LABEL: Record<Category, string> = {
  politics: "Politics",
  culture: "Culture",
  education: "Education",
  health: "Health",
  tech: "Tech",
};

export default function ArticleCard({ article }: Props) {
  const stats: EngagementStats = article.stats ?? {
    views: 0,
    comments: 0,
    likes: 0,
  };
  const gradient = CATEGORY_GRADIENTS[article.category];
  return (
    <Link
      href={`/article/${article.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--primary)] hover:shadow-md"
    >
      <div
        className={`relative aspect-[16/9] w-full bg-gradient-to-br ${gradient}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.55),transparent_50%)]" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--ink)] shadow-sm">
          {CATEGORY_LABEL[article.category]}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-[11px] text-white backdrop-blur">
          {article.source}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-lg font-semibold leading-snug text-[var(--ink)] group-hover:text-[var(--primary)]">
          {article.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
            {article.location ?? article.source}
          </span>
          <EngagementMetrics stats={stats} />
        </div>
      </div>
    </Link>
  );
}
