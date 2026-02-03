import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages() {
    // On utilise la fonction qui existe vraiment dans ton service
    const messages = await this.chatService.getAllMessages();

    return {
      messages: messages.map((msg) => ({
        _id: String(msg._id),
        user: msg.user,
        text: msg.text,
        createdAt: msg.createdAt ? msg.createdAt.toISOString() : new Date().toISOString(),
      })),
    };
  }
}