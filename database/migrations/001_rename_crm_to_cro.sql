-- Migration: rename crm to cro in users table
-- Run this in Neon SQL editor
ALTER TABLE users RENAME COLUMN crm TO cro;
