CREATE TYPE user_type as ENUM('admin', 'client');

CREATE TABLE IF NOT EXISTS usr(
    id serial PRIMARY KEY,
    email VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_type,
    name VARCHAR (255),
    social_link VARCHAR (255),
    phone VARCHAR(255)
);

INSERT INTO usr (email, password, role, name)
VALUES ('andreynikolayevv@gmail.com', '$2b$10$QR427e.K9Q2QxSBaqEj96O9LKumR30a5gU2sjz0qjR46IeZmWfCfy','admin', 'Andrii');
