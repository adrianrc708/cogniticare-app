import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../db/user.entity';

@Entity('evaluation_results')
export class EvaluationResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    score: number;

    @Column()
    totalQuestions: number;

    @Column()
    patientId: number;

    @CreateDateColumn()
    completedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'patientId' })
    patient: User;
}