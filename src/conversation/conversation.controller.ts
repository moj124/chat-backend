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
  
  import { Conversation } from './conversation.entity';
  import { ConversationService } from './conversation.service';
    
    @Controller('messages')
    @UseGuards(MessageGuard)
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
    
      @Post('/remove/:id')
      async remove(@Param() message: Message) {
        return await this.messageService.remove(message);
      }
    }
    