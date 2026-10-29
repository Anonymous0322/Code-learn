create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  role text not null default 'user' check (role in ('creator', 'admin', 'user')),
  status text not null default 'active' check (status in ('active', 'banned')),
  avatar text,
  created_at timestamptz not null default now(),
  constraint profiles_name_length check (char_length(name) <= 120)
);

create table public.courses (
  id text primary key,
  slug text not null unique,
  language_code text not null,
  icon_url text,
  title text not null,
  description text not null default '',
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  order_index integer not null default 0,
  is_active boolean not null default true,
  deleted boolean not null default false,
  levels jsonb not null default '[]'::jsonb check (jsonb_typeof(levels) = 'array'),
  translations jsonb,
  created_at timestamptz not null default now(),
  constraint courses_title_length check (char_length(title) between 1 and 200)
);
create index courses_active_order_idx on public.courses (is_active, order_index);

create table public.learning_progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  completed_lesson_ids text[] not null default '{}',
  active_days date[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint learning_progress_size check (cardinality(completed_lesson_ids) <= 10000 and cardinality(active_days) <= 10000)
);

create table public.quiz_results (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  percentage integer not null check (percentage between 0 and 100),
  submitted_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  constraint quiz_result_score check (score <= total)
);

create table public.project_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id text not null,
  completed_steps integer[] not null default '{}',
  code text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, project_id),
  constraint project_progress_size check (cardinality(completed_steps) <= 50 and char_length(code) <= 20000)
);

create table public.saved_lessons (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  note text not null default '',
  is_saved boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id, lesson_id),
  constraint saved_lessons_note_length check (char_length(note) <= 2000)
);

create table public.daily_challenges (
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_date date not null,
  challenge_id text not null,
  passed_count integer not null check (passed_count >= 0),
  total integer not null check (total > 0),
  completed boolean not null,
  primary key (user_id, challenge_date),
  constraint daily_challenge_score check (passed_count <= total and completed = (passed_count = total))
);

create table public.study_plans (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  week_start date not null,
  goal integer not null check (goal between 1 and 30),
  lesson_ids text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint study_plan_size check (cardinality(lesson_ids) <= 30)
);

create table public.lesson_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null,
  lesson_id text not null,
  lesson_title text not null default '',
  message text not null check (char_length(message) between 8 and 2000),
  status text not null default 'open' check (status in ('open', 'reviewed')),
  created_at timestamptz not null default now()
);
create index lesson_feedback_created_idx on public.lesson_feedback (created_at desc);

create table public.user_portfolios (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  share_id uuid not null unique default gen_random_uuid(),
  display_name text not null default 'CodeLearn o‘quvchisi' check (char_length(display_name) between 1 and 80),
  projects jsonb not null default '[]'::jsonb check (jsonb_typeof(projects) = 'array' and jsonb_array_length(projects) <= 3),
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);
create index user_portfolios_share_idx on public.user_portfolios (share_id) where is_public;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('creator', 'admin'), false)
$$;

create or replace function public.is_creator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'creator', false)
$$;

