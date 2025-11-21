import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reminder } from './reminder.entity';

@Injectable()
export class RemindersService {
    constructor(
        @InjectRepository(Reminder)
        private reminderRepository: Repository<Reminder>,
    ) {}

    // Crear recordatorio (Cuidador)
    async create(caregiverId: number, patientId: number, title: string, description: string, scheduledTime: Date) {
        const reminder = this.reminderRepository.create({
            caregiverId,
            patientId,
            title,
            description,
            scheduledTime,
            isActive: true,
            patientAcknowledged: false
        });
        return this.reminderRepository.save(reminder);
    }

    // Obtener recordatorios activos para el paciente (Polling)
    // Busca alertas cuya hora ya pasó o es ahora, y que NO han sido confirmadas por el paciente
    async getActiveForPatient(patientId: number) {
        const now = new Date();
        // Buscamos alertas programadas para AHORA o antes (hasta 10 mins antes, por ejemplo, o indefinido hasta que confirme)
        // Tu regla: "debe salir cada minuto durante 10 minutos".
        // Simplificación robusta: Sigue saliendo hasta que el paciente confirme o pase mucho tiempo (ej. 1 hora).
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        return this.reminderRepository.find({
            where: {
                patientId,
                isActive: true,
                patientAcknowledged: false,
                scheduledTime: LessThanOrEqual(now), // Ya es hora
                // scheduledTime: MoreThanOrEqual(oneHourAgo) // Opcional: Para que no salgan alertas muy viejas
            },
            order: { scheduledTime: 'ASC' }
        });
    }

    // Confirmar alerta (Paciente)
    async acknowledgeByPatient(reminderId: number) {
        const reminder = await this.reminderRepository.findOne({ where: { id: reminderId } });
        if (!reminder) throw new NotFoundException('Recordatorio no encontrado');

        reminder.patientAcknowledged = true;
        reminder.isActive = false; // Ya no necesita sonar
        return this.reminderRepository.save(reminder);
    }

    // Obtener lista para el cuidador (ver estados)
    async getForCaregiver(caregiverId: number) {
        return this.reminderRepository.find({
            where: { caregiverId },
            relations: ['patient'],
            order: { scheduledTime: 'DESC' }
        });
    }

    // Eliminar/Archivar (Cuidador) - Solo si el paciente ya confirmó o si se decide forzar
    async delete(caregiverId: number, reminderId: number) {
        return this.reminderRepository.delete({ id: reminderId, caregiverId });
    }
}