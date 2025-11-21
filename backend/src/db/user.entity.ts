import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    BeforeUpdate,
    OneToMany, // Importar OneToMany
    ManyToMany, // Importar ManyToMany
    JoinTable, // Importar JoinTable
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user-role.enum'; // <-- Importar el nuevo enum

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    // Nuevo campo para el rol
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PATIENT
    })
    role: UserRole;

    // Nuevo campo para el código de vinculación (solo para pacientes)
    @Column({ unique: true, nullable: true })
    patientCode: string;

    // Relación Many-to-Many: Cuidador a Paciente
    @ManyToMany(() => User, user => user.caregivers)
    @JoinTable({
        name: 'caregiver_patient', // Nombre de la tabla de unión
        joinColumn: {
            name: 'caregiverId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'patientId',
            referencedColumnName: 'id',
        },
    })
    patients: User[];

    // Relación Many-to-Many (Inversa): Paciente a Cuidador
    @ManyToMany(() => User, user => user.patients)
    caregivers: User[];

    // ... (Mantener las funciones BeforeInsert/BeforeUpdate para hashing)
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}