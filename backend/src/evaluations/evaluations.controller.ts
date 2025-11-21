import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EvaluationsService } from './evaluations.service';

@Controller('evaluations')
@UseGuards(AuthGuard('jwt'))
export class EvaluationsController {
    constructor(private evaluationsService: EvaluationsService) {}

    @Get('questions')
    async getQuestions() {
        return this.evaluationsService.getRandomQuestions(5);
    }

    @Post('submit')
    async submitEvaluation(@Request() req: any, @Body() body: { score: number; total: number }) {
        return this.evaluationsService.saveResult(req.user.id, body.score, body.total);
    }

    @Get('history')
    async getHistory(@Request() req: any) {
        return this.evaluationsService.getPatientHistory(req.user.id);
    }
}