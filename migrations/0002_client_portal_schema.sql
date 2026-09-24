CREATE TABLE IF NOT EXISTS client_profiles (
 Id TEXT PRIMARY KEY,
 Email TEXT UNIQUE NOT NULL,
 Password_hash TEXT NOT NULL,
 Full_name TEXT NOT NULL,
 Status TEXT DEFAULT 'active',
 Created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS client_sessions (
 Id TEXT PRIMARY KEY,
 Client_id TEXT NOT NULL,
 Token TEXT UNIQUE NOT NULL,
 Expires_at TEXT NOT NULL,
 Created_at TEXT DEFAULT (datetime('now')),
 FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS client_metrics (
 Id TEXT PRIMARY KEY,
 Client_id TEXT NOT NULL,
 Metric_type TEXT NOT NULL,
 Metric_value REAL NOT NULL,
 Unit TEXT NOT NULL,
 Notes TEXT,
 Recorded_at TEXT DEFAULT (datetime('now')),
 FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE
);