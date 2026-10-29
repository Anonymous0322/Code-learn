insert into public.profiles (id, name, email)
select
  users.id,
  left(coalesce(users.raw_user_meta_data ->> 'name', split_part(coalesce(users.email, ''), '@', 1)), 120),
  coalesce(users.email, '')
from auth.users as users
on conflict (id) do nothing;

notify pgrst, 'reload schema';
