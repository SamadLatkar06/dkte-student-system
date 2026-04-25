-- Run in Supabase SQL editor

create table if not exists public.students (
  prn text primary key,
  name text not null,
  mother_name text not null,
  branch text not null,
  year text not null,
  cgpa numeric(4,2) not null check (cgpa >= 0 and cgpa <= 10),
  photo_url text
);

alter table public.students add column if not exists mother_name text;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  prn text not null references public.students(prn) on delete cascade,
  doc_name text not null,
  file_url text not null,
  uploaded_at timestamptz not null default now()
);

alter table public.students enable row level security;
alter table public.documents enable row level security;

-- Public read access for student lookup via QR scan
create policy if not exists "public can read students"
on public.students for select
to anon, authenticated
using (true);

create policy if not exists "public can read documents"
on public.documents for select
to anon, authenticated
using (true);

-- Admin write policies based on auth JWT app metadata role
create policy if not exists "admin can insert students"
on public.students for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy if not exists "admin can update students"
on public.students for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy if not exists "admin can delete students"
on public.students for delete
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy if not exists "admin can insert documents"
on public.documents for insert
to authenticated
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy if not exists "admin can update documents"
on public.documents for update
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy if not exists "admin can delete documents"
on public.documents for delete
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Storage setup
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

create policy if not exists "public can read document storage"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'documents');

create policy if not exists "admin can upload document storage"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'documents' and
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy if not exists "admin can update document storage"
on storage.objects for update
to authenticated
using (
  bucket_id = 'documents' and
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy if not exists "admin can delete document storage"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'documents' and
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);
