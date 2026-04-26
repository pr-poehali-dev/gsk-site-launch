
CREATE TABLE t_p1160872_gsk_site_launch.member_applications (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100) NOT NULL,
    address_city VARCHAR(200) NOT NULL,
    address_street VARCHAR(300) NOT NULL,
    address_postal VARCHAR(10),
    passport_series VARCHAR(4) NOT NULL,
    passport_number VARCHAR(6) NOT NULL,
    passport_issued VARCHAR(300) NOT NULL,
    passport_date VARCHAR(10) NOT NULL,
    passport_code VARCHAR(10),
    ownership_cert VARCHAR(100) NOT NULL,
    cadastral_number VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
