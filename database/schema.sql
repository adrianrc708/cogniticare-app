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

-- MODIFICADA: Tabla de Recordatorios
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    caregiver_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_time DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Si la alerta sigue vigente (para que suene cada minuto)
    patient_acknowledged BOOLEAN DEFAULT FALSE, -- Si el paciente ya dijo "Soy consciente"
    caregiver_acknowledged BOOLEAN DEFAULT FALSE, -- Si el cuidador ya vio que el paciente respondió
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE
);