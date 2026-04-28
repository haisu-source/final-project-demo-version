import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { addComment, getComments, userLikedComment } from "@/lib/mock-store";
import { getSupabase } from "@/lib/supabase";
import type { Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("articleId");
  if (!articleId) {
    return Response.json({ error: "articleId required" }, { status: 400 });
  }

  const { userId } = await auth();

  let comments: Comment[];
  if (IS_DEMO_MODE_DB) {
    comments = getComments(articleId).map((c) => ({
      ...c,
      liked_by_me: userId ? userLikedComment(c.id, userId) : false,
    }));
  } else {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    comments = (data as Comment[]) ?? [];
  }

  return Response.json({ comments });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName.charAt(0)}.`
      : user?.firstName ??
        user?.username ??
        user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ??
        "Reader";
  const userAvatar = user?.imageUrl ?? null;

  const body = (await req.json()) as {
    article_id?: string;
    body?: string;
    parent_id?: string | null;
  };

  if (!body.article_id || !body.body || !body.body.trim()) {
    return Response.json(
      { error: "article_id and body required" },
      { status: 400 }
    );
  }

  const trimmed = body.body.trim().slice(0, 2000);

  if (IS_DEMO_MODE_DB) {
    const c = addComment({
      article_id: body.article_id,
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar,
      body: trimmed,
      parent_id: body.parent_id ?? null,
    });
    return Response.json({ comment: c }, { status: 201 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      article_id: body.article_id,
      user_id: userId,
      user_name: userName,
      user_avatar: userAvatar,
      body: trimmed,
      parent_id: body.parent_id ?? null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ comment: data as Comment }, { status: 201 });
}
