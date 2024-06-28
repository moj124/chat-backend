import { 
  Controller,
  Get,
  Post, 
  Delete, 
  Body
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async signUp(@Body() user: User) {
    return await this.userService.create(user);
  }
}
