import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegister } from './user.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  async findOne(criteria: Partial<Users>): Promise<Users | null> {
    const user = await this.userRepository.findOneBy(criteria);
    if (!user) return null;

    return user;
  }

  async create(user: UserRegister): Promise<Users> {
    try {
      const createdUser: Users = await this.userRepository.create(
        {
          ...user,
          createdat: new Date(),
          updatedat: new Date(),
          deleteat: null,
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

  async update(user: Users): Promise<Users> {
    try {
      await this.userRepository.update(user.id, user);
      return user;
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw new InternalServerErrorException(
        'Users doesn\'t exist',
      );
    }
  }

  async remove(criteria: Partial<Users>): Promise<void> {    
    try {
      if (!criteria) throw new BadRequestException('Invalid user object');

      const user = await this.userRepository.findOneBy(criteria);
      if (!user) throw new NotFoundException('Users not found');

      await this.userRepository.delete(user);
    } catch (error) {
      this.logger.error(error.message, error.stack);

      throw error;
    }
  }
}
