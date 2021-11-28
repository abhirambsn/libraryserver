import * as jwt from 'jsonwebtoken';
import AuthenticatedRequest from '../types/AuthenticatedRequest';
import { Response, NextFunction } from 'express';
import StaffType from '../types/StaffType';

const jwtSecret = process.env.JWT_SECRET || 'TestSecret';

const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(403).send({ message: 'Authorization Header not set.' });
  }
  const token = header?.split(' ')[1];
  if (!token) {
    return res.status(403).send({ message: 'Invalid token' });
  }
  const validate = jwt.verify(token as string, jwtSecret);
  if (!validate) {
    return res.status(403).send({ message: 'Forbidden' });
  }
  req.user = validate as StaffType;
  next();
};

export default isAuthenticated;
