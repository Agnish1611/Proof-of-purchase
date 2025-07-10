import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config/environment';

// jsonwebtoken types: expiresIn?: string | number (see type definition)
// We'll use as any to bypass the type error, since the runtime accepts string like '7d'
export const generateToken = (id: string): string => {
  const options: SignOptions = { expiresIn: config.JWT_EXPIRE as any };
  return jwt.sign(
    { id },
    config.JWT_SECRET as string,
    options
  );
};

export const setTokenCookie = (res: Response, token: string): void => {
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict' as const
  };

  res.cookie('token', token, options);
};

export const clearTokenCookie = (res: Response): void => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict' as const
  });
};