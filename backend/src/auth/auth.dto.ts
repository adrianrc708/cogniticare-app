import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// Estructura usada tanto para login como para registro
export class AuthCredentialsDto {
    @IsString({ message: 'El correo debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsEmail({}, { message: 'El formato del correo electrónico no es válido.' })
    email: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    password: string;
}

// Estructura específica para el registro de un nuevo usuario
export class RegisterDto extends AuthCredentialsDto {
    @IsString({ message: 'El nombre es obligatorio.' })
    @IsNotEmpty({ message: 'Debes proporcionar un nombre.' })
    name: string;

    // El rol puede ser 'patient' o 'carer'. Usaremos 'patient' por defecto si no se especifica.
    // La validación de este campo es opcional aquí o se hace en el servicio.
}