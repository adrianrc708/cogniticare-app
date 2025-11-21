import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [], // Aquí irán los UsersService
    exports: [TypeOrmModule], // Exporta la entidad para ser usada en AuthModule
})
export class UsersModule {}