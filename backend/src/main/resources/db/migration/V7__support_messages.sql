CREATE TABLE IF NOT EXISTS support_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_user_id BIGINT NULL,
    client_email VARCHAR(320) NOT NULL,
    business_name VARCHAR(255) NULL,
    sender VARCHAR(50) NOT NULL,
    body VARCHAR(4000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_support_messages_client_user FOREIGN KEY (client_user_id) REFERENCES users(id)
);
