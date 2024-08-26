import { Message } from '../message/message.entity';

const isMessage = (message: Message) => {
  return (
    message &&
    typeof message.id === 'number' &&
    typeof message.message === 'string' &&
    typeof message.conversationId === 'number' &&
    typeof message.userId === 'number' &&
    Object.prototype.toString.call(message.createdat) === '[object Date]' &&
    Object.prototype.toString.call(message.updatedat) === '[object Date]' &&
    (Object.prototype.toString.call(message.deleteat) === '[object Date]' ||
      message.deleteat === null)
  );
};
export default isMessage;
