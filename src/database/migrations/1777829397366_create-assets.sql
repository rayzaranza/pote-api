-- Up Migration
CREATE TABLE assets (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT          NOT NULL,
  description     TEXT,
  type            asset_type    NOT NULL,
  url             TEXT          NOT NULL,
  size            BIGINT        NOT NULL,
  mime_type       TEXT          NOT NULL,
  width           INTEGER,
  height          INTEGER,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  collection_id   UUID          REFERENCES collections(id)  ON DELETE SET NULL,
  user_id         UUID          NOT NULL REFERENCES users(id)  ON DELETE CASCADE
);

-- Down Migration
DROP TABLE assets;