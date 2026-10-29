-- Separate Futurecraft list: a stable welcome key and a private unsubscribe capability.
alter table public.futurecraft_newsletter_subscribers
 add column if not exists unsubscribe_token uuid not null default gen_random_uuid(),
 add column if not exists welcome_sent_at timestamptz,
 add column if not exists unsubscribed_at timestamptz;
create unique index if not exists futurecraft_newsletter_unsubscribe_idx
 on public.futurecraft_newsletter_subscribers(unsubscribe_token);
alter table public.futurecraft_newsletter_subscribers enable row level security;
revoke all on public.futurecraft_newsletter_subscribers from anon, authenticated;
