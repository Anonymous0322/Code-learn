create or replace function public.get_project_member_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*) from public.profiles where status = 'active'
$$;

revoke all on function public.get_project_member_count() from public;
grant execute on function public.get_project_member_count() to anon, authenticated;

create or replace function public.broadcast_project_member_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform realtime.send(
    jsonb_build_object('count', public.get_project_member_count()),
    'member_count_updated',
    'public:project-members',
    false
  );
  return null;
end;
$$;

revoke all on function public.broadcast_project_member_count() from public;

create trigger broadcast_project_member_count
after insert or update or delete on public.profiles
for each statement
execute function public.broadcast_project_member_count();
