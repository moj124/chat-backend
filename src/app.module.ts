import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from './user/user.entity';
import { Message } from './message/message.entity';
import { Conversation } from './conversation/conversation.entity';

config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, NODE_ENV } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USER,
      password: DB_PASSWORD,
      synchronize: NODE_ENV === 'development',
      logging: NODE_ENV === 'development',
      dropSchema: NODE_ENV === 'development',
      entities: [User, Message, Conversation],
    }),
    UserModule,
    ChatModule,
    MessageModule,
    ConversationModule,
    AuthModule,
  ],
})
export class AppModule {}
