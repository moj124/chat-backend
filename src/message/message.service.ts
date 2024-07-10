import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Message } from './message.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MessageRegister } from './message.dto';

@Injectable()
export class MessageService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
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
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdMessage: Message =
        await this.messageRepository.create(message);

      await queryRunner.manager.save(createdMessage);

      await queryRunner.commitTransaction();
      return createdMessage;
    } catch (error) {
      this.logger.error(error.message, error.stack);

      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, message: Message): Promise<Message> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Message, id, message);

      await queryRunner.commitTransaction();
      return message;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(criteria: Partial<Message>): Promise<void> {
    const message = await this.findOne(criteria);
    if (!message) throw new BadRequestException('Message not found');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Message, message);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
