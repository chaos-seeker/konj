-- ============================================
-- Database Setup Script for Konj Bookstore
-- ============================================
-- This script will drop all existing tables and recreate them
-- Run this in your Supabase SQL Editor
-- ============================================

-- Drop all tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS translators CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS publishers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- Create Tables
-- ============================================

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  password text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Publishers table
CREATE TABLE publishers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Authors table
CREATE TABLE authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Translators table
CREATE TABLE translators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Books table
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  price numeric NOT NULL,
  discount numeric NOT NULL DEFAULT 0,
  description text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  publisher_id uuid REFERENCES publishers(id) ON DELETE SET NULL,
  author_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  translator_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  pages integer NOT NULL,
  publication_year integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sold_count integer NOT NULL DEFAULT 0
);

-- Comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  text text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  full_name text NOT NULL,
  username text NOT NULL,
  total_price numeric NOT NULL,
  total_discount numeric NOT NULL,
  final_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL
);

-- ============================================
-- Create Indexes for Better Performance
-- ============================================

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Indexes for publishers
CREATE INDEX IF NOT EXISTS idx_publishers_slug ON publishers(slug);

-- Indexes for authors
CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);

-- Indexes for translators
CREATE INDEX IF NOT EXISTS idx_translators_slug ON translators(slug);

-- Indexes for books
CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_publisher_id ON books(publisher_id);
CREATE INDEX IF NOT EXISTS idx_books_author_ids ON books USING GIN (author_ids);
CREATE INDEX IF NOT EXISTS idx_books_translator_ids ON books USING GIN (translator_ids);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_book_id ON comments(book_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_username ON orders(username);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ============================================
-- Setup Complete!
-- ============================================
-- All tables have been created successfully.
-- You can now use the application.
-- ============================================

