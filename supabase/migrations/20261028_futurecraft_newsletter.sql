-- Futurecraft newsletter, isolated from Silk Studio marketing sign-ups.
create table if not exists public.futurecraft_newsletter_subscribers (
 email text primary key check(char_length(email)<=254),
 subscribed_at timestamptz not null default now()
);
alter table public.futurecraft_newsletter_subscribers enable row level security;
revoke all on public.futurecraft_newsletter_subscribers from anon,authenticated;
