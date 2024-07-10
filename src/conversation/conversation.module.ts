import { Module } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { Conversation } from "./conversation.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Conversation])],
    providers: [ConversationService],
    controllers: [ConversationController],
})
export class ConversationModule {}