import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  HttpException,
  HttpStatus,
  BadRequestException,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { compareSync } from 'bcrypt';

import { UserService } from './user.service';
import { User } from './user.entity';

import { UserRegister, UserLogin } from './user.dto';
import isUser from '../utils/isUser';
import generateToken from '../utils/generateToken';
import hashPasswordUser from '../utils/hashPasswordUser';
import setCookieJWT from '../utils/setCookieJWT';

@Controller('users')
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

  @Post('/update')
  async update(@Body() user: User) {
    return await this.userService.update(user);
  }

  @Post('/remove')
  @HttpCode(204)
  async remove(@Body() user: User) {
    console.log(user);
    return await this.userService.remove(user);
  }

  @Post('/register')
  async register(
    @Body() user: UserRegister,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const checkUser = await this.userService.findOne(user);
      if (isUser(checkUser))
        throw new BadRequestException('User already exists');

      const hashUser = hashPasswordUser(user);
      const createdUser: User = await this.userService.create(hashUser);

      const token = generateToken(createdUser);
      setCookieJWT(response, token);

      return createdUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/login')
  async login(
    @Body() { username, password }: UserLogin,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const checkUser = await this.userService.findOne({ username });

      if (!isUser(checkUser))
        throw new BadRequestException("User doesn't exists");
      if (!compareSync(password, checkUser.password))
        throw new BadRequestException("Password doesn't match");

      const token = generateToken(checkUser);
      setCookieJWT(response, token);

      return checkUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) response: Response) {
    try {
      response.cookie('jwt', '', { maxAge: 0 });

      return 'Logged out successfully';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
