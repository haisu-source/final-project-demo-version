-- PressHub RPC functions for atomic counters.

-- Insert a view if not already present (article_id, viewer_hash unique)
-- and return the total view count for the article.
create or replace function public.increment_view(
  p_article_id uuid,
  p_viewer_hash text
) returns int
language plpgsql
security definer
as $$
declare
  v_count int;
begin
  insert into public.views (article_id, viewer_hash)
  values (p_article_id, p_viewer_hash)
  on conflict (article_id, viewer_hash) do nothing;

  select count(*)::int into v_count
  from public.views
  where article_id = p_article_id;

  return v_count;
end;
$$;

-- Aggregate engagement stats for an article in a single round trip.
create or replace function public.get_article_stats(
  p_article_id uuid
) returns table (views int, comments int, likes int)
language plpgsql
security definer
as $$
begin
  return query
  select
    (select count(*)::int from public.views where article_id = p_article_id) as views,
    (select count(*)::int from public.comments where article_id = p_article_id) as comments,
    (
      select count(*)::int
      from public.likes l
      join public.comments c on c.id = l.comment_id
      where c.article_id = p_article_id
    ) as likes;
end;
$$;

grant execute on function public.increment_view(uuid, text) to anon, authenticated;
grant execute on function public.get_article_stats(uuid) to anon, authenticated;
