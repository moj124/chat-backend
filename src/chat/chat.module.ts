import { Module } from '@nestjs/common';
import { ChatGateway } from '../chat/chat.gateway';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [ConversationModule, MessageModule],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule {}
