import { Controller, Post, Body, Get, Request, UseGuards, HttpException, HttpStatus, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { LinkPatientDto } from './users.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('link-patient')
    async linkPatient(@Body() linkPatientDto: LinkPatientDto, @Request() req: any) {
        const caregiverId = req.user.id;
        const role = req.user.role;

        if (role !== 'caregiver') {
            throw new HttpException('Solo los cuidadores pueden vincular pacientes.', HttpStatus.FORBIDDEN);
        }

        return this.usersService.linkPatient(caregiverId, linkPatientDto);
    }

    // --- NUEVO ENDPOINT ---
    @Delete('patients/:id')
    async unlinkPatient(@Param('id', ParseIntPipe) patientId: number, @Request() req: any) {
        const caregiverId = req.user.id;
        return this.usersService.unlinkPatient(caregiverId, patientId);
    }
    // ----------------------

    @Get('patients')
    async getLinkedPatients(@Request() req: any) {
        const caregiverId = req.user.id;
        return this.usersService.getLinkedPatients(caregiverId);
    }

    @Get('caregivers')
    async getLinkedCaregivers(@Request() req: any) {
        return this.usersService.getLinkedCaregivers(req.user.id);
    }

    @Get('me')
    async getMe(@Request() req: any) {
        return this.usersService.getUserProfile(req.user.id);
    }
}