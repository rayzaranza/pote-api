-- Up Migration
CREATE INDEX assets_user_id_index ON assets(user_id);

-- Down Migration
DROP INDEX assets_user_id_index;