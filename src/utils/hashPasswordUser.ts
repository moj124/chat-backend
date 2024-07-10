import { hashSync } from 'bcrypt';
import { UserRegister } from '../user/user.dto';

const hashPasswordUser = ({
  username,
  password,
  firstName,
  lastName,
}: UserRegister): UserRegister => {
  const hash: string = hashSync(password, 10);
  return {
    username,
    password: hash,
    firstName,
    lastName,
  };
};
export default hashPasswordUser;
