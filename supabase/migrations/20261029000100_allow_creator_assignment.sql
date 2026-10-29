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
  if new_role is null or new_role not in ('creator', 'admin', 'user') then
    raise exception 'Invalid user role.';
  end if;
  if exists (select 1 from public.profiles where id = target_id and role = 'creator')
     and new_role <> 'creator' then
    raise exception 'The creator role cannot be removed.';
  end if;
  update public.profiles set role = new_role where id = target_id;
  if not found then raise exception 'User profile not found.'; end if;
end;
$$;
