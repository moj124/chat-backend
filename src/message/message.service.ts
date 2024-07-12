import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRegister } from './message.dto';

@Injectable()
export class MessageService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findOne(criteria: Partial<Message>): Promise<Message | null> {
    const message = await this.messageRepository.findOneBy(criteria);
    if (!message) return null;

    return message;
  }

  async create(message: MessageRegister): Promise<Message> {
    try {
      const createdMessage: Message =
        await this.messageRepository.create(message);

      return await this.messageRepository.save(createdMessage);
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async update(message: Message): Promise<Message> {
  try {
      this.messageRepository.save(message);

      return message;
    } catch (error) {
      throw error;
    }
  }

  async remove(criteria: Partial<Message>): Promise<void> {
    const message = await this.findOne(criteria);
    if (!message) throw new BadRequestException('Message not found');

    try {
      this.messageRepository.delete(message);
    } catch (error) {
      throw error;
    }
  }
}
