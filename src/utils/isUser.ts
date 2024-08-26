import { Users } from '../user/user.entity';

const isUser = (user: Users) => {
  return (
    user &&
    typeof user.id === 'number' &&
    typeof user.username === 'string' &&
    typeof user.password === 'string' &&
    typeof user.firstname === 'string' &&
    typeof user.lastname === 'string'
  );
};
export default isUser;
