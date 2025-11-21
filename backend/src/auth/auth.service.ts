// backend/src/auth/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './auth.dto';
import { User } from '../db/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../db/user-role.enum';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service'; // <-- CAMBIO AÑADIDO

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private usersService: UsersService, // <-- CAMBIO AÑADIDO
    ) {}

    async register(registerDto: RegisterDto): Promise<{ token: string; user: User }> {
        const { name, email, password, role, patientCodeToLink } = registerDto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new HttpException('El correo electrónico ya está registrado', HttpStatus.CONFLICT);
        }

        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.password = password;
        newUser.role = role;

        if (role === UserRole.PATIENT) {
            newUser.patientCode = uuidv4().substring(0, 8).toUpperCase();
        }

        let savedUser = await this.userRepository.save(newUser);

        if (role === UserRole.CAREGIVER && patientCodeToLink) {
            try {
                await this.usersService.linkPatient(savedUser.id, { patientCode: patientCodeToLink });
            } catch (error) {
                console.warn(`Cuidador ${name} registrado, pero el código de paciente ${patientCodeToLink} no fue válido.`);
            }
        }

        const token = this.jwtService.sign({
            id: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
        });

        delete savedUser.password;

        return { token, user: savedUser };
    }

    async login(loginDto: LoginDto): Promise<{ token: string; user: User }> {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password);

        if (!isPasswordMatching) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        delete user.password;

        return { token, user };
    }
}