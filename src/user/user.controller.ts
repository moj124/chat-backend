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
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserGuard } from './user.guard';

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
    if(!user || !user.id) throw new HttpException('userController.find invalid user object', HttpStatus.BAD_REQUEST);  

    return await this.userService.findOne(user.id);
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
}
