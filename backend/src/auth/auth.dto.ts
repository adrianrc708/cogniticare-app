import { IsNotEmpty, IsEmail, MinLength, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../db/user-role.enum'; // <-- Importar el enum

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    // Campo de Rol (caregiver o patient)
    @IsNotEmpty()
    @IsEnum(UserRole, { message: 'El rol debe ser paciente o cuidador.' })
    role: UserRole;

    // Campo opcional para que el cuidador vincule al paciente durante el registro
    @IsOptional()
    @IsString()
    patientCodeToLink?: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}