create table if not exists public.tutorials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  technology text not null,
  category text not null,
  difficulty text not null check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  estimated_time text not null,
  tags text[] not null default '{}',
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tutorials_title_trgm_idx
  on public.tutorials using gin (title gin_trgm_ops);
create index if not exists tutorials_tags_idx
  on public.tutorials using gin (tags);
create index if not exists tutorials_status_idx
  on public.tutorials (status, published_at desc);

drop trigger if exists tutorials_set_updated_at on public.tutorials;
create trigger tutorials_set_updated_at
before update on public.tutorials
for each row execute function public.set_updated_at();

alter table public.tutorials enable row level security;

drop policy if exists "Published tutorials are public" on public.tutorials;
create policy "Published tutorials are public"
  on public.tutorials for select
  using (status = 'published');
