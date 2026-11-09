create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null default '',
  author_avatar text,
  category text not null check (category in ('general', 'html', 'css', 'javascript', 'python', 'career')),
  title text not null check (char_length(title) between 5 and 160),
  body text not null check (char_length(body) between 10 and 10000),
  is_solved boolean not null default false,
  reply_count integer not null default 0 check (reply_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index forum_posts_recent_idx on public.forum_posts (updated_at desc);
create index forum_posts_category_idx on public.forum_posts (category, updated_at desc);

create table public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null default '',
  author_avatar text,
  body text not null check (char_length(body) between 2 and 5000),
  created_at timestamptz not null default now()
);
create index forum_replies_post_idx on public.forum_replies (post_id, created_at);
alter table public.forum_replies replica identity full;

create or replace function public.set_forum_author_snapshot()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  profile public.profiles%rowtype;
begin
  if new.author_id is distinct from (select auth.uid()) and not (select public.is_admin()) then
    raise exception 'You can only post as yourself.';
  end if;
  select * into profile from public.profiles where id = new.author_id;
  if not found then raise exception 'User profile not found.'; end if;
  new.author_name := coalesce(nullif(profile.name, ''), split_part(profile.email, '@', 1));
  new.author_avatar := profile.avatar;
  return new;
end;
$$;

create trigger forum_posts_author_snapshot
  before insert on public.forum_posts
  for each row execute function public.set_forum_author_snapshot();
create trigger forum_replies_author_snapshot
  before insert on public.forum_replies
  for each row execute function public.set_forum_author_snapshot();

create or replace function public.touch_forum_post_on_reply()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    update public.forum_posts
    set reply_count = reply_count + 1, updated_at = now()
    where id = new.post_id;
    return new;
  end if;
  update public.forum_posts
  set reply_count = greatest(reply_count - 1, 0), updated_at = now()
  where id = old.post_id;
  return old;
end;
$$;

create or replace function public.touch_forum_post()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger forum_posts_touch
  before update on public.forum_posts
  for each row execute function public.touch_forum_post();
create trigger forum_replies_bump_post
  after insert or delete on public.forum_replies
  for each row execute function public.touch_forum_post_on_reply();

alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;

create policy "Everyone reads forum posts"
  on public.forum_posts for select
  using (true);
create policy "Authenticated users create forum posts"
  on public.forum_posts for insert to authenticated
  with check (author_id = (select auth.uid()));
create policy "Authors and admins update forum posts"
  on public.forum_posts for update to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()))
  with check (author_id = (select auth.uid()) or (select public.is_admin()));
create policy "Authors and admins delete forum posts"
  on public.forum_posts for delete to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()));

create policy "Everyone reads forum replies"
  on public.forum_replies for select
  using (true);
create policy "Authenticated users create forum replies"
  on public.forum_replies for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and exists (select 1 from public.forum_posts where id = post_id)
  );
create policy "Authors and admins update forum replies"
  on public.forum_replies for update to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()))
  with check (author_id = (select auth.uid()) or (select public.is_admin()));
create policy "Authors and admins delete forum replies"
  on public.forum_replies for delete to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()));

revoke all on public.forum_posts, public.forum_replies from anon, authenticated;
grant select on public.forum_posts, public.forum_replies to anon, authenticated;
grant insert (author_id, category, title, body) on public.forum_posts to authenticated;
grant update (title, body, category, is_solved) on public.forum_posts to authenticated;
grant delete on public.forum_posts to authenticated;
grant insert (post_id, author_id, body) on public.forum_replies to authenticated;
grant update (body) on public.forum_replies to authenticated;
grant delete on public.forum_replies to authenticated;

grant execute on function public.set_forum_author_snapshot(),
  public.touch_forum_post_on_reply(), public.touch_forum_post() to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.forum_posts;
    alter publication supabase_realtime add table public.forum_replies;
  end if;
exception
  when duplicate_object then null;
end;
$$;
