import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Importar ConfigService
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/user.entity';

@Module({
    imports: [
        ConfigModule,
        // Importa el repositorio User para poder inyectarlo en AuthService
        TypeOrmModule.forFeature([User]),
        UsersModule,

        // CAMBIO AQUÍ: Usar registerAsync para cargar JWT_SECRET
        JwtModule.registerAsync({
            imports: [ConfigModule], // Importar ConfigModule para usar ConfigService
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET'), // Obtener valor del servicio
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION_TIME') || '3600s' },
            }),
            inject: [ConfigService], // Inyectar ConfigService
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}