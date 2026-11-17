alter table public.user_portfolios
  alter column display_name set default 'CodeHub o‘quvchisi';

update public.user_portfolios
set display_name = 'CodeHub o‘quvchisi'
where display_name in ('CodeLearn öquvçisi', 'CodeLearn o‘quvchisi');
