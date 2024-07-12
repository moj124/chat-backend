import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Conversation } from './conversation.entity';
import {  Repository } from 'typeorm';
import {  InjectRepository } from '@nestjs/typeorm';
import { Message } from '../message/message.entity';

@Injectable()
export class ConversationService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find();
  }

  async findOne(criteria: Partial<Conversation>): Promise<Conversation | null> {
    const conversation = await this.conversationRepository.findOneBy({
      id: criteria?.id,
    });
    if (!conversation) return null;

    return conversation;
  }

  async create({ id, receiverId, senderId }: Message): Promise<Conversation> {
    try {
      const createdConversation: Conversation =
        await this.conversationRepository.create({
          participants: [receiverId, senderId],
          messages: [id],
        });

        return await this.conversationRepository.save(createdConversation);
    } catch (error) {
      this.logger.error(error.conversation, error.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async update(conversation: Conversation): Promise<Conversation> {
    try {
      await this.conversationRepository.save(conversation);

      return conversation;
    } catch (error) {
      this.logger.error(error.conversation, error.stack);

      throw error;
    }
  }

  async remove(criteria: Partial<Conversation>): Promise<void> {
    const conversation = await this.findOne(criteria);
    try {
      if (!conversation) throw new BadRequestException('Conversation not found');

      await this.conversationRepository.remove(conversation);

    } catch (error) {
      this.logger.error(error.conversation, error.stack);

      throw error;
    }
  }
}
