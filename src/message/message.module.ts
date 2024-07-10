import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { UserModule } from "../user/user.module";
import { ConversationModule } from "../conversation/conversation.module";

@Module({
    imports: [TypeOrmModule.forFeature([Message]), UserModule, ConversationModule],
    providers: [MessageService],
    controllers: [MessageController],
})
export class MessageModule {}