import {
  Controller,
  Param,
  Get,
  BadRequestException,
  HttpException,
  HttpStatus,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { MessageService } from './message.service';
import { Messages } from './message.entity';
import { MessageRegister } from './message.type';
import isMessage from '../utils/isMessage';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @Get('/')
  async findAll() {
    return await this.messageService.findAll();
  }

  @Get('/:id')
  async find(@Param() message: Messages) {
    return await this.messageService.findOne(message);
  }

  @Put('/create')
  async create(@Body() message: MessageRegister) {
    try {
      const checkMessage = await this.messageService.findOne(message);
      if (isMessage(checkMessage))
        throw new BadRequestException('Messages already exists');

      const createdMessage: Messages = await this.messageService.create(message);
      if (!isMessage(createdMessage))
        throw new BadRequestException('Messages already exists');

      return createdMessage;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/remove/:id')
  async remove(@Param() message: Messages) {
    return await this.messageService.remove(message);
  }
}
