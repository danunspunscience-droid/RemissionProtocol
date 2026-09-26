-- Enable foreign key support
PRAGMA foreign_keys = ON;

-- 1. Client Accounts Table
CREATE TABLE IF NOT EXISTS client_users (
 Id TEXT PRIMARY KEY,
 Email TEXT UNIQUE NOT NULL,
 Password_hash TEXT NOT NULL,
 Full_name TEXT NOT NULL,
 Role TEXT DEFAULT 'client',
 Created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Physical & Metabolic Metrics Table (PWA Metric Foundation)
CREATE TABLE IF NOT EXISTS client_metrics (
 Id TEXT PRIMARY KEY,
 Client_id TEXT NOT NULL,
 Metric_type TEXT NOT NULL, -- e.g., 'hrv', 'sleep_score', 'fasting_glucose', 'metabolic_volume'
 Value REAL NOT NULL,
 Unit TEXT NOT NULL,
 Notes TEXT,
 Recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (client_id) REFERENCES client_users(id) ON DELETE CASCADE
);

-- 3. Protected Client Documents Mapping (Cloudflare R2 Integration)
CREATE TABLE IF NOT EXISTS client_files (
 Id TEXT PRIMARY KEY,
 Client_id TEXT NOT NULL,
 File_name TEXT NOT NULL,
 R2_key TEXT NOT NULL, -- e.g., 'private/clients/client-1/lab-results-2026.pdf'
 File_type TEXT NOT NULL,
 File_size INTEGER NOT NULL,
 Uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (client_id) REFERENCES client_users(id) ON DELETE CASCADE
);

-- 4. Client Appointments Schedule Table
CREATE TABLE IF NOT EXISTS appointments (
 Id TEXT PRIMARY KEY,
 Client_id TEXT NOT NULL,
 Title TEXT NOT NULL,
 Status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
 Scheduled_at DATETIME NOT NULL,
 Notes TEXT,
 Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (client_id) REFERENCES client_users(id) ON DELETE CASCADE
);

-- Indices for rapid relational query resolution
CREATE INDEX IF NOT EXISTS idx_client_metrics_client_id ON client_metrics(client_id);
CREATE INDEX IF NOT EXISTS idx_client_files_client_id ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);

-- Seed Default Demo Client Account (password: client123)
-- SHA-256('client123') = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
INSERT INTO client_users (id, email, password_hash, full_name, role)
VALUES (
 'client-demo-1',
 'client@remissionprotocol.com',
 '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
 'Metabolic Protocol Client',
 'client'
)
ON CONFLICT(email) DO UPDATE SET
 Password_hash = excluded.password_hash;