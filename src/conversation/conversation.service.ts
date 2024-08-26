import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Conversations } from './conversation.entity';
import {  Repository } from 'typeorm';
import {  InjectRepository } from '@nestjs/typeorm';
import ConversationRegister from './conversation.type';

@Injectable()
export class ConversationService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Conversations)
    private readonly conversationRepository: Repository<Conversations>,
  ) {}

  async findAll(): Promise<Conversations[]> {
    return await this.conversationRepository.find();
  }

  async findOne(criteria: Partial<Conversations>): Promise<Conversations | null> {
    const conversation = await this.conversationRepository.findOneBy({
      id: criteria?.id,
    });
    if (!conversation) return null;

    return conversation;
  }

  async create({ name, participants }: ConversationRegister) : Promise<Conversations> {
    try {
      const createdConversation: Conversations =
        await this.conversationRepository.create({
          name: name,
          participants: participants.join(','),
          messages: [],
          createdat: new Date(),
          updatedat: new Date(),
          deleteat: null,
        });
      this.logger.log(`Payload being passed: ${JSON.stringify(createdConversation)}`);

        return await this.conversationRepository.save(createdConversation);
    } catch (error) {
      this.logger.error(error.conversation, error.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async update(conversation: Conversations): Promise<Conversations> {
    try {
      await this.conversationRepository.save(conversation);

      return conversation;
    } catch (error) {
      this.logger.error(error.conversation, error.stack);

      throw error;
    }
  }

  async remove(criteria: Partial<Conversations>): Promise<void> {
    const conversation = await this.findOne(criteria);
    try {
      if (!conversation) throw new BadRequestException('Conversations not found');

      await this.conversationRepository.remove(conversation);

    } catch (error) {
      this.logger.error(error.conversation, error.stack);

      throw error;
    }
  }
}
