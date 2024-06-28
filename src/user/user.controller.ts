import { 
  Controller,
  Post, 
  Body,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserGuard } from './user.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @UseGuards(UserGuard)
  async signUp(@Body() user: User) {
    return await this.userService.create(user);
  }
}
