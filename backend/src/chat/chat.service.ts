import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    async sendMessage(senderId: number, receiverId: number, content: string) {
        const msg = this.messageRepository.create({ senderId, receiverId, content });
        return this.messageRepository.save(msg);
    }

    async getConversation(user1: number, user2: number) {
        return this.messageRepository.find({
            where: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ],
            order: { createdAt: 'ASC' }
        });
    }
}