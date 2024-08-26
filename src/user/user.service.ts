import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegister } from './user.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    try {
      const createdUser: User = await this.userRepository.create(
        {
          ...user,
          createdAt: new Date(),
          updatedAt: new Date(),
          deleteAt: null,
        }
      );
      console.log('createdUser', createdUser);
      return await this.userRepository.save(createdUser);
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async update(user: User): Promise<User> {
    try {
      await this.userRepository.update(user.id, user);
      return user;
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw new InternalServerErrorException(
        'User doesn\'t exist',
      );
    }
  }

  async remove(criteria: Partial<User>): Promise<void> {    
    try {
      if (!criteria) throw new BadRequestException('Invalid user object');

      const user = await this.userRepository.findOneBy(criteria);
      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.delete(user);
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw error;
    }
  }
}
