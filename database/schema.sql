-- Creación de la base de datos si no existe
CREATE DATABASE IF NOT EXISTS cogniticare_db;
USE cogniticare_db;

-- Tabla de Usuarios (Pacientes y Cuidadores)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    -- CORREGIDO: Cambiado 'carer' por 'caregiver' para coincidir con el código
    role ENUM('patient', 'caregiver') NOT NULL DEFAULT 'patient', 
    patientCode VARCHAR(255) UNIQUE NULL,
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