import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Messages } from './message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRegister } from './message.type';

@Injectable()
export class MessageService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
  ) {}

  async findAll(): Promise<Messages[]> {
    return await this.messageRepository.find();
  }

  async findAllByConversation(criteria : Partial<Messages>): Promise<Messages[]> {
    return await this.messageRepository.findBy(criteria);
  }

  async findOne(criteria: Partial<Messages>): Promise<Messages | null> {
    const message = await this.messageRepository.findOneBy(criteria);
    if (!message) return null;

    return message;
  }

  async create(message: MessageRegister): Promise<Messages> {
    try {
      const createdMessage: Messages =
        await this.messageRepository.create(message);

      return await this.messageRepository.save(createdMessage);
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async update(message: Messages): Promise<Messages> {
  try {
      this.messageRepository.save(message);

      return message;
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw new InternalServerErrorException(
        'Messages doesn\'t exist',
      );
    }
  }

  async remove(criteria: Partial<Messages>): Promise<void> {
    try {
      if (!criteria) throw new BadRequestException('Invalid message object');

      const message = await this.messageRepository.findOneBy(criteria);
      if (!message) throw new NotFoundException('Messages not found');

      await this.messageRepository.delete(message);
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw error;
    }
  }
}
