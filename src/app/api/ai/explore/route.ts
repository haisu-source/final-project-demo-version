import Anthropic from "@anthropic-ai/sdk";
import { IS_DEMO_MODE_AI, IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { getArticles } from "@/lib/mock-store";
import { getSupabase } from "@/lib/supabase";
import type { Article } from "@/lib/types";

export const dynamic = "force-dynamic";

interface RelatedArticle {
  id: string;
  title: string;
  source: string;
  category: string;
  relevance: string;
}

export async function POST(req: Request) {
  const { query } = (await req.json()) as { query?: string };
  if (!query || !query.trim()) {
    return Response.json({ error: "query required" }, { status: 400 });
  }

  const articles: Article[] = IS_DEMO_MODE_DB
    ? getArticles()
    : await (async () => {
        const supabase = getSupabase();
        const { data } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });
        return (data as Article[]) ?? [];
      })();

  if (IS_DEMO_MODE_AI) {
    // Naive keyword overlap to pick "top 3" relevant articles.
    const q = query.toLowerCase();
    const ranked = articles
      .map((a) => {
        const hay = `${a.title} ${a.body} ${a.category} ${a.source}`.toLowerCase();
        const score = q
          .split(/\s+/)
          .filter((t) => t.length > 2)
          .reduce((s, term) => s + (hay.includes(term) ? 1 : 0), 0);
        return { a, score };
      })
      .sort((x, y) => y.score - x.score);

    const picked = (ranked.find((r) => r.score > 0)
      ? ranked.filter((r) => r.score > 0)
      : ranked
    )
      .slice(0, 3)
      .map(({ a }): RelatedArticle => ({
        id: a.id,
        title: a.title,
        source: a.source,
        category: a.category,
        relevance: relevanceBlurb(a, query),
      }));

    const analysis = demoAnalysis(query, picked, articles);

    return Response.json({
      analysis,
      relatedArticles: picked,
      demo: true,
    });
  }

  // Real Claude path.
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const corpus = articles
    .map(
      (a) =>
        `[id=${a.id}] [${a.category}] "${a.title}" — ${a.source} (${a.location ?? ""})\n${a.body.slice(0, 700)}`
    )
    .join("\n\n---\n\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a community news analyst for PressHub. Given the following articles from community newspapers, answer the reader's question. Connect dots between stories where it helps.

Articles:
${corpus}

Reader question: "${query}"

Respond as raw JSON with this shape (no markdown fences):
{"analysis":"<2-3 paragraphs>","relatedArticles":[{"id":"...","title":"...","source":"...","category":"...","relevance":"<one sentence>"}]}
Include up to 3 related articles. Use only ids that exist in the list above.`,
      },
    ],
  });

  const text =
    message.content[0]?.type === "text" ? message.content[0].text : "";
  try {
    const parsed = JSON.parse(text) as {
      analysis: string;
      relatedArticles: RelatedArticle[];
    };
    return Response.json(parsed);
  } catch {
    return Response.json({
      analysis:
        "I had trouble formatting the response. Please try a different phrasing.",
      relatedArticles: [],
    });
  }
}

function relevanceBlurb(a: Article, query: string): string {
  const q = query.toLowerCase();
  if (a.category === "politics" && /housing|rent|develop|afford/.test(q)) {
    return "Directly addresses local housing policy and the affordable-set-aside debate.";
  }
  if (a.category === "education" && /school|charter|teacher|kid|student/.test(q)) {
    return "Centers the same questions about neighborhood schools and equity.";
  }
  if (a.category === "health" && /vaccin|clinic|health|doctor|nurse/.test(q)) {
    return "On-the-ground reporting about access to community health services.";
  }
  if (a.category === "tech" && /ai|misinfo|deepfake|senior|election/.test(q)) {
    return "Hands-on look at how communities are responding to synthetic media.";
  }
  if (a.category === "culture") {
    return "Adds cultural and historical context to the broader question.";
  }
  return `Related coverage from ${a.source} in ${a.location ?? "the region"}.`;
}

function demoAnalysis(
  query: string,
  picked: RelatedArticle[],
  all: Article[]
): string {
  const cities = Array.from(new Set(all.map((a) => a.location).filter(Boolean)));
  const topCats = Array.from(new Set(picked.map((p) => p.category)));
  const lead =
    picked.length > 0
      ? `Looking at PressHub's coverage in ${cities.join(", ")}, your question about "${query}" lines up most closely with reporting in ${topCats.join(" and ")}.`
      : `Your question about "${query}" doesn't match any single article in our current corpus, but the underlying tension shows up across several pieces.`;

  const middle = picked
    .slice(0, 2)
    .map(
      (p) =>
        `${p.source}'s "${p.title}" speaks to it — ${p.relevance.toLowerCase()}`
    )
    .join(" ");

  const close =
    "Demo response: this analysis was generated locally without calling Claude. Set ANTHROPIC_API_KEY to get real, full reasoning that weaves these stories together with historical context.";

  return [lead, middle, close].filter(Boolean).join("\n\n");
}
