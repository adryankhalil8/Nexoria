-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Blueprint table
CREATE TABLE IF NOT EXISTS blueprints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(2048) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    revenue_range VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    ready_for_retainer BOOLEAN NOT NULL,
    windspeed DOUBLE,
    weathercode INT,
    temperature DOUBLE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NULL
);

-- Blueprint goals collection
CREATE TABLE IF NOT EXISTS blueprint_goals (
    blueprint_id BIGINT NOT NULL,
    goal VARCHAR(1024) NOT NULL,
    CONSTRAINT fk_blueprint_goals_blueprint FOREIGN KEY (blueprint_id) REFERENCES blueprints(id) ON DELETE CASCADE
);

-- Blueprint fixes collection
CREATE TABLE IF NOT EXISTS blueprint_fixes (
    blueprint_id BIGINT NOT NULL,
    title VARCHAR(1024),
    impact VARCHAR(1024),
    effort VARCHAR(1024),
    why VARCHAR(2048),
    CONSTRAINT fk_blueprint_fixes_blueprint FOREIGN KEY (blueprint_id) REFERENCES blueprints(id) ON DELETE CASCADE
);
