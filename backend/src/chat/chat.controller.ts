import { Controller, Post, Get, Body, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post()
    async sendMessage(@Request() req: any, @Body() body: { receiverId: number, content: string }) {
        return this.chatService.sendMessage(req.user.id, body.receiverId, body.content);
    }

    @Get()
    async getMessages(@Request() req: any, @Query('contactId', ParseIntPipe) contactId: number) {
        return this.chatService.getConversation(req.user.id, contactId);
    }
}