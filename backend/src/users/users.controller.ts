import { Controller, Post, Body, Get, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { LinkPatientDto } from './users.dto';
import { AuthGuard } from '@nestjs/passport'; // El guardia estándar de NestJS/Passport

@Controller('users')
@UseGuards(AuthGuard('jwt')) // <-- PROTEGE TODAS LAS RUTAS DE ESTE CONTROLADOR
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('link-patient')
    async linkPatient(@Body() linkPatientDto: LinkPatientDto, @Request() req: any) {
        // req.user viene del JwtStrategy que creamos arriba
        const caregiverId = req.user.id;
        const role = req.user.role;

        if (role !== 'caregiver') {
            throw new HttpException('Solo los cuidadores pueden vincular pacientes.', HttpStatus.FORBIDDEN);
        }

        return this.usersService.linkPatient(caregiverId, linkPatientDto);
    }

    @Get('patients')
    async getLinkedPatients(@Request() req: any) {
        const caregiverId = req.user.id;
        return this.usersService.getLinkedPatients(caregiverId);
    }

    // Nueva ruta para que el paciente vea su propio perfil y código
    @Get('me')
    async getMe(@Request() req: any) {
        // Retornamos info básica del usuario logueado
        return this.usersService.getUserProfile(req.user.id);
    }
}