-- Futurecraft Genesis onboarding. Transactional-only, no public read/write access.
create table if not exists public.futurecraft_genesis_registrations (
 id uuid primary key default gen_random_uuid(),
 programme text not null default 'genesis',
 name text not null check (char_length(name) between 2 and 90),
 email text not null unique check (char_length(email) <= 254),
 phone text check (phone is null or char_length(phone) <= 28),
 experience text not null check (experience in ('complete_beginner','exploring','building')),
 interest text not null check (interest in ('design','video','games','automation','everything')),
 status text not null default 'registered' check (status in ('registered','confirmed','cancelled','waitlisted')),
 consent_at timestamptz not null,
 confirmation_sent_at timestamptz,
 welcome_sent_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists futurecraft_genesis_registered_idx on public.futurecraft_genesis_registrations(created_at desc);
alter table public.futurecraft_genesis_registrations enable row level security;
revoke all on public.futurecraft_genesis_registrations from anon, authenticated;
-- Only server-side service credentials insert and read registrations.
