-- Run this script in MySQL to create the database and user for the backend.
-- If you use MySQL Workbench, open a new SQL tab and paste this script.
-- If you use the command line, run: mysql -u root -p < INIT_DATABASE.sql

CREATE DATABASE IF NOT EXISTS sipka_db;

CREATE USER IF NOT EXISTS 'sipka'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON sipka_db.* TO 'sipka'@'localhost';
FLUSH PRIVILEGES;

-- Optional: verify access
USE sipka_db;
SHOW TABLES;
