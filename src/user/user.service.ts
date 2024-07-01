import { 
  BadRequestException,
  ConflictException,
  Injectable, 
  InternalServerErrorException,
  Logger, 
  NotFoundException
} from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('UserService.findOne User not found');
    }
    return user;
  }

  async create(user: User): Promise<User> {
    await this.findOne(user.id);
    
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const createdUser: User = await this.userRepository.create(user);

      await queryRunner.manager.save(createdUser);

      await queryRunner.commitTransaction();
      return createdUser;
    } catch (error) {
      this.logger.error(error.message, error.stack);

      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      )
    }
    finally {
      await queryRunner.release();
    }
  }

  async update(id: number, user: User): Promise<User> {
    await this.findOne(id);
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, id, user);

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(User, user);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}