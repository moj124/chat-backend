import { hashSync } from 'bcrypt';
import { UserRegister } from '../user/user.dto';

const hashPasswordUser = ({
  username,
  password,
  firstname,
  lastname,
}: UserRegister): UserRegister => {
  const hash: string = hashSync(password, 10);
  return {
    username,
    password: hash,
    firstname,
    lastname,
  };
};
export default hashPasswordUser;
