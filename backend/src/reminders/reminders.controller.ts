import { Controller, Post, Body, Get, Param, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RemindersService } from './reminders.service';

@Controller('reminders')
@UseGuards(AuthGuard('jwt'))
export class RemindersController {
    constructor(private remindersService: RemindersService) {}

    // Cuidador crea recordatorio
    @Post()
    async create(@Request() req: any, @Body() body: { patientId: number, title: string, description: string, scheduledTime: string }) {
        return this.remindersService.create(
            req.user.id,
            body.patientId,
            body.title,
            body.description,
            new Date(body.scheduledTime)
        );
    }

    // Paciente verifica alertas (Polling)
    @Get('active')
    async checkActiveReminders(@Request() req: any) {
        return this.remindersService.getActiveForPatient(req.user.id);
    }

    // Paciente confirma alerta
    @Patch(':id/acknowledge')
    async acknowledge(@Param('id') id: number) {
        return this.remindersService.acknowledgeByPatient(id);
    }

    // Cuidador ve lista
    @Get('caregiver')
    async getCaregiverReminders(@Request() req: any) {
        return this.remindersService.getForCaregiver(req.user.id);
    }

    // Cuidador elimina
    @Delete(':id')
    async delete(@Param('id') id: number, @Request() req: any) {
        return this.remindersService.delete(req.user.id, id);
    }
}