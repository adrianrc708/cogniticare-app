import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { EvaluationResult } from './evaluation-result.entity';

@Injectable()
export class EvaluationsService implements OnModuleInit {
    private readonly logger = new Logger(EvaluationsService.name);

    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(EvaluationResult)
        private resultRepository: Repository<EvaluationResult>,
    ) {}

    // Se ejecuta automáticamente al arrancar el backend
    async onModuleInit() {
        await this.seedQuestions();
    }

    async seedQuestions() {
        const count = await this.questionRepository.count();
        if (count > 0) return; // Si ya hay preguntas, no hacemos nada

        this.logger.log('Sembrando preguntas iniciales en la base de datos...');

        const questions = [
            { questionText: '¿En qué año llegó Cristóbal Colón a América?', option1: '1492', option2: '1810', option3: '1900', option4: '1550', correctOption: 1, category: 'historia' },
            { questionText: 'Si tiene 3 manzanas y se come 1, ¿cuántas le quedan?', option1: '0', option2: '1', option3: '2', option4: '3', correctOption: 3, category: 'logica' },
            { questionText: '¿Cuál es el color del cielo en un día despejado?', option1: 'Verde', option2: 'Rojo', option3: 'Azul', option4: 'Amarillo', correctOption: 3, category: 'memoria' },
            { questionText: '¿Qué animal maúlla?', option1: 'El perro', option2: 'El gato', option3: 'La vaca', option4: 'El pájaro', correctOption: 2, category: 'memoria' },
            { questionText: 'Complete la secuencia: 2, 4, 6, 8, ...', option1: '9', option2: '10', option3: '11', option4: '12', correctOption: 2, category: 'logica' },
            { questionText: '¿Quién es conocido como el Libertador?', option1: 'San Martín', option2: 'Simón Bolívar', option3: 'Miguel Grau', option4: 'Pizarro', correctOption: 2, category: 'historia' },
            { questionText: '¿Cuántos días tiene una semana?', option1: '5', option2: '6', option3: '7', option4: '8', correctOption: 3, category: 'memoria' },
            { questionText: '¿Cuál es la capital de Perú?', option1: 'Arequipa', option2: 'Cusco', option3: 'Lima', option4: 'Trujillo', correctOption: 3, category: 'memoria' },
            { questionText: '¿Qué número sigue después del 19?', option1: '18', option2: '20', option3: '21', option4: '30', correctOption: 2, category: 'logica' },
            { questionText: '¿De qué color es el caballo blanco de San Martín?', option1: 'Negro', option2: 'Marrón', option3: 'Blanco', option4: 'Gris', correctOption: 3, category: 'logica' },
        ];

        await this.questionRepository.save(questions);
        this.logger.log('¡Preguntas insertadas correctamente!');
    }

    async getRandomQuestions(limit: number = 5): Promise<Question[]> {
        // Obtiene preguntas aleatorias usando SQL nativo (RAND() para MySQL)
        return this.questionRepository
            .createQueryBuilder('question')
            .orderBy('RAND()')
            .limit(limit)
            .getMany();
    }

    async saveResult(patientId: number, score: number, total: number) {
        const result = this.resultRepository.create({
            patientId,
            score,
            totalQuestions: total
        });
        return this.resultRepository.save(result);
    }

    async getPatientHistory(patientId: number) {
        return this.resultRepository.find({
            where: { patientId },
            order: { completedAt: 'DESC' }
        });
    }
}