import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { RemindersModule } from './reminders/reminders.module'; // IMPORTAR
import { User } from './db/user.entity';
import { Question } from './evaluations/question.entity';
import { EvaluationResult } from './evaluations/evaluation-result.entity';
import { Reminder } from './reminders/reminder.entity'; // IMPORTAR

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
            entities: [User, Question, EvaluationResult, Reminder], // AÑADIR AQUÍ
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
        EvaluationsModule,
        RemindersModule, // AÑADIR AQUÍ
    ],
})
export class AppModule {}