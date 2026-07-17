-- ─── TABLE ANALYSES ─────────────────────────────────────────────────────────
create table if not exists analyses (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  category    text not null,
  title       text,
  description text,
  verdict     text check (verdict in ('DIY', 'Pro')),
  price_min   integer,
  price_max   integer,
  confidence  integer check (confidence between 0 and 100),
  created_at  timestamp with time zone default now()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table analyses enable row level security;

-- Un utilisateur ne voit que ses propres analyses
create policy "select_own" on analyses
  for select using (auth.uid() = user_id);

-- Un utilisateur ne peut insérer que ses propres analyses
create policy "insert_own" on analyses
  for insert with check (auth.uid() = user_id);

-- Un utilisateur ne peut supprimer que ses propres analyses
create policy "delete_own" on analyses
  for delete using (auth.uid() = user_id);

-- ─── INDEX analyses ──────────────────────────────────────────────────────────
create index if not exists analyses_user_id_idx on analyses(user_id);
create index if not exists analyses_created_at_idx on analyses(created_at desc);


-- ─── TABLE SUBSCRIPTIONS ─────────────────────────────────────────────────────
create table if not exists subscriptions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  plan        text not null check (plan in ('usage', 'weekly', 'monthly')),
  status      text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  -- Pour "usage" : crédits restants
  credits     integer default 0,
  -- Dates de validité (pour weekly et monthly)
  starts_at   timestamp with time zone default now(),
  ends_at     timestamp with time zone,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

-- ─── RLS subscriptions ───────────────────────────────────────────────────────
alter table subscriptions enable row level security;

create policy "select_own_sub" on subscriptions
  for select using (auth.uid() = user_id);

create policy "insert_own_sub" on subscriptions
  for insert with check (auth.uid() = user_id);

create policy "update_own_sub" on subscriptions
  for update using (auth.uid() = user_id);

-- ─── INDEX subscriptions ─────────────────────────────────────────────────────
create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_status_idx on subscriptions(status);
