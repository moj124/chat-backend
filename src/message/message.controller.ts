import { 
  Controller,
  Post, 
  Param,
  Get,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common';

import { MessageService } from './message.service';
import { Message } from './message.entity';
import { MessageRegister } from './message.dto';
import { Conversation } from '../conversation/conversation.entity';
import { ConversationService } from '../conversation/conversation.service';
import { AuthGuard } from '../auth/auth.guard';
import isMessage from '../utils/isMessage';
  
  @Controller('messages')
  @UseGuards(AuthGuard)
  export class MessageController {
    constructor(
      private readonly messageService: MessageService,
      private readonly conversationService: ConversationService,
    ) {}
  
    @Get('/')
    async findAll() {
      return await this.messageService.findAll();
    }
  
    @Get('/:id')
    async find(@Param() message: Message) {
      return await this.messageService.findOne(message);
    }
  
    @Post('/send')
    async send(@Body() message: MessageRegister) {
      try{
        const checkMessage = await this.messageService.findOne(message);
        if (isMessage(checkMessage)) throw new BadRequestException('Message already exists');

        const createdMessage: Message = await this.messageService.create(message);
        if (!isMessage(createdMessage)) throw new BadRequestException('Message already exists');

        
        let checkConversation: Conversation = await this.conversationService.findOne({participants: [message.receiverId, message.senderId]});
        if(!checkConversation) checkConversation = await this.conversationService.create(createdMessage);
        
        return createdMessage;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    @Post('/remove/:id')
    async remove(@Param() message: Message) {
      return await this.messageService.remove(message);
    }
  }
  