import { 
    BadRequestException,
      Injectable, 
      InternalServerErrorException, 
      Logger, 
    } from '@nestjs/common';
    import { Conversation } from './conversation.entity';
    import { DataSource, Repository } from 'typeorm';
    import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
    import { Message } from '../message/message.entity';
    import { MessageRegister } from '../message/message.dto';
    
    @Injectable()
    export class ConversationService {
      private logger = new Logger();
    
      constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
      ) {}
  
      async findAll(): Promise<Conversation[]> {
        return await this.conversationRepository.find();
      }
    
      async findOne(criteria: Partial<Conversation>): Promise<Conversation | null> {
        const conversation = await this.conversationRepository.findOneBy({id: criteria?.id});
        if (!conversation) return null;
        
        return conversation;
      }
    
      async create({ id, receiverId, senderId }: Message): Promise<Conversation> {
        const queryRunner = await this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
          const createdConversation: Conversation = await this.conversationRepository.create({
                participants: [
                    receiverId,
                    senderId,
                ],
                messages: [ id ],
            });
    
          await queryRunner.manager.save(createdConversation);
    
          await queryRunner.commitTransaction();
           
          return createdConversation;
        } catch (error) {
          this.logger.error(error.conversation, error.stack);
    
          await queryRunner.rollbackTransaction();
    
          throw new InternalServerErrorException(
            'Something went wrong, Try again!',
          )
        }
        finally {
          await queryRunner.release();
        }
      }
    
      async update(id: number, conversation: Conversation): Promise<Conversation> {
        const queryRunner = this.dataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
          await queryRunner.manager.update(Conversation, id, conversation);
    
          await queryRunner.commitTransaction();
          return conversation;
        } catch (error) {
          await queryRunner.rollbackTransaction();
    
          throw error;
        } finally {
          await queryRunner.release();
        }
      }
    
      async remove(criteria: Partial<Conversation>): Promise<void> {
        const conversation = await this.findOne(criteria );
        if (!conversation) throw new BadRequestException('Conversation not found');
    
        const queryRunner = this.dataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
          await queryRunner.manager.delete(Conversation, conversation);
    
          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
    
          throw error;
        } finally {
          await queryRunner.release();
        }
      }
    }