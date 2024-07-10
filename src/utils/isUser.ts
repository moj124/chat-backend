import { User } from '../user/user.entity';

const isUser = (user: User) => {
  return (
    user &&
    typeof user.id === 'number' &&
    typeof user.username === 'string' &&
    typeof user.password === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string'
  );
};
export default isUser;
