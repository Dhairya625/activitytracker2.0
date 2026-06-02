-- Run this in Supabase SQL Editor AFTER supabase-schema.sql

-- Link members to auth users
alter table members add column if not exists user_id uuid references auth.users(id) on delete set null;
create unique index if not exists members_user_id_idx on members(user_id) where user_id is not null;

-- Drop old permissive policies
drop policy if exists "allow all members" on members;
drop policy if exists "allow all tasks" on tasks;

-- Members: anyone authenticated can read; insert only when claiming; update only own
create policy "members_select" on members for select to authenticated using (true);
create policy "members_insert" on members for insert to authenticated with check (true);
create policy "members_update" on members for update to authenticated using (user_id = auth.uid());
create policy "members_delete" on members for delete to authenticated using (user_id = auth.uid());

-- Tasks: authenticated can read all; can only write for own member
create policy "tasks_select" on tasks for select to authenticated using (true);
create policy "tasks_insert" on tasks for insert to authenticated
  with check (
    member_id in (select id from members where user_id = auth.uid())
  );
create policy "tasks_update" on tasks for update to authenticated
  using (member_id in (select id from members where user_id = auth.uid()));
create policy "tasks_delete" on tasks for delete to authenticated
  using (member_id in (select id from members where user_id = auth.uid()));
