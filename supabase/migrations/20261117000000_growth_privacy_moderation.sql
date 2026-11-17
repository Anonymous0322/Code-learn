create table public.analytics_consents (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_key text not null check (char_length(user_key) = 32),
  event_type text not null check (event_type in ('signup', 'lesson_started', 'lesson_completed', 'weekly_return', 'course_completed')),
  resource_key text check (resource_key is null or char_length(resource_key) between 1 and 200),
  created_at timestamptz not null default now()
);
create index analytics_events_created_idx on public.analytics_events (created_at desc);
create index analytics_events_user_idx on public.analytics_events (user_key, created_at desc);
create unique index analytics_events_resource_once_idx
  on public.analytics_events (user_key, event_type, resource_key)
  where resource_key is not null;
create unique index analytics_events_once_idx
  on public.analytics_events (user_key, event_type)
  where resource_key is null;

create or replace function public.delete_user_analytics_events()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from public.analytics_events where user_key = md5(old.id::text);
  return old;
end;
$$;
create trigger profiles_delete_analytics
  after delete on public.profiles
  for each row execute function public.delete_user_analytics_events();

alter table public.analytics_consents enable row level security;
alter table public.analytics_events enable row level security;

create policy "Users read own analytics consent"
  on public.analytics_consents for select to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.analytics_consents, public.analytics_events from anon, authenticated;
grant select on public.analytics_consents to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce((
    select role in ('creator', 'admin') and status = 'active'
    from public.profiles
    where id = (select auth.uid())
  ), false)
$$;

create or replace function public.is_creator()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce((
    select role = 'creator' and status = 'active'
    from public.profiles
    where id = (select auth.uid())
  ), false)
$$;

create or replace function public.get_analytics_consent()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select enabled
  from public.analytics_consents
  where user_id = (select auth.uid())
$$;

create or replace function public.set_analytics_consent(consent_enabled boolean)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then raise exception 'Authentication required.'; end if;
  insert into public.analytics_consents (user_id, enabled)
  values (current_user_id, consent_enabled)
  on conflict (user_id) do update
    set enabled = excluded.enabled, updated_at = now();
  if not consent_enabled then
    delete from public.analytics_events where user_key = md5(current_user_id::text);
  end if;
end;
$$;

create or replace function public.record_analytics_event(event_name text, resource_id text default null)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := (select auth.uid());
  event_resource text := resource_id;
begin
  if current_user_id is null then raise exception 'Authentication required.'; end if;
  if event_name not in ('signup', 'lesson_started', 'lesson_completed', 'weekly_return', 'course_completed') then
    raise exception 'Unsupported analytics event.';
  end if;
  if event_name in ('lesson_started', 'lesson_completed', 'course_completed') then
    if event_resource is null or char_length(event_resource) not between 1 and 200 then
      raise exception 'A valid resource is required for this analytics event.';
    end if;
  else
    event_resource := null;
  end if;
  if not coalesce(public.get_analytics_consent(), false) then return; end if;
  if event_name = 'weekly_return' then
    event_resource := 'week:' || to_char(date_trunc('week', now() at time zone 'Asia/Tashkent')::date, 'YYYY-MM-DD');
  end if;
  insert into public.analytics_events (user_key, event_type, resource_key)
  values (md5(current_user_id::text), event_name, event_resource)
  on conflict do nothing;
end;
$$;

create or replace function public.get_analytics_summary()
returns table (event_type text, event_count bigint, learner_count bigint)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then raise exception 'Administrator access required.'; end if;
  return query
    select events.event_type, count(*)::bigint, count(distinct events.user_key)::bigint
    from public.analytics_events as events
    where events.created_at >= now() - interval '30 days'
    group by events.event_type
    order by events.event_type;
end;
$$;

create table public.account_deletion_requests (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  requested_at timestamptz not null default now(),
  delete_after timestamptz not null
);
alter table public.account_deletion_requests enable row level security;
create policy "Users read own account deletion request"
  on public.account_deletion_requests for select to authenticated
  using (user_id = (select auth.uid()));
revoke all on public.account_deletion_requests from anon, authenticated;
grant select on public.account_deletion_requests to authenticated;

create or replace function public.request_account_deletion()
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := (select auth.uid());
  scheduled_for timestamptz := now() + interval '30 days';
begin
  if current_user_id is null then raise exception 'Authentication required.'; end if;
  insert into public.account_deletion_requests (user_id, delete_after)
  values (current_user_id, scheduled_for)
  on conflict (user_id) do update
    set requested_at = now(), delete_after = excluded.delete_after;
  return scheduled_for;
end;
$$;

create or replace function public.cancel_account_deletion()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if (select auth.uid()) is null then raise exception 'Authentication required.'; end if;
  delete from public.account_deletion_requests where user_id = (select auth.uid());
end;
$$;

create table public.forum_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.forum_posts(id) on delete cascade,
  reply_id uuid references public.forum_replies(id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'inappropriate', 'other')),
  details text not null default '' check (char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  constraint forum_report_single_target check ((post_id is null) <> (reply_id is null))
);

