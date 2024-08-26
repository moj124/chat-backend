import { Conversation } from "./conversation.entity";

type ConversationRegister = Omit<Conversation, 'id' | 'createdat' | 'deleteat' | 'updatedat'>;
export default ConversationRegister;