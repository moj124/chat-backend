import { 
  Controller,
  Post, 
  Body,
  UseGuards,
  Param,
  Get,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { hashSync } from "bcrypt";

import { UserService } from './user.service';
import { User } from './user.entity';
import { UserGuard } from './user.guard';
import { UserRegister } from '../utils/types';

@Controller('user')
@UseGuards(UserGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('/:id')
  async find(@Param() user: User) {
    return await this.userService.findOne(user);
  }

  @Post('/:id/update')
  async update(@Param() param: any, user: User) {
    return await this.userService.update(param.id, user);
  }

  @Post('/create')
  async create(@Body() user: User) {
    return await this.userService.create(user);
  }

  @Post('/:id/remove')
  async remove(@Param() user: User) {
    return await this.userService.remove(user.id);
  }

  @Get('/register')
  async register(@Body() user: UserRegister) {
    try{
      const checkUser: User = await this.userService.findOne(user);
  
      if (checkUser) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
  
      const hash: string = await hashSync(user.password, 10);
  
      const hashPasswordUser: UserRegister = {
        ...user,
        password: hash
      };
  
      await this.userService.create(hashPasswordUser);
    } catch (error) {
      throw error;
    }
  }
}
