import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationsService } from './evaluations.service';
import { Question } from './question.entity';
import { EvaluationResult } from './evaluation-result.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Question, EvaluationResult])],
    controllers: [EvaluationsController],
    providers: [EvaluationsService],
})
export class EvaluationsModule {}