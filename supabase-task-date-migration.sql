-- Run this once in the Supabase SQL Editor for existing projects.

alter table tasks
  add column if not exists task_date date not null default current_date;

create index if not exists tasks_task_date_idx on tasks(task_date desc);
