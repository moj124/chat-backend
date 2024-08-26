import { sign } from 'jsonwebtoken';
import { Users } from '../user/user.entity';

const generateToken = (user: Users) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable not set');
  }

  return sign({ user }, secret, { expiresIn: '15d' });
};
export default generateToken;
