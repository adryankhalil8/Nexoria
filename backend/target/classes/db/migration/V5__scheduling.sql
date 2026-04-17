CREATE TABLE IF NOT EXISTS schedule_settings (
    id BIGINT PRIMARY KEY,
    timezone VARCHAR(64) NOT NULL,
    slot_duration_minutes INT NOT NULL,
    booking_horizon_days INT NOT NULL
);

CREATE TABLE IF NOT EXISTS availability_windows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS scheduled_calls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NULL,
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL,
    website VARCHAR(2048) NULL,
    industry VARCHAR(255) NULL,
    notes VARCHAR(4000) NULL,
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    timezone VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_scheduled_calls_lead FOREIGN KEY (lead_id) REFERENCES leads(id)
);


