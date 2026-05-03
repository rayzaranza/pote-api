-- Up Migration
CREATE TABLE collections (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT          NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Down Migration
DROP TABLE collections;