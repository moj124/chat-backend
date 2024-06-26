import { Module } from '@nestjs/common';
import { TypeOrmModule } from './typeorm.module';
import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule, UserModule],
})
export class AppModule {}
