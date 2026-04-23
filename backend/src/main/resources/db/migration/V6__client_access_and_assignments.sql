ALTER TABLE leads
    ADD COLUMN user_id BIGINT NULL;

ALTER TABLE leads
    ADD CONSTRAINT fk_leads_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE blueprints
    ADD COLUMN client_email VARCHAR(320) NULL;
