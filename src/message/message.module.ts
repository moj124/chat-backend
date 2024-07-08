import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { UserModule } from "../user/user.module";
import { MessageGuard } from "./message.guard";

@Module({
    imports: [TypeOrmModule.forFeature([Message]), UserModule],
    providers: [MessageService, MessageGuard],
    controllers: [MessageController],
})
export class MessageModule {}