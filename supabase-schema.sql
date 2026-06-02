-- Run this in your Supabase SQL editor

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#00d4ff',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  member_id uuid not null references members(id) on delete cascade,
  category text not null default 'Other',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table members enable row level security;
alter table tasks enable row level security;

-- Allow all operations for anon key (adjust for auth later)
create policy "allow all members" on members for all using (true) with check (true);
create policy "allow all tasks" on tasks for all using (true) with check (true);

-- Indexes for common queries
create index if not exists tasks_member_id_idx on tasks(member_id);
create index if not exists tasks_created_at_idx on tasks(created_at desc);
