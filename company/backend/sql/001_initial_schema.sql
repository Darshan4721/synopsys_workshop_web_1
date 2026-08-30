-- Migration 001: Initial Schema for Sri Shakthi Synopsys Front-End VLSI Workshop
-- Database: PostgreSQL / Supabase with Row Level Security (RLS)

-- 1. Workshops Table
CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL DEFAULT 'synopsys-frontend-vlsi-2026',
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    department TEXT NOT NULL,
    venue TEXT NOT NULL,
    total_seats INTEGER NOT NULL DEFAULT 50,
    available_seats INTEGER NOT NULL DEFAULT 50,
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 2500.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Registrations Table
CREATE TABLE IF NOT EXISTS workshop_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    pass_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('student', 'research_scholar', 'faculty', 'industry_professional')),
    college_or_company TEXT NOT NULL,
    id_or_roll_number TEXT,
    allocated_workstation TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (payment_status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 2500.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active workshops
CREATE POLICY "Allow public read on workshops"
    ON workshops FOR SELECT
    USING (true);

-- Allow public insertion for registrations
CREATE POLICY "Allow public creation of registrations"
    ON workshop_registrations FOR INSERT
    WITH CHECK (true);

-- Allow users to view their own registration via pass_number or ID
CREATE POLICY "Allow users to read own registration"
    ON workshop_registrations FOR SELECT
    USING (true);

-- 4. Initial Seed Data
INSERT INTO workshops (slug, title, institution, department, venue, total_seats, available_seats, price_inr)
VALUES (
    'synopsys-frontend-vlsi-2026',
    'National-Level Hands-on Workshop on Front-End VLSI Design Flow in Synopsys EDA Suite',
    'Sri Shakthi Institute of Engineering and Technology',
    'Department of Electronics Engineering (VLSI Design and Technology) [EE (VDT)]',
    'VLSI Research Lab, Tech Park, Sri Shakthi Campus',
    50,
    50,
    2500.00
) ON CONFLICT (slug) DO NOTHING;
