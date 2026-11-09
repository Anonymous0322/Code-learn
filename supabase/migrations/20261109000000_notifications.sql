create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('lesson', 'news', 'message')),
  title text not null check (char_length(title) between 1 and 160),
  body text not null check (char_length(body) between 1 and 2000),
  url text check (url is null or (left(url, 1) = '/' and left(url, 2) <> '//')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index notifications_created_idx on public.notifications (created_at desc);

create table public.notification_reads (
  user_id uuid not null references public.profiles(id) on delete cascade,
  notification_id uuid not null references public.notifications(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, notification_id)
);

alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;

create policy "Authenticated users read notifications"
  on public.notifications for select to authenticated
  using (true);
create policy "Admins create notifications"
  on public.notifications for insert to authenticated
  with check ((select public.is_admin()) and created_by = (select auth.uid()));

create policy "Users read own notification receipts"
  on public.notification_reads for select to authenticated
  using (user_id = (select auth.uid()));
create policy "Users mark own notifications as read"
  on public.notification_reads for insert to authenticated
  with check (user_id = (select auth.uid()));

revoke all on public.notifications, public.notification_reads from anon, authenticated;
grant select, insert on public.notifications to authenticated;
grant select, insert on public.notification_reads to authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.notifications;
    alter publication supabase_realtime add table public.notification_reads;
  end if;
exception
  when duplicate_object then null;
end;
$$;
