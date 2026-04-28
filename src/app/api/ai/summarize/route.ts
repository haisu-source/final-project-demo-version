import Anthropic from "@anthropic-ai/sdk";
import { IS_DEMO_MODE_AI, IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { getArticle, getComments } from "@/lib/mock-store";
import { getSupabase } from "@/lib/supabase";
import type { Article, Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { articleId } = (await req.json()) as { articleId?: string };
  if (!articleId) {
    return Response.json({ error: "articleId required" }, { status: 400 });
  }

  let article: Article | null;
  let comments: Comment[];

  if (IS_DEMO_MODE_DB) {
    article = getArticle(articleId);
    comments = getComments(articleId);
  } else {
    const supabase = getSupabase();
    const [{ data: a }, { data: c }] = await Promise.all([
      supabase.from("articles").select("*").eq("id", articleId).single(),
      supabase
        .from("comments")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: true }),
    ]);
    article = (a as Article) ?? null;
    comments = (c as Comment[]) ?? [];
  }

  if (!article) {
    return Response.json({ error: "Article not found" }, { status: 404 });
  }

  if (IS_DEMO_MODE_AI) {
    const summary = demoSummary(article, comments);
    return Response.json({ summary, demo: true });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const thread = comments
    .slice(0, 60)
    .map((c) => `${c.user_name}: ${c.body}`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `Catch a newcomer up on this comment thread in 3-4 sentences. Keep the tone conversational. Highlight points of agreement, disagreement, and the most-cited concerns.

Article: "${article.title}" — ${article.source}
Excerpt: ${article.excerpt}

Comments (${comments.length}):
${thread}`,
      },
    ],
  });

  const summary =
    message.content[0]?.type === "text"
      ? message.content[0].text
      : "Could not generate a summary.";

  return Response.json({ summary });
}

function demoSummary(article: Article, comments: Comment[]): string {
  if (comments.length === 0) {
    return `Demo summary: no comments yet on "${article.title}". Most articles in this category tend to spark debate around access, accountability, and who benefits from the policy. Be the first to weigh in.`;
  }

  const topAuthors = Array.from(
    new Set(comments.map((c) => c.user_name))
  ).slice(0, 4);
  const replyCount = comments.filter((c) => c.parent_id).length;
  const topLevel = comments.length - replyCount;

  const points: Record<string, string> = {
    politics:
      "Readers are split between residents who want the policy passed quickly and developers warning about unintended consequences. Several commenters are pressing for specifics on AMI thresholds and tax incentives.",
    culture:
      "The mood is celebratory, with longtime residents sharing memories and a few practical questions about logistics and neighborhood impact.",
    education:
      "Parents and teachers are clashing on whether expansion helps individual students at the cost of the broader public system. Several commenters are asking for the city's long-promised facilities study before any vote.",
    health:
      "Patients and clinic staff are praising the program. The main worry is whether federal funding will be reauthorized — a couple of commenters pushed back on why mobile outreach isn't already a permanent line item.",
    tech:
      "Seniors are owning the learning curve and asking how to bring the class to other neighborhoods. A minority is arguing the platforms should bear the responsibility, not individual users.",
  };

  const tail = points[article.category] ?? "Discussion is active and varied.";

  return `Demo summary: ${comments.length} comments (${topLevel} top-level, ${replyCount} replies) from voices like ${topAuthors.join(", ")}. ${tail} Set ANTHROPIC_API_KEY to get a real Claude-generated catch-up.`;
}
