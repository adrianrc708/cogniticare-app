// backend/src/users/users.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class LinkPatientDto {
    @IsNotEmpty({ message: 'El código del paciente es obligatorio.' })
    @IsString({ message: 'El código debe ser una cadena de texto.' })
    patientCode: string;
}

export class PatientLinkResponse {
    @IsNumber()
    patientId: number;

    @IsString()
    patientName: string;
}