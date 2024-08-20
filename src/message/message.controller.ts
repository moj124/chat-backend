import {
  Controller,
  Param,
  Get,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseGuards,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { MessageService } from './message.service';
import { Message } from './message.entity';
import { MessageRegister } from './message.type';
// import { AuthGuard } from '../auth/auth.guard';
import isMessage from '../utils/isMessage';

@Controller('messages')
// @UseGuards(AuthGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @Get('/')
  async findAll() {
    return await this.messageService.findAll();
  }

  @Get('/:id')
  async find(@Param() message: Message) {
    return await this.messageService.findOne(message);
  }

  @Put('/create')
  async create(@Body() message: MessageRegister) {
    try {
      const checkMessage = await this.messageService.findOne(message);
      if (isMessage(checkMessage))
        throw new BadRequestException('Message already exists');

      const createdMessage: Message = await this.messageService.create(message);
      if (!isMessage(createdMessage))
        throw new BadRequestException('Message already exists');

      return createdMessage;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/remove/:id')
  async remove(@Param() message: Message) {
    return await this.messageService.remove(message);
  }
}
