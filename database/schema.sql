CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    cro VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'starter',
    is_active BOOLEAN DEFAULT TRUE,
    franchise_id VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signatures (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id) UNIQUE,
    embedding vector(1536),
    signature_metadata JSONB,
    cases_count INTEGER DEFAULT 0,
    confidence_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS signatures_embedding_idx ON signatures USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR PRIMARY KEY,
    orthodontist_id VARCHAR REFERENCES users(id),
    franchise_id VARCHAR,
    full_name VARCHAR(255) NOT NULL,
    birth_date TIMESTAMP,
    sex VARCHAR(1),
    phone VARCHAR(20),
    email VARCHAR(255),
    chief_complaint TEXT,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cases (
    id VARCHAR PRIMARY KEY,
    patient_id VARCHAR REFERENCES patients(id),
    orthodontist_id VARCHAR REFERENCES users(id),
    franchise_id VARCHAR,
    status VARCHAR(50) DEFAULT 'pending',
    processing_stage VARCHAR(100),
    patient_age INTEGER,
    patient_sex VARCHAR(1),
    chief_complaint TEXT,
    anamnesis TEXT,
    image_urls JSONB,
    ai_diagnosis JSONB,
    treatment_plan JSONB,
    clinical_warnings JSONB,
    pdf_report_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    analyzed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cephalometric_measurements (
    id VARCHAR PRIMARY KEY,
    case_id VARCHAR REFERENCES cases(id),
    source VARCHAR(50) DEFAULT 'webceph',
    sna FLOAT, snb FLOAT, anb FLOAT, fma FLOAT, impa FLOAT, fmia FLOAT,
    u1_na_angle FLOAT, u1_na_mm FLOAT, l1_nb_angle FLOAT, l1_nb_mm FLOAT,
    wits FLOAT, co_a FLOAT, co_gn FLOAT, facial_axis FLOAT, convexity FLOAT,
    overjet FLOAT, overbite FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_base (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    author VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    measurement VARCHAR(100),
    category VARCHAR(100),
    norm_value FLOAT,
    norm_sd FLOAT,
    norm_unit VARCHAR(50),
    source TEXT,
    year_published INTEGER
);

CREATE INDEX IF NOT EXISTS kb_embedding_idx ON knowledge_base USING hnsw (embedding vector_cosine_ops);
