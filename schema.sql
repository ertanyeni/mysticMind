-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  preferences jsonb
);

-- Dreams table
create table public.dreams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  content text not null,
  date timestamp with time zone not null,
  tags text[] default '{}',
  ai_interpretation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_private boolean default false
);

-- Tags table
create table public.tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  name text not null,
  color text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create updated_at triggers
create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger handle_dreams_updated_at
  before update on public.dreams
  for each row
  execute function public.handle_updated_at();

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.dreams enable row level security;
alter table public.tags enable row level security;

-- Users policies
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Dreams policies
create policy "Users can view own dreams" on public.dreams
  for select using (auth.uid() = user_id);

create policy "Users can insert own dreams" on public.dreams
  for insert with check (auth.uid() = user_id);

create policy "Users can update own dreams" on public.dreams
  for update using (auth.uid() = user_id);

create policy "Users can delete own dreams" on public.dreams
  for delete using (auth.uid() = user_id);

-- Tags policies
create policy "Users can view own tags" on public.tags
  for select using (auth.uid() = user_id);

create policy "Users can insert own tags" on public.tags
  for insert with check (auth.uid() = user_id);

create policy "Users can update own tags" on public.tags
  for update using (auth.uid() = user_id);

create policy "Users can delete own tags" on public.tags
  for delete using (auth.uid() = user_id);

-- Create indexes for better performance
create index dreams_user_id_idx on public.dreams(user_id);
create index dreams_date_idx on public.dreams(date);
create index tags_user_id_idx on public.tags(user_id);
create index tags_name_idx on public.tags(name);

-- Add comments to tables
comment on table public.users is 'Stores user information and preferences';
comment on table public.dreams is 'Stores user dream entries with AI interpretations';
comment on table public.tags is 'Stores user-defined tags for categorizing dreams'; 