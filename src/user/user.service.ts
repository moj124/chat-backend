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
import { UserRegister } from './user.dto';

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

  async findOne(criteria: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy(criteria);
    if (!user) return null;
    
    return user;
  }

  async create(user: UserRegister): Promise<User> {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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

  async remove(criteria: Partial<User>): Promise<void> {
    const user = await this.findOne(criteria );
    if (!user) throw new BadRequestException('User not found');

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