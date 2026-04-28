import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { formatDistanceToNow } from "date-fns";
import { IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { getArticle, getEngagement, recordView } from "@/lib/mock-store";
import { getSupabase } from "@/lib/supabase";
import type { Article, EngagementStats } from "@/lib/types";
import CommentSection from "@/components/CommentSection";
import EngagementMetrics from "@/components/EngagementMetrics";
import QRCode from "@/components/QRCode";
import CatchMeUp from "./CatchMeUp";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  politics: "Politics",
  culture: "Culture",
  education: "Education",
  health: "Health",
  tech: "Tech",
};

async function loadArticle(id: string): Promise<{
  article: Article;
  stats: EngagementStats;
} | null> {
  if (IS_DEMO_MODE_DB) {
    const article = getArticle(id);
    if (!article) return null;
    // Record a view for the SSR request.
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "anon";
    const ua = h.get("user-agent") ?? "anon";
    recordView(
      id,
      crypto.createHash("sha256").update(`${ip}|${ua}`).digest("hex")
    );
    return { article, stats: getEngagement(id) };
  }
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return {
    article: data as Article,
    stats: { views: 0, comments: 0, likes: 0 },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadArticle(id);
  if (!data) notFound();

  const { article, stats } = data;
  const time = formatDistanceToNow(new Date(article.created_at), {
    addSuffix: true,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-[var(--muted)]">
        <span className="rounded-full bg-[var(--muted-bg)] px-2 py-0.5 font-semibold text-[var(--ink)]">
          {CATEGORY_LABEL[article.category] ?? article.category}
        </span>
        <span>{article.source}</span>
        {article.location && <span>· {article.location}</span>}
        <span>· {time}</span>
      </div>

      <h1 className="font-serif text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
        {article.title}
      </h1>

      {article.author && (
        <p className="mt-2 text-sm text-[var(--muted)]">
          By {article.author}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-[var(--border)] py-3">
        <EngagementMetrics stats={stats} size="md" />
        <QRCode articleId={article.id} articleTitle={article.title} />
      </div>

      <div className="mt-6 max-w-none font-serif text-[15.5px] leading-[1.75] text-[var(--ink)]">
        {article.body.split(/\n\n+/).map((p, i) => (
          <p key={i} className="mb-4">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <CatchMeUp articleId={article.id} />
      </div>

      <div className="mt-10">
        <CommentSection
          articleId={article.id}
          isDemoModeDb={IS_DEMO_MODE_DB}
          supabaseUrl={supabaseUrl}
          supabaseKey={supabaseKey}
        />
      </div>
    </article>
  );
}
