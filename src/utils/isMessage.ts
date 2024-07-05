import { IsNull } from "typeorm";
import { Message } from "../message/message.entity";

const isUser = (message: Message) =>  {
    return (
        message && 
        typeof message.id === 'number' && 
        typeof message.message === 'string' &&
        typeof message.receiverId === 'number' &&
        typeof message.senderId === 'number' &&
        Object.prototype.toString.call(message.createdAt) === '[object Date]' &&
        Object.prototype.toString.call(message.updatedAt) === '[object Date]' &&
        (
            Object.prototype.toString.call(message.deleteAt) === '[object Date]' ||
            message.deleteAt === null
        )
    );
}
export default isUser;
