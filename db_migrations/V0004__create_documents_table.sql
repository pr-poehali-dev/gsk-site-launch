CREATE TABLE t_p1160872_gsk_site_launch.documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Прочее',
    file_url TEXT NOT NULL,
    file_size VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT NOW()
);