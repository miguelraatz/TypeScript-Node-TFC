import { JwtPayload } from 'jsonwebtoken';
import IUser from './users/IUser';

export interface TokenGenerator {
  generate(user: IUser): string;
  verifyToken(token: string): JwtPayload;
}
