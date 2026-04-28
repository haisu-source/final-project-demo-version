import type { Comment } from "./types";

// Build a tree from a flat list of comments. Top-level comments are those
// with no parent_id. Children are nested up to `maxDepth` levels; replies
// deeper than that are flattened up to the deepest allowed level so the
// UI can stay readable.
export function buildCommentTree(
  flat: Comment[],
  maxDepth = 2
): Comment[] {
  const byId = new Map<string, Comment>();
  for (const c of flat) {
    byId.set(c.id, { ...c, children: [] });
  }

  const roots: Comment[] = [];

  // Helper: find effective parent honoring maxDepth.
  function depthOf(c: Comment): number {
    let d = 0;
    let cur: Comment | undefined = c;
    while (cur && cur.parent_id) {
      const parent = byId.get(cur.parent_id);
      if (!parent) break;
      d++;
      if (d > 50) break;
      cur = parent;
    }
    return d;
  }

  for (const c of flat) {
    const node = byId.get(c.id);
    if (!node) continue;

    if (!c.parent_id) {
      roots.push(node);
      continue;
    }

    let parent = byId.get(c.parent_id);
    while (parent && depthOf(parent) >= maxDepth) {
      if (!parent.parent_id) break;
      const next = byId.get(parent.parent_id);
      if (!next) break;
      parent = next;
    }

    if (parent) {
      parent.children = parent.children ?? [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort children by created_at ascending.
  function sortRec(list: Comment[]) {
    list.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    for (const c of list) if (c.children) sortRec(c.children);
  }
  sortRec(roots);

  return roots;
}
