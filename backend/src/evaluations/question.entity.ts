import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    questionText: string;

    @Column()
    option1: string;

    @Column()
    option2: string;

    @Column()
    option3: string;

    @Column()
    option4: string;

    @Column()
    correctOption: number;

    @Column({ default: 'general' })
    category: string;
}