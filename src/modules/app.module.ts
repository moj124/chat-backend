import { Module } from '@nestjs/common';
import { DatabaseModule } from './typeorm.module';
import { UserModule } from './user.module';
import { ChatModule } from './chat.module';

@Module({
  imports: [DatabaseModule, UserModule, ChatModule],
})
export class AppModule {}
