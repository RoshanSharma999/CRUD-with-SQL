-- "C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p
-- or just use mysql -u root -p, after setting the bin path of MySQL to environment variables
-- "system cls" in sql to clear command line log 
-- to bypass on powershell for using "nodemon" command: Set-ExecutionPolicy Bypass -Scope Process

USE delta_app;
CREATE TABLE user(
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL
);
