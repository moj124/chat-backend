import { userFixtures, userRegisterFixtures }  from './user.fixture';
import { UserService } from '../user/user.service';

export const loadFixtures = async (userService: UserService) => {
  for (const user of [...userFixtures, ...userRegisterFixtures]) {
    await userService.create(user);
  }
};
