import { 
  ConflictException,
  Injectable, 
  InternalServerErrorException,
  Logger, 
  NotFoundException
} from '@nestjs/common';
import { User } from '../entities/user.entity';
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

  async findOne(id: number): Promise<User | null> {
    const user: User = await this.userRepository.findOneBy({ id });
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('User does not exist');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(User, user);
  
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async create(user: Partial<User>): Promise<User> {
    const checkUser = await this.findOne(user.id);
    if (checkUser) {
      throw new ConflictException('User already exists');
    }
    
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const createdUser = await this.userRepository.create(user);
      await queryRunner.manager.save(createdUser)

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
}