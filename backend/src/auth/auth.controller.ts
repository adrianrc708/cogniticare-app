import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
// Cambiar AuthCredentialsDto por LoginDto
import { RegisterDto, LoginDto } from './auth.dto'; // <-- DTOs corregidos

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // POST /auth/register
    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    // El método ahora es register en el servicio
    async signUp(@Body() registerDto: RegisterDto): Promise<{ token: string, user: any }> {
        return this.authService.register(registerDto); // <-- Método corregido (register)
    }

    // POST /auth/login
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    // El DTO ahora es LoginDto y el método es login en el servicio
    async signIn(@Body() loginDto: LoginDto): Promise<{ token: string, user: any }> {
        return this.authService.login(loginDto); // <-- Método corregido (login)
    }
}