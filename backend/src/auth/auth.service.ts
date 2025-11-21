import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    // --- REGISTRO ---
    async signUp(registerDto: RegisterDto): Promise<void> {
        const { name, email, password } = registerDto;

        // 1. Verificar si el usuario ya existe
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('El correo electrónico ya está registrado.');
        }

        // 2. Hashear la contraseña
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear y guardar el nuevo usuario
        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
            role: 'patient', // Por defecto, es un paciente
        });

        try {
            await this.usersRepository.save(user);
        } catch (error) {
            throw new Error('Error al guardar el usuario en la base de datos.');
        }
    }

    // --- LOGIN ---
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = authCredentialsDto;

        // 1. Buscar usuario por email
        const user = await this.usersRepository.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            // 2. Contraseña correcta, generar JWT
            const payload = { email: user.email, sub: user.id, role: user.role };
            const accessToken: string = await this.jwtService.signAsync(payload);

            return { accessToken };
        } else {
            // 3. Email o contraseña incorrectos
            throw new UnauthorizedException('Por favor, verifica tus credenciales.');
        }
    }
}