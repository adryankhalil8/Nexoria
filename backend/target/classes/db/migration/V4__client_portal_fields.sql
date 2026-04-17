ALTER TABLE blueprints
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'DRAFT';

ALTER TABLE blueprints
    ADD COLUMN IF NOT EXISTS purchase_event_type VARCHAR(50) NOT NULL DEFAULT 'DEPOSIT';

UPDATE blueprints
SET status = 'APPROVED'
WHERE status IS NULL OR status = '' OR status = 'DRAFT';

UPDATE blueprints
SET purchase_event_type = CASE
    WHEN industry = 'E-commerce' THEN 'PURCHASE'
    WHEN industry IN ('Remodeling', 'Real Estate') THEN 'BOOKED_JOB'
    ELSE 'DEPOSIT'
END
WHERE purchase_event_type IS NULL OR purchase_event_type = '' OR purchase_event_type = 'DEPOSIT';

ALTER TABLE blueprint_fixes
    ADD COLUMN IF NOT EXISTS owner VARCHAR(50) NOT NULL DEFAULT 'NEXORIA';

ALTER TABLE blueprint_fixes
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED';

ALTER TABLE blueprint_fixes
    ADD COLUMN IF NOT EXISTS client_visible BOOLEAN NOT NULL DEFAULT TRUE;
