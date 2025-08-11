-- GeneDetective Database Schema
-- Based on the relational model from seminar report

-- Note: Use the provided university database SISIII2024_89201217
-- This schema should be run in that database
USE SISIII2024_89201217;

-- Users table (base table for all user types)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_birth DATE,
    user_role INT NOT NULL DEFAULT 1, -- 1=Patient, 2=Genetic Counselor, 3=Admin, 4=Researcher
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table (specific data for patients)
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    medical_history TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Genetic Counselors table
CREATE TABLE genetic_counselors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialization VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Researchers table
CREATE TABLE researchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    institution VARCHAR(100),
    research_area VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Genetic Data table
CREATE TABLE genetic_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    genetic_data_raw TEXT, -- JSON format for raw genetic data
    ancestry_data TEXT, -- JSON format for ancestry information
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Gene Expression table
CREATE TABLE gene_expressions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    gene_expression_result TEXT, -- JSON format for analysis results
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Risk Assessment table
CREATE TABLE risk_assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    counselor_id INT NOT NULL,
    risk_assessment_result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES genetic_counselors(id) ON DELETE CASCADE
);

-- Recommendations table
CREATE TABLE recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    counselor_id INT NOT NULL,
    recommendation_results TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES genetic_counselors(id) ON DELETE CASCADE
);

-- Research Data table (anonymized data for research)
CREATE TABLE research_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    anonymized_id VARCHAR(50) UNIQUE NOT NULL,
    researcher_id INT NOT NULL,
    anonymized_genetic_data TEXT, -- Anonymized genetic information
    anonymized_medical_data TEXT, -- Anonymized medical information
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (researcher_id) REFERENCES researchers(id) ON DELETE CASCADE
);

-- Sample data for testing
INSERT INTO users (full_name, email, password_hash, date_birth, user_role) VALUES
('John Doe', 'john.patient@example.com', '$2a$10$example_hash_patient', '1985-03-15', 1),
('Dr. Sarah Smith', 'sarah.counselor@example.com', '$2a$10$example_hash_counselor', '1978-07-22', 2),
('Admin User', 'admin@genedetective.com', '$2a$10$example_hash_admin', '1980-01-01', 3),
('Dr. Research Lab', 'research@university.edu', '$2a$10$example_hash_researcher', '1975-11-30', 4);

INSERT INTO patients (user_id, medical_history) VALUES
(1, 'Family history of diabetes, hypertension. No known genetic disorders.');

INSERT INTO genetic_counselors (user_id, specialization) VALUES
(2, 'Clinical Genetics');

INSERT INTO researchers (user_id, institution, research_area) VALUES
(4, 'University Medical Center', 'Genomic Medicine');

-- Sample genetic data
INSERT INTO genetic_data (patient_id, genetic_data_raw, ancestry_data) VALUES
(1, '{"chromosome_1": {"position_12345": "AA", "position_67890": "GT"}, "chromosome_2": {"position_11111": "CC", "position_22222": "AT"}}', '{"european": 0.65, "asian": 0.25, "african": 0.1}');

-- Sample gene expression analysis
INSERT INTO gene_expressions (patient_id, gene_expression_result) VALUES
(1, '{"analyzed_genes": ["BRCA1", "APOE", "CFTR"], "risk_variants": [{"gene": "APOE", "variant": "e3/e4", "risk_level": "moderate"}], "beneficial_traits": [{"gene": "ACTN3", "variant": "R/R", "trait": "enhanced_athletic_performance"}]}');