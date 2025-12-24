create table if not exists public.members (
  auth_user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  role text not null,
  role_level int not null default 1,
  school text,
  grade text,
  needs_password_reset boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status text not null,
  priority text not null,
  category text not null,
  assignee text not null,
  start_date date not null,
  end_date date not null,
  progress int not null default 0,
  budget_planned int not null default 0,
  budget_actual int not null default 0,
  tags text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users (id) on delete cascade
);

create index if not exists tasks_created_at_idx on public.tasks (created_at desc);

alter table public.members enable row level security;
alter table public.tasks enable row level security;

create policy "members_select_all"
  on public.members for select
  to authenticated
  using (true);

create policy "members_insert_self"
  on public.members for insert
  to authenticated
  with check (auth.uid() = auth_user_id);

create policy "members_update_self"
  on public.members for update
  to authenticated
  using (auth.uid() = auth_user_id);

create policy "tasks_select_all"
  on public.tasks for select
  to authenticated
  using (true);

create policy "tasks_insert_leader_only"
  on public.tasks for insert
  to authenticated
  with check (
    exists (
      select 1 from public.members
      where auth_user_id = auth.uid()
        and role_level >= 2
    )
  );

create policy "tasks_update_owner_or_leader"
  on public.tasks for update
  to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.members
      where auth_user_id = auth.uid()
        and role_level >= 2
    )
  );

create policy "tasks_delete_owner_or_leader"
  on public.tasks for delete
  to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.members
      where auth_user_id = auth.uid()
        and role_level >= 2
    )
  );
