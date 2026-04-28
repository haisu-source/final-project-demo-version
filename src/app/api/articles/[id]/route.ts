import { IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { getArticle, getEngagement } from "@/lib/mock-store";
import { getSupabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (IS_DEMO_MODE_DB) {
    const article = getArticle(id);
    if (!article) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ article, stats: getEngagement(id) });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({
    article: data as Article,
    stats: { views: 0, comments: 0, likes: 0 },
  });
}
