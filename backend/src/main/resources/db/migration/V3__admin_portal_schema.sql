ALTER TABLE users
    ADD COLUMN username VARCHAR(32) NULL;

ALTER TABLE users
    ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE';

UPDATE users
SET username = CASE
    WHEN email IS NOT NULL THEN LEFT(REPLACE(REPLACE(email, '@', '_at_'), '.', '_'), 32)
    ELSE 'user'
END
WHERE username IS NULL OR username = '';

ALTER TABLE users
    ADD CONSTRAINT uq_users_username UNIQUE (username);

CREATE TABLE IF NOT EXISTS leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,
    website VARCHAR(2048),
    industry VARCHAR(255),
    notes VARCHAR(4000),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
