import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from './user.entity';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.body;

    if (!this.validateUser(user)) {
      throw new BadRequestException('Invalid user object');
    }
    return true;
  }

  validateUser(user: User): boolean {
    return (
      user &&
      typeof user.id === 'number' &&
      typeof user.username === 'string' &&
      typeof user.password === 'string' &&
      typeof user.firstName === 'string' &&
      typeof user.lastName === 'string'
    );
  }
}