create or replace function public.set_user_role(target_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_creator() then
    raise exception 'Only the creator can change user roles.';
  end if;
  if new_role is null or new_role not in ('admin', 'user') then
    raise exception 'The creator role can only be assigned from the Supabase SQL Editor.';
  end if;
  if exists (select 1 from public.profiles where id = target_id and role = 'creator')
     and new_role <> 'creator' then
    raise exception 'The creator role cannot be removed.';
  end if;
  update public.profiles set role = new_role where id = target_id;
  if not found then raise exception 'User profile not found.'; end if;
end;
$$;

create or replace function public.set_user_status(target_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required.';
  end if;
  if new_status not in ('active', 'banned') then
    raise exception 'Invalid user status.';
  end if;
  if exists (select 1 from public.profiles where id = target_id and role = 'creator') then
    raise exception 'The creator cannot be banned.';
  end if;
  update public.profiles set status = new_status where id = target_id;
  if not found then raise exception 'User profile not found.'; end if;
end;
$$;

create or replace function public.record_learning_visit()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  today date := (now() at time zone 'Asia/Tashkent')::date;
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;
  insert into public.learning_progress (user_id, active_days)
  values (auth.uid(), array[today])
  on conflict (user_id) do update
    set active_days = case
      when today = any(public.learning_progress.active_days) then public.learning_progress.active_days
      else array_append(public.learning_progress.active_days, today)
    end,
    updated_at = now();
end;
$$;

create or replace function public.mark_lesson_complete(lesson_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  today date := (now() at time zone 'Asia/Tashkent')::date;
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;
  if char_length(lesson_key) not between 1 and 400 then raise exception 'Invalid lesson key.'; end if;
  insert into public.learning_progress (user_id, completed_lesson_ids, active_days)
  values (auth.uid(), array[lesson_key], array[today])
  on conflict (user_id) do update
    set completed_lesson_ids = case
      when lesson_key = any(public.learning_progress.completed_lesson_ids) then public.learning_progress.completed_lesson_ids
      else array_append(public.learning_progress.completed_lesson_ids, lesson_key)
    end,
    active_days = case
      when today = any(public.learning_progress.active_days) then public.learning_progress.active_days
      else array_append(public.learning_progress.active_days, today)
    end,
    updated_at = now();
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)), 120),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.get_public_portfolio(requested_share_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'shareId', share_id,
    'displayName', display_name,
    'projects', projects
  )
  from public.user_portfolios
  where share_id = requested_share_id and is_public = true
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.learning_progress enable row level security;
alter table public.quiz_results enable row level security;
alter table public.project_progress enable row level security;
alter table public.saved_lessons enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.study_plans enable row level security;
alter table public.lesson_feedback enable row level security;
alter table public.user_portfolios enable row level security;

create policy "Profiles readable by owner and admins"
  on public.profiles for select
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "Profiles updateable by owner or authorized admins"
  on public.profiles for update
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and role = (select public.current_user_role()));

create policy "Active courses readable publicly"
  on public.courses for select
  using (is_active or (select public.is_admin()));
create policy "Admins manage courses"
  on public.courses for all
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Own learning progress"
  on public.learning_progress for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Own quiz results"
  on public.quiz_results for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Own project progress"
  on public.project_progress for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Own saved lessons"
  on public.saved_lessons for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Own daily challenge results"
  on public.daily_challenges for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "Own study plan"
  on public.study_plans for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Learners submit feedback"
  on public.lesson_feedback for insert
  with check (user_id = (select auth.uid()) and status = 'open');
create policy "Admins read feedback"
  on public.lesson_feedback for select
  using ((select public.is_admin()));
create policy "Admins update feedback status"
  on public.lesson_feedback for update
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Portfolio readable by owner"
  on public.user_portfolios for select
  using (user_id = (select auth.uid()));
create policy "Owner manages own portfolio"
  on public.user_portfolios for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke all on public.profiles, public.courses, public.learning_progress, public.quiz_results,
  public.project_progress, public.saved_lessons, public.daily_challenges, public.study_plans,
  public.lesson_feedback, public.user_portfolios from anon, authenticated;
grant select, insert, update, delete on public.profiles, public.courses, public.learning_progress,
  public.quiz_results, public.project_progress, public.saved_lessons, public.daily_challenges,
  public.study_plans, public.lesson_feedback, public.user_portfolios to authenticated;
revoke insert, delete, update on public.profiles from authenticated;
grant update (name, avatar) on public.profiles to authenticated;
grant select on public.courses to anon;
grant execute on function public.current_user_role(), public.is_admin(), public.is_creator(),
  public.set_user_role(uuid, text), public.set_user_status(uuid, text),
  public.record_learning_visit(), public.mark_lesson_complete(text),
  public.get_public_portfolio(uuid) to anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.courses;
    alter publication supabase_realtime add table public.saved_lessons;
  end if;
exception
  when duplicate_object then null;
end;
$$;
