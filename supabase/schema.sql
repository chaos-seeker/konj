-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  full_name text not null,
  password text not null,
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Publishers
create table if not exists publishers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Authors
create table if not exists authors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Translators
create table if not exists translators (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Books
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image text not null,
  price numeric not null,
  discount numeric not null default 0,
  description text not null,
  category_id uuid references categories(id) on delete set null,
  publisher_id uuid references publishers(id) on delete set null,
  pages integer not null,
  publication_year integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sold_count integer not null default 0
);

-- Book relations
create table if not exists book_authors (
  book_id uuid references books(id) on delete cascade,
  author_id uuid references authors(id) on delete cascade,
  primary key (book_id, author_id)
);

-- Book translators
create table if not exists book_translators (
  book_id uuid references books(id) on delete cascade,
  translator_id uuid references translators(id) on delete cascade,
  primary key (book_id, translator_id)
);

-- Comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete cascade,
  full_name text not null,
  text text not null,
  rating integer not null check (rating between 1 and 5),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key,
  full_name text not null,
  username text not null,
  total_price numeric not null,
  total_discount numeric not null,
  final_price numeric not null,
  created_at timestamptz not null
);


