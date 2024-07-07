import { Injectable, CanActivate, ExecutionContext, BadRequestException, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Message } from './message.entity';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { verify } from 'jsonwebtoken';
import { User } from '../user/user.entity';

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const message: Message = request.body;

    if (!this.validateJWTToken(request)) {
      return false;
    }
    return true;
  }

  async validateJWTToken( request : Request): Promise<boolean> {
    try {
      const cookie = request.cookies['jwt'] || null;

      if (!cookie) throw new NotFoundException('No token provided');
  
      const decoded = verify(cookie, process.env.JWT_SECRET);
  
      if (!decoded) throw new BadRequestException('Unauthorized - Invalid Token');
  
      const user = await this.userService.findOne({ id:decoded?.id as number });
  
      if (!user) throw new NotFoundException('User not found');
  
      request.[user] = user;
      return true;
    } catch (error) {
      throw error;
    }
  }  
}