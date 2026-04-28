// Module-level mutable in-memory store used when IS_DEMO_MODE_DB is true.
// State is held in module scope so it persists for the lifetime of the
// server process (between requests within a single Vercel invocation
// container or local dev server). Resets on cold start — that's fine.

import type { Article, Comment, EngagementStats, Like, View } from "./types";
import { mockArticles, mockComments, mockLikes, mockViews } from "./mock-data";

const articles: Article[] = [...mockArticles];
const comments: Comment[] = [...mockComments];
const likes: Like[] = [...mockLikes];
const views: View[] = [...mockViews];

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function getArticles(): Article[] {
  return [...articles];
}

export function getArticle(id: string): Article | null {
  return articles.find((a) => a.id === id) ?? null;
}

export function getComments(articleId: string): Comment[] {
  return comments
    .filter((c) => c.article_id === articleId)
    .map((c) => ({
      ...c,
      like_count: likes.filter((l) => l.comment_id === c.id).length,
    }));
}

export function addComment(input: {
  article_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  body: string;
  parent_id: string | null;
}): Comment {
  const c: Comment = {
    id: uid("c"),
    article_id: input.article_id,
    user_id: input.user_id,
    user_name: input.user_name,
    user_avatar: input.user_avatar,
    body: input.body,
    parent_id: input.parent_id,
    created_at: new Date().toISOString(),
  };
  comments.push(c);
  return { ...c, like_count: 0 };
}

export function toggleLike(commentId: string, userId: string): {
  liked: boolean;
  count: number;
} {
  const idx = likes.findIndex(
    (l) => l.comment_id === commentId && l.user_id === userId
  );
  if (idx >= 0) {
    likes.splice(idx, 1);
    return {
      liked: false,
      count: likes.filter((l) => l.comment_id === commentId).length,
    };
  }
  likes.push({
    id: uid("like"),
    comment_id: commentId,
    user_id: userId,
    created_at: new Date().toISOString(),
  });
  return {
    liked: true,
    count: likes.filter((l) => l.comment_id === commentId).length,
  };
}

export function recordView(articleId: string, viewerHash: string): number {
  const exists = views.some(
    (v) => v.article_id === articleId && v.viewer_hash === viewerHash
  );
  if (!exists) {
    views.push({
      id: uid("view"),
      article_id: articleId,
      viewer_hash: viewerHash,
      created_at: new Date().toISOString(),
    });
  }
  return views.filter((v) => v.article_id === articleId).length;
}

export function getEngagement(articleId: string): EngagementStats {
  const articleComments = comments.filter((c) => c.article_id === articleId);
  const commentIds = new Set(articleComments.map((c) => c.id));
  return {
    views: views.filter((v) => v.article_id === articleId).length,
    comments: articleComments.length,
    likes: likes.filter((l) => commentIds.has(l.comment_id)).length,
  };
}

export function userLikedComment(commentId: string, userId: string): boolean {
  return likes.some(
    (l) => l.comment_id === commentId && l.user_id === userId
  );
}
