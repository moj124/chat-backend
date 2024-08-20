import { 
  Controller,
  Param,
  Get,
  // UseGuards,
  Delete,
  Put,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { ConversationService } from './conversation.service';
// import { AuthGuard } from '../auth/auth.guard';
import ConversationRegister from './conversation.type';

@Controller('conversation')
// @UseGuards(AuthGuard)
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

  @Put('/create')
  async create(@Body() conversation: ConversationRegister) {
    try {
      const checkConversation = await this.conversationService.findOne(conversation);
      if (checkConversation)
        throw new BadRequestException('Conversation already exists');

      const createdConversation = await this.conversationService.create(conversation);
      // if (!isConversation(createdConversation))
      //   throw new BadRequestException('Conversation isn');
      return createdConversation;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/remove/:id')
  async remove(@Param() conversation: Conversation) {
    return await this.conversationService.remove(conversation);
  }
}
