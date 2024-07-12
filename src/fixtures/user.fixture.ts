import { UserRegister } from '../user/user.dto';
import { User } from '../user/user.entity';

export const userRegisterFixtures: UserRegister[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'john.doe@example.com',
    password: 'securepassword', 
  },
  {
    firstName: 'James',
    lastName: 'Reid',
    username: 'james.reid@example.com',
    password: 'securepassword',
  },
];

export const userFixtures: User[] = [
  {
    id: 10,
    firstName: 'Johnny',
    lastName: 'Gray',
    username: 'johnny.gray@example.com',
    password: 'securepassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    deleteAt: null
  },
  {
    id: 11,
    firstName: 'Casper',
    lastName: 'Jones',
    username: 'casper.jones@example.com',
    password: 'securepassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    deleteAt: null
  },
];



