import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { Conversations } from './conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from '../auth/auth.module';
import { ConversationController } from './conversation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Conversations])],
  providers: [ConversationService],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
