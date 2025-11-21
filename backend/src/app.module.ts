import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EvaluationsModule } from './evaluations/evaluations.module'; // IMPORTAR
import { User } from './db/user.entity';
import { Question } from './evaluations/question.entity'; // IMPORTAR
import { EvaluationResult } from './evaluations/evaluation-result.entity'; // IMPORTAR

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User, Question, EvaluationResult], // AÑADIR AQUÍ
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
        EvaluationsModule, // AÑADIR AQUÍ
    ],
})
export class AppModule {}