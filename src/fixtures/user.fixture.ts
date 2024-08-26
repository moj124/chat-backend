import { UserRegister } from '../user/user.dto';
import { Users } from '../user/user.entity';

export const userRegisterFixtures: UserRegister[] = [
  {
    firstname: 'John',
    lastname: 'Doe',
    username: 'john.doe@example.com',
    password: 'securepassword', 
  },
  {
    firstname: 'James',
    lastname: 'Reid',
    username: 'james.reid@example.com',
    password: 'securepassword',
  },
];

export const userFixtures: Users[] = [
  {
    id: 10,
    firstname: 'Johnny',
    lastname: 'Gray',
    username: 'johnny.gray@example.com',
    password: 'securepassword',
    createdat: new Date(),
    updatedat: new Date(),
    deleteat: null
  },
  {
    id: 11,
    firstname: 'Casper',
    lastname: 'Jones',
    username: 'casper.jones@example.com',
    password: 'securepassword',
    createdat: new Date(),
    updatedat: new Date(),
    deleteat: null
  },
];



