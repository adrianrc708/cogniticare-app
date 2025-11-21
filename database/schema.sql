-- Creación de la base de datos si no existe
CREATE DATABASE IF NOT EXISTS cogniticare_db;
USE cogniticare_db;

-- Tabla de Usuarios (Pacientes y Cuidadores)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- La contraseña DEBE ser hasheada
    role ENUM('patient', 'carer') NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Recordatorios (Relacionado con Cuidadores y/o Pacientes)
CREATE TABLE reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_time DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);