import { Controller, Post, Body, Get, Param, UseGuards, Request, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RemindersService } from './reminders.service';

@Controller('reminders')
@UseGuards(AuthGuard('jwt'))
export class RemindersController {
    constructor(private remindersService: RemindersService) {}

    @Post()
    async create(@Request() req: any, @Body() body: { patientId: number, title: string, description: string, scheduledTime: string }) {
        const scheduledDate = new Date(body.scheduledTime);
        const now = new Date();

        // VALIDACIÓN DE FECHA (con margen de 1 min por latencia)
        if (scheduledDate.getTime() < (now.getTime() - 60000)) {
            throw new HttpException('No puedes programar recordatorios en el pasado.', HttpStatus.BAD_REQUEST);
        }

        return this.remindersService.create(
            req.user.id,
            body.patientId,
            body.title,
            body.description,
            scheduledDate
        );
    }

    @Get('active')
    async checkActiveReminders(@Request() req: any) {
        return this.remindersService.getActiveForPatient(req.user.id);
    }

    @Patch(':id/acknowledge')
    async acknowledge(@Param('id') id: number) {
        return this.remindersService.acknowledgeByPatient(id);
    }

    @Get('caregiver')
    async getCaregiverReminders(@Request() req: any) {
        return this.remindersService.getForCaregiver(req.user.id);
    }

    @Delete(':id')
    async delete(@Param('id') id: number, @Request() req: any) {
        return this.remindersService.delete(req.user.id, id);
    }
}