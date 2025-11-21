import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // POST /auth/register
    @Post('/register')
    @HttpCode(HttpStatus.CREATED) // Código 201 en caso de éxito
    async signUp(@Body() registerDto: RegisterDto): Promise<{ message: string }> {
        await this.authService.signUp(registerDto);
        return { message: 'Usuario registrado exitosamente. Ya puedes iniciar sesión.' };
    }

    // POST /auth/login
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }
}