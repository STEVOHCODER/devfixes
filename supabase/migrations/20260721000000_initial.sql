create extension if not exists pg_trgm;

create table if not exists public.errors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  language text not null,
  framework text,
  category text not null,
  severity text not null check (severity in ('Low', 'Medium', 'High')),
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  fix_time text not null,
  popularity integer not null default 0 check (popularity between 0 and 100),
  views bigint not null default 0,
  trend integer not null default 0,
  tags text[] not null default '{}',
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists errors_title_trgm_idx on public.errors using gin (title gin_trgm_ops);
create index if not exists errors_tags_idx on public.errors using gin (tags);
create index if not exists errors_status_idx on public.errors (status, popularity desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists errors_set_updated_at on public.errors;
create trigger errors_set_updated_at
before update on public.errors
for each row execute function public.set_updated_at();

create table if not exists public.solution_votes (
  id bigint generated always as identity primary key,
  error_slug text not null references public.errors(slug) on delete cascade,
  voter_hash text not null,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (error_slug, voter_hash)
);

drop trigger if exists solution_votes_set_updated_at on public.solution_votes;
create trigger solution_votes_set_updated_at
before update on public.solution_votes
for each row execute function public.set_updated_at();

create table if not exists public.error_reports (
  id uuid primary key default gen_random_uuid(),
  error_slug text not null references public.errors(slug) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_created_idx
  on public.analytics_events (event_name, created_at desc);

create table if not exists public.bookmarks (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  error_slug text not null references public.errors(slug) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, error_slug)
);

create table if not exists public.debug_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  fingerprint text,
  language text,
  error_type text,
  confidence integer,
  input_object_key text,
  result jsonb,
  created_at timestamptz not null default now()
);

alter table public.errors enable row level security;
alter table public.solution_votes enable row level security;
alter table public.error_reports enable row level security;
alter table public.analytics_events enable row level security;
alter table public.bookmarks enable row level security;
alter table public.debug_sessions enable row level security;

drop policy if exists "Published errors are public" on public.errors;
create policy "Published errors are public"
  on public.errors for select
  using (status = 'published');

drop policy if exists "Users read own bookmarks" on public.bookmarks;
create policy "Users read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

drop policy if exists "Users manage own bookmarks" on public.bookmarks;
create policy "Users manage own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into public.errors (
  slug, title, excerpt, language, category, severity, difficulty,
  fix_time, popularity, views, trend, tags, status, verified_at
) values
  (
    'python-modulenotfounderror-requests',
    'ModuleNotFoundError: No module named ''requests''',
    'Python cannot find the requests package in the interpreter environment that is running your code.',
    'Python',
    'Packages and imports',
    'Medium',
    'Beginner',
    '2-5 min',
    98,
    284300,
    18,
    array['python', 'pip', 'requests', 'virtualenv', 'imports'],
    'published',
    '2026-07-21T00:00:00Z'
  ),
  (
    'javascript-cannot-read-properties-of-undefined',
    'TypeError: Cannot read properties of undefined',
    'JavaScript tried to read a property from a value that is currently undefined.',
    'JavaScript',
    'Runtime',
    'High',
    'Beginner',
    '5-15 min',
    100,
    491200,
    24,
    array['javascript', 'undefined', 'typeerror', 'runtime'],
    'published',
    '2026-07-21T00:00:00Z'
  )
on conflict (slug) do nothing;
