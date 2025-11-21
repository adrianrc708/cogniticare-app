// backend/src/users/users.controller.ts
import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { LinkPatientDto } from './users.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('link-patient')
    async linkPatient(@Body() linkPatientDto: LinkPatientDto, @Request() req: any) {
        // ID 1 es temporal para pruebas
        const caregiverId = 1;
        return this.usersService.linkPatient(caregiverId, linkPatientDto);
    }

    @Get('patients')
    async getLinkedPatients(@Request() req: any) {
        const caregiverId = 1;
        return this.usersService.getLinkedPatients(caregiverId);
    }
}