create or replace function public.export_my_data()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then raise exception 'Authentication required.'; end if;
  return jsonb_build_object(
    'exported_at', now(),
    'profile', (select to_jsonb(p) from public.profiles p where p.id = current_user_id),
    'learning_progress', (select to_jsonb(p) from public.learning_progress p where p.user_id = current_user_id),
    'quiz_results', coalesce((select jsonb_agg(to_jsonb(q)) from public.quiz_results q where q.user_id = current_user_id), '[]'::jsonb),
    'project_progress', coalesce((select jsonb_agg(to_jsonb(p)) from public.project_progress p where p.user_id = current_user_id), '[]'::jsonb),
    'saved_lessons', coalesce((select jsonb_agg(to_jsonb(s)) from public.saved_lessons s where s.user_id = current_user_id), '[]'::jsonb),
    'daily_challenges', coalesce((select jsonb_agg(to_jsonb(d)) from public.daily_challenges d where d.user_id = current_user_id), '[]'::jsonb),
    'forum_posts', coalesce((select jsonb_agg(to_jsonb(p)) from public.forum_posts p where p.author_id = current_user_id), '[]'::jsonb),
    'forum_replies', coalesce((select jsonb_agg(to_jsonb(r)) from public.forum_replies r where r.author_id = current_user_id), '[]'::jsonb),
    'forum_reports', coalesce((select jsonb_agg(to_jsonb(r)) from public.forum_reports r where r.reporter_id = current_user_id), '[]'::jsonb),
    'deletion_request', (select to_jsonb(d) from public.account_deletion_requests d where d.user_id = current_user_id),
    'analytics_consent', (select to_jsonb(c) from public.analytics_consents c where c.user_id = current_user_id),
    'analytics_events', coalesce((select jsonb_agg(to_jsonb(e)) from public.analytics_events e where e.user_key = md5(current_user_id::text)), '[]'::jsonb)
  );
end;
$$;

create index forum_reports_recent_idx on public.forum_reports (status, created_at desc);
create unique index forum_reports_post_once_idx on public.forum_reports (reporter_id, post_id) where post_id is not null and status = 'open';
create unique index forum_reports_reply_once_idx on public.forum_reports (reporter_id, reply_id) where reply_id is not null and status = 'open';
alter table public.forum_reports enable row level security;
create policy "Reporters and admins read forum reports"
  on public.forum_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select public.is_admin()));
create policy "Users report forum content"
  on public.forum_reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and (select auth.uid()) is not null
  );
create policy "Admins update forum reports"
  on public.forum_reports for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
revoke all on public.forum_reports from anon, authenticated;
grant select on public.forum_reports to authenticated;
grant insert (reporter_id, post_id, reply_id, reason, details) on public.forum_reports to authenticated;
grant update (status, reviewed_by, reviewed_at) on public.forum_reports to authenticated;

alter table public.forum_posts add column is_hidden boolean not null default false;
alter table public.forum_replies add column is_hidden boolean not null default false;
drop policy if exists "Everyone reads forum posts" on public.forum_posts;
drop policy if exists "Everyone reads forum replies" on public.forum_replies;
create policy "Users read visible forum posts"
  on public.forum_posts for select
  using (not is_hidden or (select public.is_admin()));
create policy "Users read visible forum replies"
  on public.forum_replies for select
  using (not is_hidden or (select public.is_admin()));

create or replace function public.set_forum_content_hidden(target_kind text, target_id uuid, should_hide boolean)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then raise exception 'Administrator access required.'; end if;
  if target_kind = 'post' then
    update public.forum_posts set is_hidden = should_hide where id = target_id;
  elsif target_kind = 'reply' then
    update public.forum_replies set is_hidden = should_hide where id = target_id;
  else
    raise exception 'Invalid forum content type.';
  end if;
  if not found then raise exception 'Forum content not found.'; end if;
end;
$$;

create or replace function public.limit_forum_post_rate()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recent_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.author_id::text, 0));
  if tg_table_name = 'forum_posts' then
    select count(*) into recent_count from public.forum_posts
    where author_id = new.author_id and created_at > now() - interval '1 hour';
    if recent_count >= 5 then raise exception 'You have reached the hourly topic limit.'; end if;
  else
    select count(*) into recent_count from public.forum_replies
    where author_id = new.author_id and created_at > now() - interval '1 hour';
    if recent_count >= 20 then raise exception 'You have reached the hourly reply limit.'; end if;
  end if;
  return new;
end;
$$;
create trigger forum_posts_rate_limit before insert on public.forum_posts
  for each row execute function public.limit_forum_post_rate();
create trigger forum_replies_rate_limit before insert on public.forum_replies
  for each row execute function public.limit_forum_post_rate();

revoke all on function public.get_analytics_consent(), public.set_analytics_consent(boolean),
  public.record_analytics_event(text, text), public.get_analytics_summary(),
  public.request_account_deletion(), public.cancel_account_deletion(), public.export_my_data(),
  public.set_forum_content_hidden(text, uuid, boolean), public.limit_forum_post_rate() from public, anon;
grant execute on function public.get_analytics_consent(), public.set_analytics_consent(boolean),
  public.record_analytics_event(text, text), public.get_analytics_summary(),
  public.request_account_deletion(), public.cancel_account_deletion(), public.export_my_data(),
  public.set_forum_content_hidden(text, uuid, boolean) to authenticated;
