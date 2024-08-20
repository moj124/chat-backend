import { Response } from 'express';
import { config } from 'dotenv';
config();

const setCookieJWT = (response: Response, token: string) => {
  const maxAge = 15 * 24 * 60 * 60 * 1000;

  response.cookie('jwt', token, {
    maxAge,
    httpOnly: true,
    sameSite: 'lax',
    path:'/',
    secure: process.env.NODE_ENV !== 'development',
  });
};
export default setCookieJWT;
