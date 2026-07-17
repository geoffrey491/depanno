-- ─── TABLE SUBSCRIPTIONS ─────────────────────────────────────────────────────
create table if not exists subscriptions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  plan        text not null check (plan in ('usage', 'weekly', 'monthly')),
  status      text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  credits     integer default 0,
  starts_at   timestamp with time zone default now(),
  ends_at     timestamp with time zone,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now()
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table subscriptions enable row level security;

create policy "select_own_sub" on subscriptions
  for select using (auth.uid() = user_id);

create policy "insert_own_sub" on subscriptions
  for insert with check (auth.uid() = user_id);

create policy "update_own_sub" on subscriptions
  for update using (auth.uid() = user_id);

-- ─── INDEX ───────────────────────────────────────────────────────────────────
create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_status_idx on subscriptions(status);
