-- Up Migration
ALTER TABLE assets ADD COLUMN storage_id TEXT NOT NULL;

-- Down Migration
ALTER TABLE assets DROP COLUMN storage_id;
