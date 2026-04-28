import { NextRequest } from "next/server";
import { IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { getArticles, getEngagement } from "@/lib/mock-store";
import { getSupabase } from "@/lib/supabase";
import type { Article, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES: Category[] = [
  "politics",
  "culture",
  "education",
  "health",
  "tech",
];

export async function GET(req: NextRequest) {
  const sort = req.nextUrl.searchParams.get("sort") ?? "recent";
  const categoryParam = req.nextUrl.searchParams.get("category");
  const category =
    categoryParam && (VALID_CATEGORIES as string[]).includes(categoryParam)
      ? (categoryParam as Category)
      : null;

  let articles: Article[];

  if (IS_DEMO_MODE_DB) {
    articles = getArticles();
  } else {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    articles = (data as Article[]) ?? [];
  }

  if (category) {
    articles = articles.filter((a) => a.category === category);
  }

  // Decorate with engagement so the home feed can sort by it.
  const decorated = articles.map((a) => {
    const stats = IS_DEMO_MODE_DB
      ? getEngagement(a.id)
      : { views: 0, comments: 0, likes: 0 };
    return { ...a, stats };
  });

  if (sort === "trending") {
    decorated.sort((a, b) => {
      // Simple trending score: views + 4*comments + 2*likes, decayed by age in days.
      const score = (x: typeof a) => {
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

  return Response.json({ articles: decorated });
}
