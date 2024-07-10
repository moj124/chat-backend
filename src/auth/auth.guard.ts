import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { verify } from 'jsonwebtoken';
import { User } from '../user/user.entity';

interface RequestUser extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const message = request.body;

    if (!this.validateJWTToken(request)) {
      return false;
    }
    return true;
  }

  async validateJWTToken( request : RequestUser): Promise<boolean> {
      const cookie: string= request.cookies?.['jwt'];

      if (!cookie) return false;
  
      const decoded = verify(cookie, process.env.JWT_SECRET);
  
      if (typeof decoded === 'string' || !decoded?.id) return false;

      const user: User = await this.userService.findOne({ id:decoded.id });
  
      if (!user) return false;
  
      request.user = user;
      return true;
  }  
}