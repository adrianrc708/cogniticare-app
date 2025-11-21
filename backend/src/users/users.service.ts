// backend/src/users/users.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/user.entity';
import { LinkPatientDto, PatientLinkResponse } from './users.dto';
import { UserRole } from '../db/user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findPatientByCode(patientCode: string): Promise<User> {
        return this.userRepository.findOne({
            where: { patientCode, role: UserRole.PATIENT }
        });
    }

    async linkPatient(caregiverId: number, linkPatientDto: LinkPatientDto): Promise<PatientLinkResponse> {
        const patient = await this.findPatientByCode(linkPatientDto.patientCode);

        if (!patient) {
            throw new HttpException('Código de paciente no válido o no encontrado.', HttpStatus.NOT_FOUND);
        }

        const caregiver = await this.userRepository.findOne({
            where: { id: caregiverId, role: UserRole.CAREGIVER },
            relations: ['patients'],
        });

        if (!caregiver) {
            throw new HttpException('Cuidador no encontrado.', HttpStatus.UNAUTHORIZED);
        }

        if (caregiver.patients && caregiver.patients.some(p => p.id === patient.id)) {
            throw new HttpException('Este paciente ya está vinculado a tu cuenta.', HttpStatus.CONFLICT);
        }

        if (!caregiver.patients) {
            caregiver.patients = [];
        }
        caregiver.patients.push(patient);
        await this.userRepository.save(caregiver);

        return {
            patientId: patient.id,
            patientName: patient.name,
        };
    }

    async getLinkedPatients(caregiverId: number): Promise<User[]> {
        const caregiver = await this.userRepository.findOne({
            where: { id: caregiverId, role: UserRole.CAREGIVER },
            relations: ['patients'],
        });

        if (!caregiver) {
            throw new HttpException('Cuidador no encontrado.', HttpStatus.NOT_FOUND);
        }

        return caregiver.patients.map(p => ({
            id: p.id,
            name: p.name,
            patientCode: p.patientCode,
            role: p.role,
            email: p.email,
        } as User));
    }

    async getUserProfile(userId: number): Promise<User> {
        return this.userRepository.findOne({
            where: { id: userId }
        });
    }
}