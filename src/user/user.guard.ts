import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Users } from './user.entity';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: Users = request.body;

    if (!this.validateUser(user)) {
      throw new BadRequestException('Invalid user object');
    }
    return true;
  }

  validateUser(user: Users): boolean {
    return (
      user &&
      typeof user.id === 'number' &&
      typeof user.username === 'string' &&
      typeof user.password === 'string' &&
      typeof user.firstname === 'string' &&
      typeof user.lastname === 'string'
    );
  }
}
