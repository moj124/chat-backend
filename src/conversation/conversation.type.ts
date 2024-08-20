import { Conversation } from "./conversation.entity";

type ConversationRegister = Omit<Conversation, 'id' | 'createdAt' | 'deleteAt' | 'updatedAt'>;
export default ConversationRegister;