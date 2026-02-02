import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages(@Query('limit') limit = '200') {
    const parsed = parseInt(limit, 10);
    const safeLimit = Number.isNaN(parsed) ? 200 : Math.min(Math.max(parsed, 1), 1000);
    const messages = await this.chatService.getRecentMessages(safeLimit);

    return {
      messages: messages.map((msg) => ({
        _id: String(msg._id),
        user: msg.user,
        text: msg.text,
        createdAt: msg.createdAt ? msg.createdAt.toISOString() : null,
      })),
    };
  }
}