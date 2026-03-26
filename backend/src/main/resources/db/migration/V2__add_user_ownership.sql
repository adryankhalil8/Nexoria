-- Add user ownership to blueprints
ALTER TABLE blueprints ADD COLUMN user_id BIGINT NOT NULL;
ALTER TABLE blueprints ADD CONSTRAINT fk_blueprints_user FOREIGN KEY (user_id) REFERENCES users(id);