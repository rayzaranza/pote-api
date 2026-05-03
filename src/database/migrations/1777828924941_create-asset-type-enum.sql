-- Up Migration
CREATE TYPE asset_type AS ENUM ('video', 'image', '3d', 'document');

-- Down Migration
DROP TYPE asset_type;
