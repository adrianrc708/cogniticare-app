import { Controller, Get, Post, Body, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EvaluationsService } from './evaluations.service';

@Controller('evaluations')
@UseGuards(AuthGuard('jwt'))
export class EvaluationsController {
    constructor(private evaluationsService: EvaluationsService) {}

    @Get('questions')
    async getQuestions(@Request() req: any) {
        // Pasamos el ID del paciente para validar si ya jugó
        return this.evaluationsService.getRandomQuestions(req.user.id, 10);
    }

    @Post('submit')
    async submitEvaluation(@Request() req: any, @Body() body: { score: number; total: number }) {
        return this.evaluationsService.saveResult(req.user.id, body.score, body.total);
    }

    // Endpoint para el Paciente (su mes actual)
    @Get('history/me/monthly')
    async getMyMonthlyHistory(@Request() req: any) {
        return this.evaluationsService.getMonthlyHistory(req.user.id);
    }

    // Endpoint para el Cuidador (historial completo de un paciente específico)
    @Get('history/caregiver/:patientId')
    async getPatientFullHistory(@Param('patientId', ParseIntPipe) patientId: number, @Request() req: any) {
        // Aquí podrías añadir una validación extra para asegurar que el cuidador
        // realmente está vinculado a este pacienteId, pero por ahora confiamos en el flujo.
        return this.evaluationsService.getAllHistory(patientId);
    }
}