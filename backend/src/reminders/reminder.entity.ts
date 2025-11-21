import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../db/user.entity';

@Entity('reminders')
export class Reminder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'patient_id' })
    patientId: number;

    @Column({ name: 'caregiver_id' })
    caregiverId: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'scheduled_time' })
    scheduledTime: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'patient_acknowledged', default: false })
    patientAcknowledged: boolean;

    @Column({ name: 'caregiver_acknowledged', default: false })
    caregiverAcknowledged: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'patient_id' })
    patient: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'caregiver_id' })
    caregiver: User;
}