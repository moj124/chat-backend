import { Conversations } from "./conversation.entity";

type ConversationRegister = Omit<Conversations, 'id' | 'createdat' | 'deleteat' | 'updatedat'>;
export default ConversationRegister;