import UserType from '../types/UserType';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: UserType;
}

export default AuthenticatedRequest;
