import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';

import { Conversation } from './conversation.entity';
import { ConversationService } from './conversation.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('conversation')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/')
  async findAll() {
    return await this.conversationService.findAll();
  }

  @Get('/:id')
  async find(@Param() conversation: Conversation) {
    return await this.conversationService.findOne(conversation);
  }

  @Post('/remove/:id')
  async remove(@Param() conversation: Conversation) {
    return await this.conversationService.remove(conversation);
  }
}
