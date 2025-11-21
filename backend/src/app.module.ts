import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './db/user.entity';

@Module({
    imports: [
        // Carga variables de entorno
        ConfigModule.forRoot({ isGlobal: true }),

        // Configuración de Conexión a MySQL
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User], // Registra la entidad User
            synchronize: true, // Sincroniza el esquema automáticamente (¡Solo para desarrollo!)
        }),

        // Módulos de la Aplicación
        UsersModule,
        AuthModule,
        // Aquí irán EvaluacionesModule y RemindersModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}