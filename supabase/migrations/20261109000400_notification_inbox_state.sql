create table public.notification_inbox_state (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  cleared_at timestamptz not null default now()
);

alter table public.notification_inbox_state enable row level security;

create policy "Users read own notification inbox state"
  on public.notification_inbox_state for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users create own notification inbox state"
  on public.notification_inbox_state for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users update own notification inbox state"
  on public.notification_inbox_state for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke all on public.notification_inbox_state from anon, authenticated;
grant select, insert, update on public.notification_inbox_state to authenticated;
