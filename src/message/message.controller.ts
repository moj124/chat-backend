import { 
  Controller,
  Post, 
  Param,
  Get,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { MessageService } from './message.service';
import { Message } from './message.entity';
import { MessageRegister } from './message.dto';
import isMessage from '../utils/isMessage';
import { MessageGuard } from './message.guard';
  
  @Controller('messages')
  @UseGuards(MessageGuard)
  export class MessageController {
    constructor(private readonly messageService: MessageService) {}
  
    @Get('/')
    async findAll() {
      return await this.messageService.findAll();
    }
  
    @Get('/:id')
    async find(@Param() message: Message) {
      return await this.messageService.findOne(message);
    }
  
    @Post('/send')
    async send(message: MessageRegister) {
      try{
        const checkMessage = await this.messageService.findOne(message);
        if (isMessage(checkMessage)) throw new BadRequestException('Message already exists');
  
        const createdMessage: Message = await this.messageService.create(message);
  
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
  